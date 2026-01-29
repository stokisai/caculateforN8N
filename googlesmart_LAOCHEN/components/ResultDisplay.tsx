
import React, { useState } from 'react';
import { Copy, Check, Download, Share2, FileText, Layout, Image as ImageIcon, Search } from 'lucide-react';

interface ResultDisplayProps {
  content: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-orange-400" />
            <h2 className="font-bold text-lg">AI 专家生成的 Listing 文案</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '已复制' : '复制全文'}
            </button>
          </div>
        </div>
        
        <div className="p-8 prose prose-orange max-w-none overflow-auto max-h-[70vh] text-gray-800 leading-relaxed">
           <pre className="whitespace-pre-wrap font-sans text-sm md:text-base">
             {content}
           </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center text-center">
          <ImageIcon className="w-8 h-8 text-orange-600 mb-2" />
          <h4 className="font-bold mb-1">图片策划</h4>
          <p className="text-xs text-gray-500">已针对 Cosmo 场景意图优化附图逻辑</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center text-center">
          <Search className="w-8 h-8 text-blue-600 mb-2" />
          <h4 className="font-bold mb-1">SEO 权重</h4>
          <p className="text-xs text-gray-500">A9 埋点已完成，覆盖 250 字符后端关键词</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center text-center">
          <Share2 className="w-8 h-8 text-purple-600 mb-2" />
          <h4 className="font-bold mb-1">Rufus 优化</h4>
          <p className="text-xs text-gray-500">GEO 策略已织入，增加 AI 引擎推荐概率</p>
        </div>
      </div>

      <div className="flex justify-center gap-4 py-4">
        <button
          onClick={onReset}
          className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
        >
          重新生成
        </button>
        <button
          className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 flex items-center gap-2"
        >
          <Download className="w-5 h-5" /> 导出 Word 文档
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
