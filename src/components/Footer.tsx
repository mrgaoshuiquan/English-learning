import React from 'react';
import { Github, Globe, Heart, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  // 👇 您可以在这里方便地修改您的个人信息链接
  const myInfo = {
    name: "MR'Gao", // 您的签名/名字
    blogUrl: "https://www.gaoops.com", // 您的博客网址
    feedbackUrl: "https://www.gaoops.com/messageboard/", // 问题反馈网址
    githubUrl: "https://github.com/mrgaoshuiquan" // 您的 GitHub 网址
  };

  return (
    <footer className="mt-auto py-4 px-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm text-xs text-slate-500">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>by</span>
          <span className="font-semibold text-slate-700">{myInfo.name}</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={myInfo.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>个人博客</span>
          </a>

          <a
            href={myInfo.feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>问题反馈</span>
          </a>

          <a
            href={myInfo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>官方仓库</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
