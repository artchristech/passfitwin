import React from 'react';
import { Dumbbell, Share2, Trophy } from 'lucide-react';

interface HeaderProps {
  streak: number;
  totalWorkouts: number;
  onShare: () => void;
}

export default function Header({ streak, totalWorkouts, onShare }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-orange-500/80 to-purple-600/80 text-white p-4 rounded-3xl m-2 mb-0 backdrop-blur-sm sm:p-6 sm:m-4">
      <div className="w-full max-w-md mx-auto flex items-center justify-between sm:max-w-4xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full sm:p-3">
            <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold sm:text-xl">FitCoach AI</h1>
            <p className="text-xs opacity-80 sm:text-sm">Your Personal Fitness Companion</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-center bg-white/10 rounded-2xl px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
            <div className="flex items-center space-x-1">
              <Trophy className="w-3 h-3 text-yellow-300 sm:w-4 sm:h-4" />
              <span className="text-xs font-bold sm:text-sm sm:font-semibold">{streak}</span>
            </div>
            <p className="text-xs opacity-70 hidden sm:block">day streak</p>
          </div>
          
          <div className="text-center bg-white/10 rounded-2xl px-2 py-1 sm:bg-transparent sm:px-0 sm:py-0">
            <div className="text-xs font-bold sm:text-sm sm:font-semibold">{totalWorkouts}</div>
            <p className="text-xs opacity-70 hidden sm:block">workouts</p>
          </div>
          
          <button
            onClick={onShare}
            className="bg-white/20 hover:bg-white/30 transition-all duration-300 p-2 rounded-full hover:scale-105 active:scale-95 sm:p-3"
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}