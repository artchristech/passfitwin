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
    <form onSubmit={handleSubmit} className="p-6 bg-zinc-800/30 border-t border-zinc-700/30">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="p-3 text-zinc-400 hover:text-orange-400 transition-all duration-300 rounded-full hover:bg-zinc-700/50"
        >
          <Camera className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          className="p-3 text-zinc-400 hover:text-orange-400 transition-all duration-300 rounded-full hover:bg-zinc-700/50"
        >
          <Mic className="w-5 h-5" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isTyping ? "FitCoach is typing..." : "Ask me anything about fitness..."}
            disabled={isTyping}
            className="w-full px-6 py-3 bg-zinc-700/50 border border-zinc-600/30 text-zinc-100 placeholder-zinc-400 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 disabled:opacity-50 transition-all duration-300"
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="bg-gradient-to-r from-orange-500/80 to-purple-600/80 text-white p-3 rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}