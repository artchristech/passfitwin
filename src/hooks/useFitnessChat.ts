import { useState, useCallback } from 'react';
import { Message } from '../components/ChatMessage';
import useGameification from './useGameification';

export default function useFitnessChat() {
  const gamification = useGameification();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'I am designed to help you WIN at fitness.',
      timestamp: new Date(),
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [showPushupTracker, setShowPushupTracker] = useState(false);
  const [pushupTarget, setPushupTarget] = useState(10);

  const workoutDatabase = {
    'quick-workout': {
      title: "5-Minute Energy Booster",
      exercises: [
        { name: "Jumping Jacks", sets: 1, reps: 30, duration: "30s" },
        { name: "Push-ups", sets: 1, reps: 10, duration: "30s" },
        { name: "Squats", sets: 1, reps: 15, duration: "30s" },
        { name: "Plank", sets: 1, reps: 1, duration: "30s" },
        { name: "Burpees", sets: 1, reps: 5, duration: "30s" }
      ]
    },
    'daily-challenge': {
      title: "Daily Challenge",
      exercises: [
        { name: "Mountain Climbers", sets: 3, reps: 20, duration: "45s" },
        { name: "Lunges", sets: 2, reps: 12, duration: "60s" },
        { name: "Russian Twists", sets: 3, reps: 20, duration: "45s" }
      ]
    },
    'strength-training': {
      title: "Strength Building Session",
      exercises: [
        { name: "Push-ups", sets: 3, reps: 15, duration: "60s" },
        { name: "Squats", sets: 3, reps: 20, duration: "60s" },
        { name: "Plank", sets: 3, reps: 1, duration: "45s" },
        { name: "Deadlifts", sets: 3, reps: 12, duration: "60s" }
      ]
    },
    'cardio-boost': {
      title: "Cardio Blast",
      exercises: [
        { name: "High Knees", sets: 3, reps: 30, duration: "45s" },
        { name: "Burpees", sets: 3, reps: 10, duration: "60s" },
        { name: "Jump Squats", sets: 3, reps: 15, duration: "45s" }
      ]
    }
  };

  const generateResponse = useCallback((userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('goal') || message.includes('want to')) {
      return "Awesome! Setting clear goals is the first step to success. Based on what you're telling me, I can create a personalized workout plan. What's your current fitness level? Beginner, intermediate, or advanced? 🎯";
    }
    
    if (message.includes('beginner')) {
      return "Perfect! As a beginner, we'll start with bodyweight exercises and focus on building a solid foundation. I recommend starting with 3 workouts per week. Ready for your first workout? 🌟";
    }
    
    if (message.includes('lose weight') || message.includes('weight loss')) {
      return "Great choice! Weight loss is about creating a calorie deficit through exercise and nutrition. I'll focus on high-intensity workouts and compound movements. Are you ready to burn some calories? 🔥";
    }
    
    if (message.includes('build muscle') || message.includes('strength')) {
      return "Excellent! Building muscle requires progressive overload and consistency. I'll design strength-focused workouts for you. Do you have access to weights or prefer bodyweight exercises? 💪";
    }
    
    if (message.includes('time') || message.includes('busy')) {
      return "I totally get it! Even 10-15 minutes can make a huge difference. I have quick, efficient workouts that fit any schedule. Want to try a 5-minute energy booster? ⚡";
    }
    
    if (message.includes('motivation') || message.includes('motivated')) {
      return `You've got this! You're Level ${gamification.gameState.level} and have a ${gamification.gameState.streak}-day streak! Remember, every workout counts. What's driving you to get fit? 🚀`;
    }
    
    if (message.includes('diet') || message.includes('nutrition')) {
      return "Great question! Nutrition is crucial for results. Focus on whole foods, adequate protein, and staying hydrated. Would you like some specific meal prep ideas or nutrition tips? 🥗";
    }
    
    return "I love your enthusiasm! Whether you're looking to build strength, lose weight, or just feel more energetic, I'm here to guide you. What specific area would you like to focus on today? 💪";
  }, []);

  const sendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(content),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  }, [generateResponse]);

  const handleQuickAction = useCallback((action: string) => {
    const workout = workoutDatabase[action as keyof typeof workoutDatabase];
    if (!workout) return;

    setActiveWorkout(workout);
  }, []);

  const handleStartPushupTracking = useCallback((targetReps: number) => {
    setPushupTarget(targetReps);
    setShowPushupTracker(true);
  }, []);

  const handlePushupComplete = useCallback((reps: number, duration: number) => {
    const sessionData = {
      totalTime: duration,
      exercisesCompleted: 1,
      caloriesBurned: Math.floor(reps * 0.5), // Rough calculation
    };
    
    gamification.completeWorkout(sessionData);
    setShowPushupTracker(false);
    
    const completionMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Incredible work! 🎉 You completed ${reps} pushups in ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}! Your form analysis showed great technique. You earned ${reps * 2} XP for this camera-tracked workout!`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, completionMessage]);
  }, [gamification]);
  const handleWorkoutComplete = useCallback((sessionData: any) => {
    gamification.completeWorkout(sessionData);
    setActiveWorkout(null);
    
    const completionMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Amazing work! 🎉 You completed the workout in ${Math.floor(sessionData.totalTime / 60)} minutes and burned approximately ${sessionData.caloriesBurned} calories. You earned ${sessionData.exercisesCompleted * 20} XP! Keep up the great work!`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, completionMessage]);
  }, [gamification]);

  return {
    messages,
    isTyping,
    activeWorkout,
    showPushupTracker,
    pushupTarget,
    sendMessage,
    handleQuickAction,
    handleStartPushupTracking,
    handlePushupComplete,
    handleWorkoutComplete,
    setActiveWorkout,
    setShowPushupTracker,
    gamification,
  };
}