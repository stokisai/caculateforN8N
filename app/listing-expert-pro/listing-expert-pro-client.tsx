"use client";

import React, { useState, useRef } from 'react';
import { ProductData, AppStep, MARKETPLACES, MODELS } from './types';
import {
  BrainCircuit, Loader2, AlertCircle, ArrowLeft,
  Upload, X, Globe, FileText, Database, HelpCircle, FileUp, Plus, Sparkles, Cpu,
  BookOpen, CheckCircle2,
  Copy, Check, Download, Share2, Layout, Image as ImageIcon, Search
} from 'lucide-react';
import * as XLSX from 'xlsx';

const API_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'https://caculateforn8n-production.up.railway.app';

export default function ListingExpertProClient() {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INPUT);
  const [productData, setProductData] = useState<ProductData>({
    images: [],
    description: '',
    keywords: '',
    marketplace: 'US',
    rufusQA: '',
    model: 'gemini-2.5-pro-preview-05-06'
  });
  const [listingContent, setListingContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = (data: ProductData) => {
    setProductData(data);
    setCurrentStep(AppStep.KNOWLEDGE);
  };

  const onKnowledgeSyncComplete = (analysis: string) => {
    const updatedData = { ...productData, imageAnalysis: analysis };
    setProductData(updatedData);
    startGeneration(updatedData);
  };

  const startGeneration = async (data: ProductData) => {
    setIsLoading(true);
    setError(null);
    setCurrentStep(AppStep.GENERATION);
    try {
      const response = await fetch(`${API_BASE_URL}/api/listing-expert-pro/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const result = await response.json();
      setListingContent(result.content || '生成失败，请重试。');
    } catch (err) {
      console.error(err);
      setError('调用 AI 引擎时发生错误，请检查网络连接或 API 配置。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-gray-500 hover:text-gray-700 mr-2">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-200">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Amazon Listing Expert Pro</h1>
              <p className="text-xs text-orange-600 font-medium">GEO & COSMO & Rufus 算法支持</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm text-gray-500 font-medium">
              AI 引擎: {productData.model.includes('pro') ? 'Pro 深度推理' : 'Flash 极速'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <StepIndicator currentStep={currentStep} />

        {currentStep === AppStep.INPUT && (
          <ProductForm initialData={productData} onNext={handleNextStep} />
        )}

        {currentStep === AppStep.KNOWLEDGE && (
          <KnowledgeSync productData={productData} onSyncComplete={onKnowledgeSyncComplete} />
        )}

        {currentStep === AppStep.GENERATION && (
          <div className="w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                <h3 className="text-xl font-bold mb-2">正在撰写顶级文案...</h3>
                <p className="text-gray-500 text-center max-w-md px-4">
                  正在使用预解析的视觉特征与 {productData.model.includes('pro') ? 'Gemini Pro' : 'Gemini Flash'} 深度分析您的产品意图，应用 GEO 策略优化文案结构。
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-900 mb-2">生成出错</h3>
                <p className="text-red-700 mb-6">{error}</p>
                <button
                  onClick={() => setCurrentStep(AppStep.INPUT)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  返回修改信息
                </button>
              </div>
            ) : (
              <ResultDisplay content={listingContent} onReset={() => setCurrentStep(AppStep.INPUT)} />
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2025 Amazon Listing Expert Pro. 专注 A9/COSMO/Rufus 搜索权重优化。</p>
        </div>
      </footer>
    </div>
  );
}

// StepIndicator Component
function StepIndicator({ currentStep }: { currentStep: AppStep }) {
  const steps = [
    { num: 1, label: '信息获取' },
    { num: 2, label: '构建知识库' },
    { num: 3, label: '撰写 Listing' }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, idx) => (
        <React.Fragment key={step.num}>
          <div className={`flex items-center gap-2 ${currentStep >= step.num ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= step.num ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step.num}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-12 sm:w-24 h-0.5 mx-2 ${currentStep > step.num ? 'bg-orange-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ProductForm Component
interface ProductFormProps {
  initialData: ProductData;
  onNext: (data: ProductData) => void;
}

function ProductForm({ initialData, onNext }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductData>(initialData);
  const [isParsing, setIsParsing] = useState<{ [key: string]: boolean }>({});

  const kwFileRef = useRef<HTMLInputElement>(null);
  const rufusFileRef = useRef<HTMLInputElement>(null);
  const descFileRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = 10;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const remainingSlots = MAX_IMAGES - formData.images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64].slice(0, MAX_IMAGES)
        }));
      };
      reader.readAsDataURL(file);
    });

    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const parseFile = async (file: File, field: 'keywords' | 'rufusQA' | 'description') => {
    setIsParsing(prev => ({ ...prev, [field]: true }));
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'txt') {
        const text = await file.text();
        setFormData(prev => ({ ...prev, [field]: prev[field] ? prev[field] + '\n' + text : text }));
      } else if (extension === 'xlsx' || extension === 'xls') {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        let extractedText = '';

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

          if (json.length === 0) return;

          if (field === 'keywords') {
            const firstRow = json[0] || [];
            const headers = firstRow.map(h => String(h).toLowerCase());
            const kwTargetHeaders = ['keyword', 'phrase', 'search term', '词', '关键词', '查询', 'query', 'terms'];
            let kwColIdx = headers.findIndex(h => kwTargetHeaders.some(target => h.includes(target)));
            if (kwColIdx === -1) kwColIdx = 0;

            const columnKeywords = json
              .slice(headers.length > 0 && kwColIdx !== -1 ? 1 : 0)
              .map(row => row[kwColIdx])
              .filter(cell => cell !== null && cell !== undefined && cell !== '' && String(cell).trim().length > 0)
              .filter(cell => isNaN(Number(cell)))
              .map(cell => String(cell).trim())
              .join(', ');

            if (columnKeywords) {
              extractedText += columnKeywords + '\n';
            }
          } else {
            const sheetText = json
              .map(row => row.filter(cell => cell !== null && cell !== '').join(' '))
              .filter(rowText => rowText.length > 0)
              .join('\n');
            extractedText += sheetText + '\n';
          }
        });

        setFormData(prev => ({
          ...prev,
          [field]: prev[field] ? prev[field] + '\n' + extractedText.trim() : extractedText.trim()
        }));
      }
    } catch (error) {
      console.error('File parsing failed:', error);
      alert('文件解析失败，请确保格式正确。');
    } finally {
      setIsParsing(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'keywords' | 'rufusQA' | 'description') => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file, field);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Model Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Cpu className="w-5 h-5 text-orange-600" /> 选择 AI 引擎模型
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => setFormData({ ...formData, model: model.id })}
              className={`relative flex flex-col p-4 rounded-xl border-2 text-left transition-all ${
                formData.model === model.id
                  ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${formData.model === model.id ? 'text-orange-700' : 'text-gray-900'}`}>
                  {model.name}
                </span>
                {model.recommended && (
                  <span className="text-[10px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    推荐
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 leading-relaxed">{model.desc}</span>
              {formData.model === model.id && (
                <div className="absolute top-[-8px] right-[-8px] bg-orange-600 rounded-full p-1 shadow-md">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Upload className="w-5 h-5 text-orange-600" /> 第一步：上传产品图片 (最多10张)
          </h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {formData.images.length} / {MAX_IMAGES}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {formData.images.map((img, idx) => (
            <div key={idx} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group">
              <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {formData.images.length < MAX_IMAGES && (
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center p-2">
                <Plus className="w-6 h-6 mb-1 text-gray-400" />
                <span className="text-[10px] text-gray-500 font-medium">添加图片</span>
              </div>
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marketplace Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Globe className="w-5 h-5 text-orange-600" /> 选择站点 (国家)
          </h3>
          <select
            value={formData.marketplace}
            onChange={(e) => setFormData({ ...formData, marketplace: e.target.value })}
            className="block w-full rounded-md border-gray-300 border p-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            required
          >
            <option value="">请选择一个国家 (共21个站点)</option>
            {MARKETPLACES.map(mp => (
              <option key={mp.value} value={mp.value}>{mp.label}</option>
            ))}
          </select>
        </div>

        {/* Keywords */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Database className="w-5 h-5 text-orange-600" /> 关键词词库
            </h3>
            <div className="flex items-center gap-2">
              <input type="file" ref={kwFileRef} className="hidden" accept=".txt,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'keywords')} />
              <button
                type="button"
                onClick={() => kwFileRef.current?.click()}
                disabled={isParsing['keywords']}
                className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-100 transition-colors disabled:opacity-50"
              >
                {isParsing['keywords'] ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileUp className="w-3 h-3" />}
                上传表格/TXT
              </button>
            </div>
          </div>
          <textarea
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="输入核心词、长尾词等（用逗号分隔），或点击上方按钮上传文件"
            className="block w-full rounded-md border-gray-300 border p-2 h-32 focus:ring-orange-500 focus:border-orange-500 text-sm"
            required
          />
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <FileText className="w-5 h-5 text-orange-600" /> 产品信息描述
          </h3>
          <div className="flex items-center gap-2">
            <input type="file" ref={descFileRef} className="hidden" accept=".txt,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'description')} />
            <button
              type="button"
              onClick={() => descFileRef.current?.click()}
              disabled={isParsing['description']}
              className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-100 transition-colors disabled:opacity-50"
            >
              {isParsing['description'] ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileUp className="w-3 h-3" />}
              上传表格/TXT
            </button>
          </div>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="长宽高、重量、材质、核心功能、用户痛点、使用场景等描述，或点击上方按钮上传文件"
          className="block w-full rounded-md border-gray-300 border p-2 h-40 focus:ring-orange-500 focus:border-orange-500 text-sm"
          required
        />
      </div>

      {/* Rufus Q&A */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <HelpCircle className="w-5 h-5 text-orange-600" /> Rufus 相关问题及答案
          </h3>
          <div className="flex items-center gap-2">
            <input type="file" ref={rufusFileRef} className="hidden" accept=".txt,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'rufusQA')} />
            <button
              type="button"
              onClick={() => rufusFileRef.current?.click()}
              disabled={isParsing['rufusQA']}
              className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-100 transition-colors disabled:opacity-50"
            >
              {isParsing['rufusQA'] ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileUp className="w-3 h-3" />}
              上传表格/TXT
            </button>
          </div>
        </div>
        <textarea
          value={formData.rufusQA}
          onChange={(e) => setFormData({ ...formData, rufusQA: e.target.value })}
          placeholder="Rufus AI 搜索引擎可能问到的问题及其标准答案，或点击上方按钮上传文件"
          className="block w-full rounded-md border-gray-300 border p-2 h-32 focus:ring-orange-500 focus:border-orange-500 text-sm"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 active:scale-95 flex items-center gap-2"
        >
          下一步：构建知识库
        </button>
      </div>
    </form>
  );
}

// KnowledgeSync Component
interface KnowledgeSyncProps {
  productData: ProductData;
  onSyncComplete: (analysis: string) => void;
}

function KnowledgeSync({ productData, onSyncComplete }: KnowledgeSyncProps) {
  const [progress, setProgress] = useState(0);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<string>('');
  const analysisStarted = useRef(false);

  const items = [
    "正在通过 AI 深度解析产品图片特征...",
    "正在加载 GEO: Generative Engine Optimization 论文...",
    "正在同步 COSMO: E-commerce Common Sense Knowledge 算法模型...",
    "正在解析亚马逊 Listing 政策及合规要求 (2025 最新版)...",
    "正在计算亚马逊 A9 搜索引擎 SEO 权重逻辑...",
    "正在构建 Rufus AI 问答上下文关联..."
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (!analysisDone && prev >= 90) return 90;
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 60);

    const textTimer = setInterval(() => {
      setCurrentIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
    }, 1200);

    // Trigger Image Analysis
    if (!analysisStarted.current && productData.images.length > 0) {
      analysisStarted.current = true;
      fetch(`${API_BASE_URL}/api/listing-expert-pro/analyze-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: productData.images, model: productData.model })
      })
        .then(res => res.json())
        .then(data => {
          setAnalysisDone(true);
          setImageAnalysisResult(data.analysis || '图片解析完成');
        })
        .catch(err => {
          console.error("Image analysis failed", err);
          setAnalysisDone(true);
          setImageAnalysisResult("图片解析失败，将仅基于文本描述生成。");
        });
    } else if (productData.images.length === 0) {
      setAnalysisDone(true);
      setImageAnalysisResult("未上传图片。");
    }

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, [analysisDone, productData.images, productData.model]);

  React.useEffect(() => {
    if (progress === 100 && analysisDone) {
      setTimeout(() => onSyncComplete(imageAnalysisResult), 800);
    }
  }, [progress, analysisDone, onSyncComplete, imageAnalysisResult]);

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto text-center">
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <BookOpen className="w-16 h-16 text-orange-600" />
          <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">第二步：构建知识库与图片分析</h2>
      <p className="text-gray-500 mb-8">正在将视觉特征、专家经验与算法论文注入 AI 引擎</p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-8 overflow-hidden">
        <div
          className="bg-orange-600 h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3 text-left max-w-md mx-auto">
        {items.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${idx > currentIndex ? 'opacity-20' : 'opacity-100'}`}>
            {(idx < currentIndex || (idx === 0 && analysisDone) || progress === 100) ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : idx === currentIndex ? (
              <Loader2 className="w-5 h-5 text-orange-600 animate-spin flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
            )}
            <span className={`text-sm ${idx === currentIndex ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
              {idx === 0 && analysisDone ? "产品图片特征解析完成" : item}
            </span>
          </div>
        ))}
      </div>

      {!analysisDone && progress >= 90 && (
        <p className="mt-6 text-xs text-orange-600 animate-pulse font-medium">
          正在等待深度视觉分析结果，这可能需要一点时间...
        </p>
      )}
    </div>
  );
}

// ResultDisplay Component
interface ResultDisplayProps {
  content: string;
  onReset: () => void;
}

function ResultDisplay({ content, onReset }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const cleanContent = content
    .split('\n')
    .map(line => line.replace(/^[\s]*[\*\-][\s]*/, ''))
    .join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([cleanContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Amazon_Listing_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            {cleanContent}
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
          onClick={handleDownload}
          className="px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 flex items-center gap-2"
        >
          <Download className="w-5 h-5" /> 导出 TXT 文档
        </button>
      </div>
    </div>
  );
}
