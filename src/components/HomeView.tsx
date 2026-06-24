import React, { useState } from 'react';
import { Clock, BarChart2, CheckCircle, ArrowRight, Compass, Coffee, Briefcase, Users, Layers } from 'lucide-react';
import { Scene, SceneCategory } from '../types';

interface HomeViewProps {
  scenes: Scene[];
  completedSceneIds: string[];
  onSelectScene: (scene: Scene) => void;
}

const CATEGORIES: { label: string; value: SceneCategory | 'All'; icon: React.ReactNode }[] = [
  { label: '全部情景', value: 'All', icon: <Layers className="w-4 h-4" /> },
  { label: '日常生活 Daily Life', value: 'Daily Life', icon: <Coffee className="w-4 h-4" /> },
  { label: '旅行沟通 Travel', value: 'Travel', icon: <Compass className="w-4 h-4" /> },
  { label: '职场商务 Workplace', value: 'Workplace', icon: <Briefcase className="w-4 h-4" /> },
  { label: '社交破冰 Social', value: 'Social', icon: <Users className="w-4 h-4" /> },
];

export const HomeView: React.FC<HomeViewProps> = ({ scenes, completedSceneIds, onSelectScene }) => {
  const [activeTab, setActiveTab] = useState<SceneCategory | 'All'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate'>('All');

  const filteredScenes = scenes.filter(scene => {
    const matchCategory = activeTab === 'All' || scene.category === activeTab;
    const matchDifficulty = difficultyFilter === 'All' || scene.difficulty === difficultyFilter;
    return matchCategory && matchDifficulty;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 sm:p-10 shadow-xl mb-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>沉浸式 AI 对练式英语</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            先阅读情景，再开口对练。
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed mb-6">
            克服开口心理障碍！告别死记硬背。选择真实生活与职场沟通场景，预习地道句式与发音，然后由 AI 陪你一对一开口实战。
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-indigo-200">
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              ✨ 100% 角色沉浸不纠错
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              🎙️ 原生浏览器语音转文字
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              📊 对话结束生成地道反馈
            </span>
          </div>
        </div>
        
        {/* Background Decorative Graphic */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-15 select-none pointer-events-none text-9xl">
          🗣️
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {CATEGORIES.map(cat => {
            const isActive = activeTab === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-102' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 self-start md:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setDifficultyFilter('All')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${difficultyFilter === 'All' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            全难度
          </button>
          <button
            onClick={() => setDifficultyFilter('Beginner')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${difficultyFilter === 'Beginner' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            初级 Beginner
          </button>
          <button
            onClick={() => setDifficultyFilter('Intermediate')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${difficultyFilter === 'Intermediate' ? 'bg-white text-amber-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            进阶 Intermediate
          </button>
        </div>
      </div>

      {/* Scene Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenes.map(scene => {
          const isCompleted = completedSceneIds.includes(scene.id);
          const isBeginner = scene.difficulty === 'Beginner';

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(scene)}
              className="group relative bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-indigo-500/50 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 overflow-hidden"
            >
              {/* Top Row: Emoji & Status Tag */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-3xl shadow-2xs group-hover:scale-110 transition-transform duration-300">
                    {scene.emoji}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isCompleted && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> 已完成
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      isBeginner ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {scene.difficulty === 'Beginner' ? '初级' : '进阶'}
                    </span>
                  </div>
                </div>

                {/* Titles */}
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                  {scene.title}
                </h3>
                <h4 className="font-medium text-sm text-slate-500 mb-3">
                  {scene.titleZh}
                </h4>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-6">
                  {scene.description}
                </p>
              </div>

              {/* Bottom Row: Metadata & CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {scene.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-3.5 h-3.5 text-slate-400" /> {scene.category}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredScenes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-slate-400 text-base mb-2">未找到匹配该分类或难度的情景</p>
          <button 
            onClick={() => { setActiveTab('All'); setDifficultyFilter('All'); }}
            className="text-indigo-600 font-semibold text-sm hover:underline cursor-pointer"
          >
            重置筛选条件
          </button>
        </div>
      )}
    </div>
  );
};
