
import React, { useState } from 'react';
import { AppStep, ProductData } from './types';
import StepIndicator from './components/StepIndicator';
import ProductForm from './components/ProductForm';
import KnowledgeSync from './components/KnowledgeSync';
import ResultDisplay from './components/ResultDisplay';
import { generateListing } from './services/geminiService';
import { BrainCircuit, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INPUT);
  const [productData, setProductData] = useState<ProductData>({
    description: '',
    keywords: '',
    marketplace: '',
    rufusQA: ''
  });
  const [listingContent, setListingContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextStep = (data: ProductData) => {
    setProductData(data);
    setCurrentStep(AppStep.KNOWLEDGE);
  };

  const startGeneration = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentStep(AppStep.GENERATION);
    try {
      const result = await generateListing(productData);
      setListingContent(result || '生成失败，请重试。');
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
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-200">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Amazon Listing Expert</h1>
              <p className="text-xs text-orange-600 font-medium">World-Class GEO & COSMO Algorithm Support</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm text-gray-500 font-medium">Powered by Gemini 3.0 Pro</span>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <StepIndicator currentStep={currentStep} />

        {currentStep === AppStep.INPUT && (
          <ProductForm initialData={productData} onNext={handleNextStep} />
        )}

        {currentStep === AppStep.KNOWLEDGE && (
          <KnowledgeSync onSyncComplete={startGeneration} />
        )}

        {currentStep === AppStep.GENERATION && (
          <div className="w-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                <h3 className="text-xl font-bold mb-2">正在撰写顶级文案...</h3>
                <p className="text-gray-500 text-center max-w-md px-4">
                  顶级亚马逊 Listing 专家正在分析您的产品意图、埋点关键词，并应用 GEO 策略优化文案结构。这通常需要 10-20 秒。
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
          <p className="text-sm text-gray-500">© 2025 Amazon Listing Expert. 专注 A9/COSMO/Rufus 搜索权重优化。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
