
import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface KnowledgeSyncProps {
  onSyncComplete: () => void;
}

const KnowledgeSync: React.FC<KnowledgeSyncProps> = ({ onSyncComplete }) => {
  const [progress, setProgress] = useState(0);
  const items = [
    "正在加载 GEO: Generative Engine Optimization 论文...",
    "正在同步 COSMO: E-commerce Common Sense Knowledge 算法模型...",
    "正在解析亚马逊 Listing 政策及合规要求 (2025 最新版)...",
    "正在计算亚马逊 A9 搜索引擎 SEO 权重逻辑...",
    "正在构建 Rufus AI 问答上下文关联..."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    const textTimer = setInterval(() => {
      setCurrentIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(onSyncComplete, 800);
    }
  }, [progress, onSyncComplete]);

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto text-center">
      <div className="mb-6 flex justify-center">
        <div className="relative">
          < BookOpen className="w-16 h-16 text-orange-600" />
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">第二步：构建知识库</h2>
      <p className="text-gray-500 mb-8">正在将专家经验与算法论文注入 AI 引擎</p>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mb-8 overflow-hidden">
        <div 
          className="bg-orange-600 h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3 text-left max-w-md mx-auto">
        {items.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${idx > currentIndex ? 'opacity-20' : 'opacity-100'}`}>
            {idx < currentIndex || progress === 100 ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : idx === currentIndex ? (
              <Loader2 className="w-5 h-5 text-orange-600 animate-spin flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
            )}
            <span className={`text-sm ${idx === currentIndex ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeSync;
