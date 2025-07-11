import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex mr-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/80 to-purple-600/80 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="bg-zinc-700/50 border border-zinc-600/30 rounded-3xl px-5 py-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}