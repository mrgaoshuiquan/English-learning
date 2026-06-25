import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, RefreshCw, Layers, CheckCircle2, ArrowRight, Volume2, Bookmark, Check, ThumbsUp, AlertTriangle } from 'lucide-react';
import { Scene, FeedbackReport, LearnedPhrase } from '../types';
import { speakText } from '../lib/speech';
import { savePracticeRecord, toggleSavePhrase, getUserStats } from '../lib/storage';

interface FeedbackViewProps {
  scene: Scene;
  conversation: { role: 'ai' | 'user'; text: string }[];
  rounds: number;
  onRetry: () => void;
  onChooseNewScene: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  scene,
  conversation,
  rounds,
  onRetry,
  onChooseNewScene
}) => {
  const [report, setReport] = useState<FeedbackReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedPhrasesMap, setSavedPhrasesMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load saved phrases map initially
    const stats = getUserStats();
    const map: Record<string, boolean> = {};
    stats.savedPhrases?.forEach(p => {
      map[p.phrase.toLowerCase()] = true;
    });
    setSavedPhrasesMap(map);

    async function fetchReport() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sceneTitle: scene.title,
            aiRole: scene.aiRole,
            conversation
          })
        });

        const rawText = await response.text();
        let data: any;
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          throw new Error(`后端接口异常（状态码 ${response.status}）：未返回有效JSON数据`);
        }

        if (!response.ok) {
          throw new Error(data?.error || `服务器请求失败 (${response.status})`);
        }

        setReport(data);

        // Save practice record to storage
        savePracticeRecord({
          id: `record-${Date.now()}`,
          sceneId: scene.id,
          sceneTitle: scene.titleZh,
          completedAt: new Date().toISOString(),
          rounds,
          report: data
        });

        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899']
          });
        } catch (e) {
          // ignore
        }
      } catch (err: any) {
        setErrorMsg(err.message || '反馈点评生成超时');
      } finally {
        setIsLoading(false);
      }
    }

    fetchReport();
  }, [scene, conversation, rounds]);

  const handleTogglePhraseBookmark = (phrase: LearnedPhrase) => {
    const res = toggleSavePhrase(phrase);
    setSavedPhrasesMap(prev => ({
      ...prev,
      [phrase.phrase.toLowerCase()]: res.saved
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl mx-auto flex items-center justify-center mb-6 border border-indigo-100 shadow-inner">
          <Sparkles className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">AI 英语教练正在点评分析...</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
          正全面评估你在「{scene.titleZh}」场景中的发音流畅度、语法准确性与地道自然度。
        </p>

        {/* Loading Skeleton */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6 max-w-xl mx-auto">
          <div className="flex justify-around gap-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 animate-pulse"></div>
            <div className="w-20 h-20 rounded-2xl bg-slate-100 animate-pulse"></div>
            <div className="w-20 h-20 rounded-2xl bg-slate-100 animate-pulse"></div>
          </div>
          <div className="h-6 bg-slate-100 rounded-lg w-3/4 mx-auto animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
            <div className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !report) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full mx-auto flex items-center justify-center mb-4 text-2xl">
          ⚠️
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">生成反馈点评失败</h3>
        <p className="text-slate-500 text-sm mb-6">{errorMsg || '未知错误'}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onRetry} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-xs cursor-pointer">
            重新练习该情景
          </button>
          <button onClick={onChooseNewScene} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer">
            返回情景库
          </button>
        </div>
      </div>
    );
  }

  const renderScoreBar = (score: number) => {
    return (
      <div className="flex gap-1 mt-1.5">
        {[1, 2, 3, 4, 5].map(s => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-all ${
              s <= score 
                ? score >= 4 ? 'bg-emerald-500' : score === 3 ? 'bg-amber-500' : 'bg-indigo-500'
                : 'bg-slate-100'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32 animate-fade-in">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-3 shadow-2xs">
          <Award className="w-4 h-4 text-emerald-600" /> 对练结业评估报告
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>{scene.emoji}</span>
          <span>{scene.titleZh}</span>
        </h2>
        <p className="text-slate-500 text-sm mt-2">共完成 {rounds} 轮开口实战交流</p>
      </div>

      {/* 1. Overall Score Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>五分制核心口语评分 (Overall Scores)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Fluency */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-700 text-sm">发音流畅度 Fluency</span>
              <span className="font-black text-xl text-indigo-600">{report.scores.fluency} <span className="text-xs text-slate-400 font-normal">/5</span></span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">语速适中与句子完整性</p>
            {renderScoreBar(report.scores.fluency)}
          </div>

          {/* Accuracy */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-700 text-sm">表达准确度 Accuracy</span>
              <span className="font-black text-xl text-emerald-600">{report.scores.accuracy} <span className="text-xs text-slate-400 font-normal">/5</span></span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">词汇选择与语法规范</p>
            {renderScoreBar(report.scores.accuracy)}
          </div>

          {/* Naturalness */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-700 text-sm">地道自然度 Naturalness</span>
              <span className="font-black text-xl text-purple-600">{report.scores.naturalness} <span className="text-xs text-slate-400 font-normal">/5</span></span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">符合母语者口语习惯</p>
            {renderScoreBar(report.scores.naturalness)}
          </div>
        </div>
      </div>

      {/* 2. Highlights & Improvements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Highlights: 做得好的地方 */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-start">
          <h3 className="font-bold text-base text-emerald-800 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200 flex items-center gap-2 mb-5">
            <ThumbsUp className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>做得好的地方 (Highlights)</span>
          </h3>

          <ul className="space-y-3.5 flex-1">
            {report.highlights?.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 leading-relaxed font-medium">{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements: 可以更好的表达 */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-start">
          <h3 className="font-bold text-base text-amber-800 bg-amber-50 px-4 py-3 rounded-2xl border border-amber-200 flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>可以更好的表达 (Better Expressions)</span>
          </h3>

          <div className="space-y-4 flex-1">
            {report.improvements?.map((imp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-xs text-slate-500 line-through">
                  <strong>你说的：</strong> "{imp.original}"
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100">
                  <span>✨ 更地道："{imp.better}"</span>
                  <button
                    onClick={() => speakText(imp.better)}
                    className="p-1 hover:bg-indigo-200 rounded-md transition-colors cursor-pointer shrink-0 ml-2"
                    title="点击听发音"
                  >
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  💡 {imp.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Learned Phrases: 今日学到的表达 */}
      <div className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
              <span>📚 今日学到的表达 (Key Chunks)</span>
            </h3>
            <p className="text-xs text-indigo-200 mt-1">点击右侧书签图标，一键收藏到你的专属口语短语册</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {report.phrases?.map((ph, idx) => {
            const isSaved = savedPhrasesMap[ph.phrase.toLowerCase()] || false;

            return (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:bg-white/15 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <button
                      onClick={() => speakText(ph.phrase)}
                      className="font-bold text-base text-indigo-300 hover:text-white transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
                    >
                      <span>{ph.phrase}</span>
                      <Volume2 className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    </button>

                    <button
                      onClick={() => handleTogglePhraseBookmark(ph)}
                      className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                        isSaved ? 'bg-indigo-500 text-white shadow-md' : 'bg-white/10 hover:bg-white/20 text-indigo-200'
                      }`}
                      title={isSaved ? "取消收藏" : "收藏短语"}
                    >
                      {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="font-semibold text-sm text-emerald-300 mb-3">{ph.meaning}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/20 text-xs text-slate-300 italic">
                  "{ph.example}"
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-40 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onRetry}
            className="flex-1 sm:flex-none py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <RefreshCw className="w-5 h-5" />
            <span>再练一次该情景</span>
          </button>

          <button
            onClick={onChooseNewScene}
            className="flex-1 sm:flex-none py-4 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-indigo-300 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Layers className="w-5 h-5" />
            <span>换个情景练习</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
