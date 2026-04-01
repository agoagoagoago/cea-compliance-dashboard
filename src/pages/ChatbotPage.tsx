import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/components/chatbot/ChatMessage';
import { ChatInput } from '@/components/chatbot/ChatInput';
import { AlertBanner } from '@/components/common/AlertBanner';
import { BookOpen, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'What are the CDD requirements before a property transaction?',
  'What is the minimum PI insurance for an agency with 20 salespersons?',
  'What are the penalties for dual representation?',
  'How many CPE hours are required per year?',
  'What records must be kept for 5 years?',
  'What triggers enhanced CDD measures?',
  'What are the dispute resolution procedures?',
  'When must a suspicious transaction report be filed?',
];

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (content: string) => {
    setError(null);

    const userMessage: Message = { id: `msg-${Date.now()}`, role: 'user', content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsStreaming(true);

    const assistantId = `msg-${Date.now() + 1}`;
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + parsed.text } : m
                )
              );
            }
          } catch {
            // skip malformed JSON chunks
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-6 py-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Regulation Assistant</h2>
            <p className="text-xs text-gray-500">
              Ask questions about the Estate Agents Act 2010 and all 12 subsidiary regulations
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 pt-3">
          <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12">
            <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ask about Singapore real estate regulations</h3>
            <p className="text-sm text-gray-500 text-center max-w-lg mb-6">
              This assistant has access to all 12 CEA regulatory documents including the Estate Agents Act 2010,
              AML/CFT Regulations, Licensing Regulations, and more. Ask any compliance question.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm text-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
