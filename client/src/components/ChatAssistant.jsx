import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatAssistant = () => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-2 text-muted-foreground/70 mb-2">
      <MessageSquare size={16} />
      <span className="text-xs font-bold tracking-widest uppercase">AI Assistant</span>
    </div>
    <div className="flex-1 border border-white/5 rounded-xl flex items-center justify-center text-white/20 text-xs font-medium bg-black/20 backdrop-blur-sm">
      Chat Interface Placeholder
    </div>
    <div className="mt-4">
      <input
        type="text"
        placeholder="Ask the agent..."
        className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white focus:outline-none placeholder:text-white/20"
      />
    </div>
  </div>
);

export default ChatAssistant;
