import React, { useState } from 'react';
import { Send, Mic, Camera } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

export default function ChatInput({ onSendMessage, isTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-16 left-0 right-0 p-4 bg-zinc-800/30 border-t border-zinc-700/30 sm:p-6 z-10">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          type="button"
          className="p-2 text-zinc-400 hover:text-orange-400 transition-all duration-300 rounded-full hover:bg-zinc-700/50 active:scale-95 sm:p-3"
        >
          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <button
          type="button"
          className="p-2 text-zinc-400 hover:text-orange-400 transition-all duration-300 rounded-full hover:bg-zinc-700/50 active:scale-95 sm:p-3"
        >
          <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isTyping ? "FitCoach is typing..." : "Ask me anything about fitness..."}
            disabled={isTyping}
            className="w-full px-4 py-2 bg-zinc-700/50 border border-zinc-600/30 text-zinc-100 placeholder-zinc-400 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 disabled:opacity-50 transition-all duration-300 text-sm sm:px-6 sm:py-3 sm:text-base"
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="bg-gradient-to-r from-orange-500/80 to-purple-600/80 text-white p-2 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 sm:p-3"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </form>
  );
}