import React from 'react';
import { Bot, User, Clock, Zap, Target, Calendar } from 'lucide-react';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  workoutData?: {
    exercise: string;
    sets: number;
    reps: number;
    duration?: string;
  };
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.type === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in sm:mb-6`}>
      <div className={`flex max-w-[85%] sm:max-w-xs lg:max-w-md ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 ${isBot ? 'mr-2 sm:mr-3' : 'ml-2 sm:ml-3'}`}>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
            isBot ? 'bg-gradient-to-br from-orange-500/80 to-purple-600/80' : 'bg-zinc-600'
          }`}>
            {isBot ? <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" /> : <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />}
          </div>
        </div>
        
        <div className={`rounded-3xl px-4 py-3 sm:px-5 ${
          isBot 
            ? 'bg-zinc-700/50 border border-zinc-600/30 text-zinc-100' 
            : 'bg-gradient-to-r from-orange-500/80 to-purple-600/80 text-white'
        }`}>
          <p className={`text-sm leading-relaxed ${isBot ? 'text-zinc-100' : 'text-white'}`}>
            {message.content}
          </p>
          
          {message.workoutData && (
            <div className="mt-3 p-3 bg-zinc-800/50 rounded-2xl border border-zinc-600/30 animate-slide-up">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="font-semibold text-zinc-100">{message.workoutData.exercise}</span>
              </div>
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-zinc-300 flex-wrap gap-y-1">
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>{message.workoutData.sets} sets</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>×</span>
                  <span>{message.workoutData.reps} reps</span>
                </div>
                {message.workoutData.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{message.workoutData.duration}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <p className={`text-xs mt-2 opacity-70 ${
            isBot ? 'text-zinc-400' : 'text-white/60'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}