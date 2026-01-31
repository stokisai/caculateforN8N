"use client";

import React, { useState, useRef, useMemo } from 'react';
import {
    ShieldCheck,
    Upload,
    Download,
    Loader2,
    AlertCircle,
    X,
    Plus,
    CheckCircle2,
    Filter,
    Layers,
    ArrowLeft
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { AMAZON_SITES, SYSTEM_INSTRUCTION } from './constants';
import { ProductInfo, KeywordItem, BatchProcessingState, AnalysisResult } from './types';

// API base URL - will use relative path for same-origin requests
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://caculateforn8n-production.up.railway.app';

export default function KeywordFilterClient() {
    const [targetCountry, setTargetCountry] = useState(AMAZON_SITES[0].value);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [keywordsData, setKeywordsData] = useState<KeywordItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState<'idle' | 'image-analysis' | 'keyword-batch'>('idle');
    const [progress, setProgress] = useState<BatchProcessingState>({ current: 0, total: 0, isProcessing: false });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const descFileInputRef = useRef<HTMLInputElement>(null);
    const keywordFileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        if (images.length + files.length > 10) {
            alert("最多只能上传10张图片");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDescFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        if (file.name.endsWith('.txt')) {
            reader.onload = (event) => {
                setDescription(event.target?.result as string);
            };
            reader.readAsText(file);
        } else {
            reader.onload = (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                setDescription(json.map(row => row.join(' ')).join('\n'));
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleKeywordFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json: any[] = XLSX.utils.sheet_to_json(sheet);

            const formatted = json.map(row => ({
                ...row,
                keyword: String(row.keyword || row['关键词'] || Object.values(row)[0] || '').trim()
            })).filter(k => k.keyword.length > 0);
            setKeywordsData(formatted);
        };
        reader.readAsArrayBuffer(file);
    };

    const startAnalysis = async () => {
        if (keywordsData.length === 0) {
            alert("请先上传关键词列表");
            return;
        }
        if (!description && images.length === 0) {
            alert("请提供产品描述或图片");
            return;
        }

        setIsProcessing(true);
        setProgress({ current: 0, total: keywordsData.length, isProcessing: true });

        const productInfo: ProductInfo = {
            targetCountry,
            description,
            images
        };

        try {
            // Step 1: Analyze images (single call)
            setProcessingStep('image-analysis');
            let imageContext = "无图片描述";

            if (images.length > 0) {
                const imageResponse = await fetch(`${API_BASE_URL}/api/keyword-filter/analyze-images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ images: images.slice(0, 5) })
                });

                if (!imageResponse.ok) {
                    throw new Error('图片解析失败');
                }

                const imageData = await imageResponse.json();
                imageContext = imageData.description || "未能提取有效的图片特征描述。";
            }

            // Step 2: Batch process keywords
            setProcessingStep('keyword-batch');
            const keywords = keywordsData.map(k => k.keyword);
            const BATCH_SIZE = 100;
            const allResults: AnalysisResult[] = [];

            for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
                const batch = keywords.slice(i, i + BATCH_SIZE);

                const batchResponse = await fetch(`${API_BASE_URL}/api/keyword-filter/process-batch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productInfo,
                        imageDescription: imageContext,
                        keywords: batch,
                        systemInstruction: SYSTEM_INSTRUCTION
                    })
                });

                if (!batchResponse.ok) {
                    throw new Error(`批次处理失败: ${i / BATCH_SIZE + 1}`);
                }

                const batchData = await batchResponse.json();
                allResults.push(...(batchData.results || []));
                setProgress(prev => ({ ...prev, current: Math.min(i + BATCH_SIZE, keywords.length) }));
            }

            // Map results back to keywords
            const resultMap = new Map<string, AnalysisResult>();
            allResults.forEach(r => resultMap.set(r.keyword.toLowerCase().trim(), r));

            const updatedData = keywordsData.map(item => {
                const match = resultMap.get(item.keyword.toLowerCase().trim());
                return {
                    ...item,
                    analysisCategory: match ? match.category : '错误',
                    analysisDetail: match ? match.detail : '未获得分析结果',
                    isDeleted: match ? (match.status === 'removed') : false
                };
            });

            setKeywordsData(updatedData);
        } catch (error: any) {
            console.error(error);
            alert(`分析过程中发生错误: ${error.message}`);
        } finally {
            setIsProcessing(false);
            setProcessingStep('idle');
            setProgress(prev => ({ ...prev, isProcessing: false }));
        }
    };

    const exportResults = () => {
        const exportData = keywordsData.map(({ isDeleted, analysisCategory, analysisDetail, ...rest }) => ({
            ...rest,
            '判定状态': isDeleted ? '剔除' : '通过',
            '评估类别': analysisCategory,
            '详细分析': analysisDetail
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "SEO分析报告");
        XLSX.writeFile(workbook, `SEO_Report_${targetCountry}_${new Date().getTime()}.xlsx`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <a href="/dashboard" className="flex items-center text-slate-500 hover:text-slate-700 transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-1" />
                            <span className="text-sm">返回控制台</span>
                        </a>
                        <div className="flex items-center space-x-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <ShieldCheck className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                跨境SEO与合规工作台 <span className="text-xs font-normal text-slate-400 ml-2">高性能两步加速模式</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">1</div>
                        <h2 className="text-lg font-bold text-slate-800">基本信息与配置</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-slate-700">目标国家/站点</label>
                            <select
                                value={targetCountry}
                                onChange={(e) => setTargetCountry(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            >
                                {AMAZON_SITES.map(site => (
                                    <option key={site.value} value={site.value}>{site.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-semibold text-slate-700">产品图片 (已优化：单次全图解析)</label>
                                <p className="text-[11px] text-amber-600 font-bold mt-1.5 flex items-center bg-amber-50 p-2 rounded-lg border border-amber-100">
                                    <AlertCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                    图片越多，速度越慢，消耗的Token也越高。谨慎上传多张图！
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative w-20 h-20 group">
                                        <img src={img} className="w-full h-full object-cover rounded-lg border border-slate-200" />
                                        <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {images.length < 10 && (
                                    <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 bg-slate-50 transition-all">
                                        <Plus className="w-6 h-6" />
                                        <span className="text-[10px] mt-1 text-center px-1">添加产品图</span>
                                    </button>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">2</div>
                        <h2 className="text-lg font-bold text-slate-800">产品描述与关键词</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold text-slate-700">文字描述 (辅佐图片解析)</label>
                                <button onClick={() => descFileInputRef.current?.click()} className="text-xs text-indigo-600 hover:underline flex items-center">
                                    <Upload className="w-3 h-3 mr-1" /> 导入描述
                                </button>
                                <input type="file" ref={descFileInputRef} onChange={handleDescFileUpload} accept=".xlsx,.xls,.txt" className="hidden" />
                            </div>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="输入产品核心卖点、规格参数等..." className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none transition-shadow" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold text-slate-700">待分析关键词 ({keywordsData.length})</label>
                                <button onClick={() => keywordFileInputRef.current?.click()} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 flex items-center transition-colors">
                                    <Upload className="w-3 h-3 mr-1" /> 上传 Excel
                                </button>
                                <input type="file" ref={keywordFileInputRef} onChange={handleKeywordFileUpload} accept=".xlsx,.xls" className="hidden" />
                            </div>
                            <div className="border border-slate-200 rounded-xl h-48 bg-slate-50 overflow-y-auto shadow-inner">
                                {keywordsData.length > 0 ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-white border-b sticky top-0 z-10">
                                            <tr>
                                                <th className="px-3 py-2">关键词</th>
                                                <th className="px-3 py-2 text-center">当前状态</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {keywordsData.slice(0, 100).map((k, i) => (
                                                <tr key={i} className="bg-white/50">
                                                    <td className="px-3 py-2 truncate max-w-[150px]">{k.keyword}</td>
                                                    <td className="px-3 py-2 text-center">
                                                        {k.analysisCategory ? (
                                                            k.isDeleted ? <span className="text-red-500 font-medium">已剔除</span> : <span className="text-green-600 font-medium">通过</span>
                                                        ) : <span className="text-slate-400">待批次分析</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 italic text-sm text-center px-4">
                                        尚未导入关键词，请点击右上方按钮上传
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col items-center justify-center space-y-6">
                    {!isProcessing ? (
                        <button
                            onClick={startAnalysis}
                            disabled={keywordsData.length === 0}
                            className="px-12 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all disabled:bg-slate-300 flex items-center space-x-2"
                        >
                            <Filter className="w-5 h-5" />
                            <span>启动深度批量过滤 (100批次)</span>
                        </button>
                    ) : (
                        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className={processingStep === 'image-analysis' ? 'text-indigo-600' : 'text-slate-400'}>1. 图片深度解析</span>
                                    {processingStep !== 'image-analysis' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className={processingStep === 'keyword-batch' ? 'text-indigo-600' : 'text-slate-400'}>2. 关键词批量处理</span>
                                    {progress.current === progress.total && progress.total > 0 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                                    <span className="flex items-center">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-indigo-600" />
                                        {processingStep === 'image-analysis' ? '正在提取图片产品特征...' : `正在执行批次扫描 (${progress.current}/${progress.total})`}
                                    </span>
                                    {processingStep === 'keyword-batch' && (
                                        <span>{Math.round((progress.current / (progress.total || 1)) * 100)}%</span>
                                    )}
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ${processingStep === 'image-analysis' ? 'animate-pulse w-1/3' : ''}`}
                                        style={processingStep === 'keyword-batch' ? { width: `${(progress.current / (progress.total || 1)) * 100}%` } : {}}
                                    />
                                </div>
                            </div>
                            <p className="text-center text-[10px] text-slate-400 uppercase tracking-wider">
                                高性能两步模式已开启：图片解析仅执行一次。
                            </p>
                        </div>
                    )}

                    {keywordsData.some(k => k.analysisCategory) && !isProcessing && (
                        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center">
                                    <Layers className="w-5 h-5 mr-2 text-indigo-600" />
                                    全量过滤分析报告 (已处理 {keywordsData.length} 项)
                                </h3>
                                <button onClick={exportResults} className="flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                                    <Download className="w-4 h-4" /> 导出完整 Excel
                                </button>
                            </div>
                            <div className="max-h-[600px] overflow-auto">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-slate-50 border-b sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold text-slate-600">关键词</th>
                                            <th className="px-6 py-3 font-semibold text-slate-600">判定结果</th>
                                            <th className="px-6 py-3 font-semibold text-slate-600">评估类别</th>
                                            <th className="px-6 py-3 font-semibold text-slate-600">详细分析说明</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {keywordsData.map((k, i) => (
                                            <tr key={i} className={`hover:bg-slate-50 transition-colors ${k.isDeleted ? 'bg-red-50/20' : 'bg-white'}`}>
                                                <td className="px-6 py-4 text-slate-700 font-medium">{k.keyword}</td>
                                                <td className="px-6 py-4">
                                                    {k.isDeleted ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase">剔除</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">通过</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-semibold ${k.isDeleted ? 'text-red-600' : 'text-indigo-600'}`}>
                                                        {k.analysisCategory}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed max-w-md">
                                                    {k.analysisDetail}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-[10px]">
                <p>© 2024 专业级跨境 SEO 合规工作台 | 高性能两阶段分析技术</p>
            </footer>
        </div>
    );
}
