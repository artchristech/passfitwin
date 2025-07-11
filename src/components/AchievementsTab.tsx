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
    <div className="p-4 space-y-6">
      {/* Level Progress */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {level}</h2>
            <p className="opacity-90">Fitness Champion</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Trophy className="w-8 h-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{xp} XP</span>
            <span>{xpToNextLevel} XP to next level</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{unlockedAchievements.length}</div>
          <div className="text-sm text-gray-600">Unlocked</div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{achievements.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">Unlocked Achievements</h3>
        </div>
        
        {unlockedAchievements.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {unlockedAchievements.map(achievement => (
              <div key={achievement.id} className="text-center">
                <AchievementBadge 
                  achievement={achievement} 
                  isNew={newAchievements.includes(achievement.id)}
                />
                <p className="text-xs font-medium text-gray-800 mt-2">{achievement.title}</p>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Complete workouts to unlock achievements!</p>
          </div>
        )}
      </div>

      {/* Locked Achievements */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">Locked Achievements</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {lockedAchievements.map(achievement => (
            <div key={achievement.id} className="text-center">
              <AchievementBadge achievement={achievement} />
              <p className="text-xs font-medium text-gray-600 mt-2">{achievement.title}</p>
              <p className="text-xs text-gray-500">{achievement.description}</p>
              {achievement.progress && (
                <div className="mt-1">
                  <div className="text-xs text-gray-500">
                    {achievement.progress.current}/{achievement.progress.target}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
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