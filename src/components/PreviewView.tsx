import React, { useState } from 'react';
import { ArrowLeft, Volume2, BookOpen, Rocket, Clock, Award, Sparkles, Check } from 'lucide-react';
import { Scene, DialogueTurn } from '../types';
import { speakText } from '../lib/speech';

interface PreviewViewProps {
  scene: Scene;
  onBack: () => void;
  onStartPractice: () => void;
}

export const PreviewView: React.FC<PreviewViewProps> = ({ scene, onBack, onStartPractice }) => {
  const [playingTurnIndex, setPlayingTurnIndex] = useState<number | null>(null);
  const [hoveredWord, setHoveredWord] = useState<{ word: string; meaning: string } | null>(null);

  const handleSpeakTurn = async (turn: DialogueTurn, idx: number) => {
    setPlayingTurnIndex(idx);
    await speakText(turn.text);
    setPlayingTurnIndex(null);
  };

  // Helper to highlight vocabulary words inside dialogue text
  const renderTextWithVocabHighlight = (text: string) => {
    let parts: (string | React.ReactNode)[] = [text];

    scene.vocabulary.forEach((vocab) => {
      const regex = new RegExp(`\\b(${vocab.word})\\b`, 'gi');
      const newParts: (string | React.ReactNode)[] = [];

      parts.forEach((part) => {
        if (typeof part === 'string') {
          const splitParts = part.split(regex);
          for (let i = 0; i < splitParts.length; i++) {
            const sub = splitParts[i];
            if (sub.toLowerCase() === vocab.word.toLowerCase()) {
              newParts.push(
                <span
                  key={`${vocab.word}-${i}-${Math.random()}`}
                  onMouseEnter={() => setHoveredWord({ word: vocab.word, meaning: vocab.meaning })}
                  onMouseLeave={() => setHoveredWord(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(vocab.word);
                    setHoveredWord({ word: vocab.word, meaning: vocab.meaning });
                  }}
                  className="relative inline-block font-bold text-indigo-700 bg-indigo-100/80 hover:bg-indigo-200 px-1.5 py-0.5 rounded-md cursor-pointer border-b-2 border-indigo-400 transition-colors mx-0.5"
                >
                  {sub}
                </span>
              );
            } else if (sub) {
              newParts.push(sub);
            }
          }
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28 animate-fade-in">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> 返回情景库
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-xs flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {scene.duration}
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-bold text-xs flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> {scene.difficulty === 'Beginner' ? '初级口语' : '进阶商务'}
          </span>
        </div>
      </div>

      {/* Scene Intro Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="w-20 h-20 shrink-0 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl shadow-inner">
          {scene.emoji}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{scene.title}</h2>
          </div>
          <h3 className="text-base font-semibold text-indigo-600 mb-2">{scene.titleZh}</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{scene.description}</p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span><strong>AI 陪练设定：</strong> {scene.aiRoleZh}（{scene.aiRole}）</span>
          </div>
        </div>
      </div>

      {/* Sticky Tooltip Toast when Hovering Vocab */}
      {hoveredWord && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold text-indigo-200 mr-2">{hoveredWord.word}:</span>
            <span className="text-sm font-medium">{hoveredWord.meaning}</span>
          </div>
          <span className="text-[10px] text-slate-400 ml-2">（点击听发音）</span>
        </div>
      )}

      {/* Main Grid: Sample Dialogue & Vocab Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Sample Dialogue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <span>💬 范例对话预习</span>
              <span className="text-xs font-normal text-slate-500">（生词已高亮，悬停看释义）</span>
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {scene.sampleDialogue.map((turn, idx) => {
              const isAi = turn.role === 'ai';
              const isPlaying = playingTurnIndex === idx;

              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-bold text-slate-400">
                      {isAi ? `🤖 AI (${scene.aiRoleZh.slice(0,6)}...)` : '👤 你 (User)'}
                    </span>
                  </div>

                  <div className={`relative max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 transition-all shadow-2xs group ${
                    isAi 
                      ? 'bg-slate-100/90 text-slate-800 rounded-tl-xs border border-slate-200/80' 
                      : 'bg-indigo-600 text-white rounded-tr-xs shadow-indigo-200'
                  }`}>
                    {/* Speak Button */}
                    <button
                      onClick={() => handleSpeakTurn(turn, idx)}
                      title="点击听标准发音"
                      className={`absolute top-3 ${isAi ? 'right-3' : 'left-3 -ml-10 sm:-ml-12'} p-2 rounded-xl transition-all cursor-pointer ${
                        isPlaying 
                          ? 'bg-amber-400 text-slate-900 animate-pulse scale-110' 
                          : isAi 
                            ? 'bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 shadow-2xs' 
                            : 'bg-white/20 hover:bg-white text-white hover:text-indigo-600 shadow-sm'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <div className={`text-sm sm:text-base leading-relaxed ${isAi ? 'pr-10' : ''}`}>
                      {renderTextWithVocabHighlight(turn.text)}
                    </div>

                    {turn.translation && (
                      <div className={`mt-2 pt-2 border-t text-xs ${
                        isAi ? 'border-slate-200 text-slate-500 font-medium' : 'border-indigo-500/50 text-indigo-100'
                      }`}>
                        {turn.translation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Vocabulary & Hints Sidebar */}
        <div className="space-y-6">
          {/* Vocabulary Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>本情景核心生词 ({scene.vocabulary.length})</span>
            </h3>

            <div className="space-y-3.5">
              {scene.vocabulary.map((v, idx) => (
                <div 
                  key={idx}
                  onClick={() => speakText(v.word)}
                  className="group p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/60 hover:border-indigo-300 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-indigo-600 group-hover:underline flex items-center gap-1">
                      {v.word} <Volume2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      {v.meaning}
                    </span>
                  </div>
                  {v.example && (
                    <p className="text-[11px] text-slate-500 italic line-clamp-2 mt-1">
                      "{v.example}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Useful Speaking Tips / Hints */}
          <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 border border-purple-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-purple-900 flex items-center gap-1.5 mb-3">
              💡 开口通关小锦囊：
            </h3>
            <ul className="space-y-2 text-xs text-purple-800 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <span>不必完全按范例说，表达清楚核心意图即可。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <span>点击下方麦克风录音，或直接在输入框敲字。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <span>6-8 轮对话完成后将自动为你出具教练点评分析。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky CTA Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="font-bold text-sm text-slate-900">{scene.title}</p>
            <p className="text-xs text-slate-500">已预习范例对话与发音</p>
          </div>

          <button
            onClick={onStartPractice}
            className="w-full sm:w-auto flex-1 sm:flex-none py-4 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-indigo-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Rocket className="w-5 h-5 animate-bounce" />
            <span>我准备好了，开始练习</span>
          </button>
        </div>
      </div>
    </div>
  );
};
