import React from 'react';
import { Award, Star, Trophy } from 'lucide-react';
import AchievementBadge, { Achievement } from './AchievementBadge';

interface AchievementsTabProps {
  achievements: Achievement[];
  newAchievements: string[];
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export default function AchievementsTab({ 
  achievements, 
  newAchievements, 
  level, 
  xp, 
  xpToNextLevel 
}: AchievementsTabProps) {
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  const xpProgress = (xp / xpToNextLevel) * 100;

  return (
    <div className="p-4 space-y-4 sm:space-y-6 overflow-y-auto">
      {/* Level Progress */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Level {level}</h2>
            <p className="opacity-90 text-sm sm:text-base">Fitness Champion</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full sm:p-3">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{xp} XP</span>
            <span>{xpToNextLevel} XP to next level</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
            <div 
              className="bg-white h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-zinc-700/50 rounded-xl border border-zinc-600/30 sm:p-4">
          <div className="text-xl font-bold text-zinc-100 sm:text-2xl">{unlockedAchievements.length}</div>
          <div className="text-xs text-zinc-300 sm:text-sm">Unlocked</div>
        </div>
        <div className="text-center p-3 bg-zinc-700/50 rounded-xl border border-zinc-600/30 sm:p-4">
          <div className="text-xl font-bold text-zinc-100 sm:text-2xl">{achievements.length}</div>
          <div className="text-xs text-zinc-300 sm:text-sm">Total</div>
        </div>
        <div className="text-center p-3 bg-zinc-700/50 rounded-xl border border-zinc-600/30 sm:p-4">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </div>
          <div className="text-xl font-bold text-zinc-100 sm:text-2xl">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </div>
          <div className="text-xs text-zinc-300 sm:text-sm">Complete</div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-zinc-100">Unlocked Achievements</h3>
        </div>
        
        {unlockedAchievements.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="text-center">
                <AchievementBadge 
                  achievement={achievement} 
                  isNew={newAchievements.includes(achievement.id)}
                />
                <p className="text-xs font-medium text-zinc-100 mt-2">{achievement.title}</p>
                <p className="text-xs text-zinc-400 hidden sm:block">{achievement.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Complete workouts to unlock achievements!</p>
          </div>
        )}
      </div>

      {/* Locked Achievements */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-zinc-100">Locked Achievements</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
          {lockedAchievements.map(achievement => (
            <div key={achievement.id} className="text-center">
              <AchievementBadge achievement={achievement} />
              <p className="text-xs font-medium text-zinc-300 mt-2">{achievement.title}</p>
              <p className="text-xs text-zinc-500 hidden sm:block">{achievement.description}</p>
              {achievement.progress && (
                <div className="mt-1">
                  <div className="text-xs text-zinc-400">
                    {achievement.progress.current}/{achievement.progress.target}
                  </div>
                  <div className="w-full bg-zinc-600 rounded-full h-1 mt-1">
                    <div 
                      className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(achievement.progress.current / achievement.progress.target) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}