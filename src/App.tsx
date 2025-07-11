import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Award, Target } from 'lucide-react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import QuickActions from './components/QuickActions';
import TypingIndicator from './components/TypingIndicator';
import ProgressStats from './components/ProgressStats';
import WorkoutSession from './components/WorkoutSession';
import ChallengesTab from './components/ChallengesTab';
import AchievementsTab from './components/AchievementsTab';
import PushupTracker from './components/PushupTracker';
import CameraWorkoutCard from './components/CameraWorkoutCard';
import useFitnessChat from './hooks/useFitnessChat';

function App() {
  const { 
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
    gamification
  } = useFitnessChat();
  
  const [activeTab, setActiveTab] = useState<'chat' | 'challenges' | 'achievements'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const mockStats = {
    weeklyWorkouts: 5,
    caloriesBurned: 1250,
    averageWorkoutTime: 28,
    completionRate: 85,
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeTab]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FitCoach AI - My Personal Fitness Journey',
        text: `I'm Level ${gamification.gameState.level} with ${gamification.gameState.totalPoints} points and a ${gamification.gameState.streak}-day streak with FitCoach AI! 💪`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I'm Level ${gamification.gameState.level} with ${gamification.gameState.totalPoints} points and a ${gamification.gameState.streak}-day streak with FitCoach AI! 💪 Check it out: ${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <Header 
        streak={gamification.gameState.streak} 
        totalWorkouts={gamification.gameState.achievements.filter(a => a.unlockedAt).length} 
        onShare={handleShare}
      />
      
      {/* Tab Navigation */}
      <div className="bg-zinc-800/50 border-b border-zinc-700/50">
        <div className="max-w-4xl mx-auto flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 rounded-t-2xl ${
              activeTab === 'chat'
                ? 'text-orange-400 bg-zinc-800 border-b-2 border-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 flex items-center justify-center space-x-2 rounded-t-2xl ${
              activeTab === 'challenges'
                ? 'text-orange-400 bg-zinc-800 border-b-2 border-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Challenges</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 flex items-center justify-center space-x-2 rounded-t-2xl ${
              activeTab === 'achievements'
                ? 'text-orange-400 bg-zinc-800 border-b-2 border-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Achievements</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-zinc-800/30 rounded-3xl m-4 overflow-hidden">
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length > 3 && (
                <ProgressStats stats={mockStats} />
              )}
              
              {messages.length > 5 && (
                <CameraWorkoutCard onStartPushupTracking={handleStartPushupTracking} />
              )}
              
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isTyping && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>
            
            <QuickActions 
              onQuickAction={handleQuickAction} 
              onStartPushupTracking={handleStartPushupTracking}
            />
            <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
          </>
        )}
        
        {activeTab === 'challenges' && (
          <div className="flex-1 overflow-y-auto">
            <ChallengesTab
              challenges={gamification.gameState.activeChallenges}
              onAcceptChallenge={gamification.acceptChallenge}
              onClaimReward={gamification.claimReward}
            />
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="flex-1 overflow-y-auto">
            <AchievementsTab
              achievements={gamification.gameState.achievements}
              newAchievements={gamification.newAchievements}
              level={gamification.gameState.level}
              xp={gamification.gameState.xp}
              xpToNextLevel={gamification.gameState.xpToNextLevel}
            />
          </div>
        )}
      </div>
      
      {/* Workout Session Modal */}
      {activeWorkout && (
        <WorkoutSession
          workout={activeWorkout}
          onComplete={handleWorkoutComplete}
          onClose={() => setActiveWorkout(null)}
        />
      )}
      
      {/* Pushup Tracker Modal */}
      {showPushupTracker && (
        <PushupTracker
          targetReps={pushupTarget}
          onComplete={handlePushupComplete}
          onClose={() => setShowPushupTracker(false)}
        />
      )}
    </div>
  );
}

export default App;