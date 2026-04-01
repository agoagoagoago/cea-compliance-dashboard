import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Load regulation text
const regulationsPath = path.join(__dirname, 'regulations.json');
const regulations: Record<string, string> = JSON.parse(fs.readFileSync(regulationsPath, 'utf-8'));

const regulationText = Object.entries(regulations)
  .map(([name, text]) => `=== ${name} ===\n\n${text}`)
  .join('\n\n\n');

const SYSTEM_PROMPT = `You are a regulatory compliance assistant for Singapore real estate agencies, specialising in the Estate Agents Act 2010 and its subsidiary legislation.

IMPORTANT RULES:
- Answer questions ONLY based on the regulation text provided below.
- If the answer is not found in the regulations, say so clearly — do NOT make up information.
- Always cite the specific section number, regulation number, or act name when answering.
- Format your answers clearly with headings and bullet points where appropriate.
- When quoting from the regulations, use the exact wording.
- If a question is ambiguous, explain the different possible interpretations based on the regulations.

Below are the full texts of all 12 regulatory documents that govern estate agency work in Singapore:

${regulationText}`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
    return;
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'messages array required' });
    return;
  }

  const client = new Anthropic({ apiKey });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Claude API error:', message);
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

// Serve static files in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
