import React from 'react';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';

interface ProgressStatsProps {
  stats: {
    weeklyWorkouts: number;
    caloriesBurned: number;
    averageWorkoutTime: number;
    completionRate: number;
  };
}

export default function ProgressStats({ stats }: ProgressStatsProps) {
  return (
    <div className="p-4 bg-zinc-800/40 border-l-4 border-orange-400 rounded-2xl sm:p-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-3">
        <TrendingUp className="w-5 h-5 text-orange-400" />
        <h3 className="font-semibold text-zinc-100">This Week's Progress</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-xl font-bold text-zinc-100 sm:text-2xl">{stats.weeklyWorkouts}</span>
          </div>
          <p className="text-xs text-zinc-400 sm:text-sm">Workouts</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Award className="w-4 h-4 text-green-400" />
            <span className="text-xl font-bold text-zinc-100 sm:text-2xl">{stats.caloriesBurned}</span>
          </div>
          <p className="text-xs text-zinc-400 sm:text-sm">Calories</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xl font-bold text-zinc-100 sm:text-2xl">{stats.averageWorkoutTime}</span>
          </div>
          <p className="text-xs text-zinc-400 sm:text-sm">Avg Minutes</p>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-zinc-100 sm:text-2xl">{stats.completionRate}%</div>
          <p className="text-xs text-zinc-400 sm:text-sm">Completion</p>
        </div>
      </div>
    </div>
  );
}