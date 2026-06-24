import React, { useState } from 'react';
import { X, Volume2, Trash2, Bookmark, Clock, Award, ChevronRight } from 'lucide-react';
import { UserStats, LearnedPhrase } from '../types';
import { speakText } from '../lib/speech';
import { toggleSavePhrase } from '../lib/storage';

interface SavedPhrasesModalProps {
  stats: UserStats;
  onClose: () => void;
  onStatsUpdate: (newStats: UserStats) => void;
  onSelectHistoryScene?: (sceneId: string) => void;
}

export const SavedPhrasesModal: React.FC<SavedPhrasesModalProps> = ({
  stats,
  onClose,
  onStatsUpdate,
  onSelectHistoryScene
}) => {
  const [tab, setTab] = useState<'phrases' | 'history'>('phrases');

  const handleDeletePhrase = (p: LearnedPhrase) => {
    const res = toggleSavePhrase(p);
    onStatsUpdate(res.stats);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">我的口语短语句库</h2>
              <p className="text-xs text-slate-500">累计对练 {stats.totalRounds || 0} 轮对话</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/30 text-xs font-bold">
          <button
            onClick={() => setTab('phrases')}
            className={`pb-3 px-4 border-b-2 cursor-pointer transition-colors ${tab === 'phrases' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            ⭐ 收藏表达 ({stats.savedPhrases?.length || 0})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`pb-3 px-4 border-b-2 cursor-pointer transition-colors ${tab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
          >
            📜 历史对练报告 ({stats.history?.length || 0})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'phrases' && (
            <>
              {(!stats.savedPhrases || stats.savedPhrases.length === 0) ? (
                <div className="text-center py-16 text-slate-400">
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">还没有收藏短语。在练习反馈页点击书签图标即可保存。</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.savedPhrases.map((ph, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 flex items-start justify-between gap-4 group transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => speakText(ph.phrase)}
                            className="font-bold text-base text-indigo-600 hover:underline flex items-center gap-1.5 cursor-pointer text-left"
                          >
                            <span>{ph.phrase}</span>
                            <Volume2 className="w-4 h-4 text-indigo-400" />
                          </button>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {ph.meaning}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 italic mt-1.5">
                          "{ph.example}"
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeletePhrase(ph)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="移除短语"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'history' && (
            <>
              {(!stats.history || stats.history.length === 0) ? (
                <div className="text-center py-16 text-slate-400">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">暂无历史对练记录，去挑选情景开口吧！</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.history.map((record) => {
                    const dateStr = new Date(record.completedAt).toLocaleString();
                    return (
                      <div 
                        key={record.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 shadow-2xs flex items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {record.report?.scores?.fluency || '-'}分
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate">{record.sceneTitle}</h4>
                            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{dateStr}</span>
                              <span>· {record.rounds} 轮对话</span>
                            </p>
                          </div>
                        </div>

                        {onSelectHistoryScene && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectHistoryScene(record.sceneId);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-xl cursor-pointer transition-colors shrink-0"
                          >
                            <span>去复习</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
