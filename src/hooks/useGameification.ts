import { useState, useCallback, useEffect } from 'react';
import { Challenge, Achievement } from '../components/ChallengeCard';

interface GameificationState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalPoints: number;
  streak: number;
  achievements: Achievement[];
  activeChallenges: Challenge[];
  completedChallenges: string[];
}

export default function useGameification() {
  const [gameState, setGameState] = useState<GameificationState>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalPoints: 0,
    streak: 7,
    achievements: [
      {
        id: 'first-workout',
        title: 'First Steps',
        description: 'Complete your first workout',
        icon: 'trophy',
        rarity: 'common',
        unlockedAt: new Date(),
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintain a 7-day workout streak',
        icon: 'flame',
        rarity: 'rare',
        unlockedAt: new Date(),
      },
      {
        id: 'hundred-workouts',
        title: 'Century Club',
        description: 'Complete 100 workouts',
        icon: 'star',
        rarity: 'epic',
        progress: { current: 23, target: 100 },
      },
      {
        id: 'perfect-month',
        title: 'Perfect Month',
        description: 'Complete every daily challenge in a month',
        icon: 'award',
        rarity: 'legendary',
        progress: { current: 15, target: 30 },
      },
    ],
    activeChallenges: [
      {
        id: 'daily-pushups',
        title: '50 Push-ups Challenge',
        description: 'Complete 50 push-ups in a single session',
        type: 'daily',
        difficulty: 'medium',
        reward: { points: 100, badge: 'Push-up Master' },
        progress: { current: 32, target: 50 },
        timeLeft: '18h 42m',
        participants: 1247,
        isCompleted: false,
      },
      {
        id: 'weekly-cardio',
        title: 'Cardio Week',
        description: 'Complete 5 cardio workouts this week',
        type: 'weekly',
        difficulty: 'hard',
        reward: { points: 300, badge: 'Cardio Champion' },
        progress: { current: 3, target: 5 },
        timeLeft: '4 days',
        participants: 892,
        isCompleted: false,
      },
      {
        id: 'plank-master',
        title: 'Plank Master',
        description: 'Hold a plank for 2 minutes straight',
        type: 'special',
        difficulty: 'hard',
        reward: { points: 200, badge: 'Iron Core' },
        progress: { current: 90, target: 120 },
        participants: 2156,
        isCompleted: false,
      },
      {
        id: 'morning-routine',
        title: 'Early Bird',
        description: 'Complete a workout before 8 AM',
        type: 'daily',
        difficulty: 'easy',
        reward: { points: 50 },
        progress: { current: 1, target: 1 },
        timeLeft: '6h 15m',
        participants: 567,
        isCompleted: true,
      },
    ],
    completedChallenges: ['morning-routine'],
  });

  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  const calculateXPForNextLevel = (level: number) => {
    return level * 100 + (level - 1) * 50;
  };

  const addXP = useCallback((amount: number) => {
    setGameState(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNextLevel = prev.xpToNextLevel;

      // Check for level up
      while (newXP >= newXPToNextLevel) {
        newXP -= newXPToNextLevel;
        newLevel++;
        newXPToNextLevel = calculateXPForNextLevel(newLevel);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNextLevel,
        totalPoints: prev.totalPoints + amount,
      };
    });
  }, []);

  const completeWorkout = useCallback((sessionData: {
    totalTime: number;
    exercisesCompleted: number;
    caloriesBurned: number;
  }) => {
    const baseXP = sessionData.exercisesCompleted * 20;
    const timeBonus = Math.floor(sessionData.totalTime / 60) * 5;
    const totalXP = baseXP + timeBonus;

    addXP(totalXP);

    // Update streak
    setGameState(prev => ({
      ...prev,
      streak: prev.streak + 1,
    }));

    // Check for new achievements
    checkAchievements(sessionData);
  }, [addXP]);

  const checkAchievements = useCallback((sessionData: any) => {
    setGameState(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.unlockedAt) return achievement;

        // Check achievement conditions
        switch (achievement.id) {
          case 'hundred-workouts':
            const newWorkoutCount = (achievement.progress?.current || 0) + 1;
            if (newWorkoutCount >= 100) {
              setNewAchievements(current => [...current, achievement.id]);
              return { ...achievement, unlockedAt: new Date() };
            }
            return {
              ...achievement,
              progress: { current: newWorkoutCount, target: 100 }
            };
          
          default:
            return achievement;
        }
      });

      return { ...prev, achievements: updatedAchievements };
    });
  }, []);

  const acceptChallenge = useCallback((challengeId: string) => {
    // In a real app, this would make an API call
    console.log('Accepted challenge:', challengeId);
  }, []);

  const claimReward = useCallback((challengeId: string) => {
    setGameState(prev => {
      const challenge = prev.activeChallenges.find(c => c.id === challengeId);
      if (challenge && challenge.isCompleted) {
        addXP(challenge.reward.points);
        return {
          ...prev,
          completedChallenges: [...prev.completedChallenges, challengeId],
        };
      }
      return prev;
    });
  }, [addXP]);

  const updateChallengeProgress = useCallback((challengeId: string, progress: number) => {
    setGameState(prev => ({
      ...prev,
      activeChallenges: prev.activeChallenges.map(challenge =>
        challenge.id === challengeId
          ? {
              ...challenge,
              progress: { ...challenge.progress, current: progress },
              isCompleted: progress >= challenge.progress.target,
            }
          : challenge
      ),
    }));
  }, []);

  const dismissNewAchievement = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(id => id !== achievementId));
  }, []);

  return {
    gameState,
    newAchievements,
    completeWorkout,
    acceptChallenge,
    claimReward,
    updateChallengeProgress,
    dismissNewAchievement,
    addXP,
  };
}