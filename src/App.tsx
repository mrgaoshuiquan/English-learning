/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Scene, UserStats } from './types';
import { SCENES } from './data/scenes';
import { getUserStats } from './lib/storage';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PreviewView } from './components/PreviewView';
import { PracticeView } from './components/PracticeView';
import { FeedbackView } from './components/FeedbackView';
import { SavedPhrasesModal } from './components/SavedPhrasesModal';

type ViewMode = 'home' | 'preview' | 'practice' | 'feedback';

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => getUserStats());
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [practiceTranscript, setPracticeTranscript] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  const [practiceRounds, setPracticeRounds] = useState<number>(0);
  const [showPhrasesModal, setShowPhrasesModal] = useState(false);

  const handleSelectScene = (scene: Scene) => {
    setSelectedScene(scene);
    setViewMode('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPracticeFromPreview = () => {
    setViewMode('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeFinish = (conversation: { role: 'ai' | 'user'; text: string }[], rounds: number) => {
    setPracticeTranscript(conversation);
    setPracticeRounds(rounds);
    setViewMode('feedback');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Refresh stats from localStorage since FeedbackView might update it
    setTimeout(() => {
      setStats(getUserStats());
    }, 1000);
  };

  const handleGoHome = () => {
    setViewMode('home');
    setSelectedScene(null);
    setStats(getUserStats());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryScene = (sceneId: string) => {
    const found = SCENES.find(s => s.id === sceneId);
    if (found) {
      handleSelectScene(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white font-sans antialiased">
      <Navbar
        stats={stats}
        onOpenSavedPhrases={() => {
          setStats(getUserStats());
          setShowPhrasesModal(true);
        }}
        onGoHome={handleGoHome}
      />

      <main className="flex-1">
        {viewMode === 'home' && (
          <HomeView
            scenes={SCENES}
            completedSceneIds={stats.completedScenes || []}
            onSelectScene={handleSelectScene}
          />
        )}

        {viewMode === 'preview' && selectedScene && (
          <PreviewView
            scene={selectedScene}
            onBack={handleGoHome}
            onStartPractice={handleStartPracticeFromPreview}
          />
        )}

        {viewMode === 'practice' && selectedScene && (
          <PracticeView
            scene={selectedScene}
            onFinish={handlePracticeFinish}
            onCancel={handleGoHome}
          />
        )}

        {viewMode === 'feedback' && selectedScene && (
          <FeedbackView
            scene={selectedScene}
            conversation={practiceTranscript}
            rounds={practiceRounds}
            onRetry={() => {
              setViewMode('practice');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onChooseNewScene={handleGoHome}
          />
        )}
      </main>

      {showPhrasesModal && (
        <SavedPhrasesModal
          stats={stats}
          onClose={() => {
            setShowPhrasesModal(false);
            setStats(getUserStats());
          }}
          onStatsUpdate={(newStats) => setStats(newStats)}
          onSelectHistoryScene={handleSelectHistoryScene}
        />
      )}
    </div>
  );
}
