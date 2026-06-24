import React from 'react';
import { Flame, CheckCircle2, Bookmark, Sparkles } from 'lucide-react';
import { UserStats } from '../types';

interface NavbarProps {
  stats: UserStats;
  onOpenSavedPhrases: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ stats, onOpenSavedPhrases, onGoHome }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-2 group text-left cursor-pointer transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1">
              英语<span className="text-indigo-600">Scene</span>
            </h1>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">情景口语教练</p>
          </div>
        </button>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Streak badge */}
          <div 
            title="连续练习天数"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs sm:text-sm shadow-2xs"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{stats.streakDays || 0} 天</span>
          </div>

          {/* Completed badge */}
          <div 
            title="已解锁情景"
            className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs sm:text-sm shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{stats.completedScenes?.length || 0} 个情景</span>
          </div>

          {/* Saved phrase book button */}
          <button
            onClick={onOpenSavedPhrases}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 text-slate-700 font-medium text-xs sm:text-sm transition-all cursor-pointer active:scale-95"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">短语句库</span>
            {stats.savedPhrases?.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 bg-indigo-600 text-white font-bold rounded-full text-[10px]">
                {stats.savedPhrases.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
