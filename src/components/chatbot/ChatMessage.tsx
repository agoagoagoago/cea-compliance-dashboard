import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3 py-4 px-4', isUser ? 'bg-white' : 'bg-gray-50')}>
      <div className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
        isUser ? 'bg-primary' : 'bg-emerald-600'
      )}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 mb-1">
          {isUser ? 'You' : 'Regulation Assistant'}
        </p>
        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap break-words prose prose-sm max-w-none">
          {content}
          {isStreaming && <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-0.5" />}
        </div>
      </div>
    </div>
  );
}
