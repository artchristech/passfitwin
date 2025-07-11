import React from 'react';
import { Dumbbell, Share2, Trophy } from 'lucide-react';

interface HeaderProps {
  streak: number;
  totalWorkouts: number;
  onShare: () => void;
}

export default function Header({ streak, totalWorkouts, onShare }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-orange-500/80 to-purple-600/80 text-white p-6 rounded-3xl m-4 mb-0 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FitCoach AI</h1>
            <p className="text-sm opacity-80">Your Personal Fitness Companion</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold">{streak}</span>
            </div>
            <p className="text-xs opacity-70">day streak</p>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-semibold">{totalWorkouts}</div>
            <p className="text-xs opacity-70">workouts</p>
          </div>
          
          <button
            onClick={onShare}
            className="bg-white/20 hover:bg-white/30 transition-all duration-300 p-3 rounded-full hover:scale-105"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}