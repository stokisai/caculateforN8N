
import React, { useState, useRef } from 'react';
import { ProductData, MARKETPLACES } from '../types';
import { Upload, X, Globe, FileText, Database, HelpCircle, FileUp, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ProductFormProps {
  initialData: ProductData;
  onNext: (data: ProductData) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onNext }) => {
  const [formData, setFormData] = useState<ProductData>(initialData);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image || null);
  const [isParsing, setIsParsing] = useState<{ [key: string]: boolean }>({});

  const kwFileRef = useRef<HTMLInputElement>(null);
  const rufusFileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: undefined });
  };

  const parseFile = async (file: File, field: 'keywords' | 'rufusQA') => {
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
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          const sheetText = json
            .map(row => row.filter(cell => cell !== null && cell !== '').join(field === 'keywords' ? ', ' : ' '))
            .filter(rowText => rowText.length > 0)
            .join('\n');
          
          extractedText += sheetText + '\n';
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'keywords' | 'rufusQA') => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file, field);
      e.target.value = ''; // Reset to allow re-upload of same file
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Image Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Upload className="w-5 h-5 text-orange-600" /> 第一步：上传产品图片
        </h3>
        <div className="flex items-center justify-center w-full">
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">点击上传</span> 或 拖拽图片</p>
                <p className="text-xs text-gray-400">PNG, JPG 或 WEBP (建议比例 1:1)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
            <option value="">请选择一个国家</option>
            {MARKETPLACES.map(mp => (
              <option key={mp.value} value={mp.value}>{mp.label}</option>
            ))}
          </select>
        </div>

        {/* Keywords Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Database className="w-5 h-5 text-orange-600" /> 关键词词库
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={kwFileRef}
                className="hidden"
                accept=".txt,.xlsx,.xls"
                onChange={(e) => handleFileUpload(e, 'keywords')}
              />
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

      {/* Product Description Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <FileText className="w-5 h-5 text-orange-600" /> 产品信息描述
        </h3>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="长宽高、重量、材质、核心功能、用户痛点、使用场景等描述"
          className="block w-full rounded-md border-gray-300 border p-2 h-40 focus:ring-orange-500 focus:border-orange-500 text-sm"
          required
        />
      </div>

      {/* Rufus Q&A Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <HelpCircle className="w-5 h-5 text-orange-600" /> Rufus 相关问题及答案
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={rufusFileRef}
              className="hidden"
              accept=".txt,.xlsx,.xls"
              onChange={(e) => handleFileUpload(e, 'rufusQA')}
            />
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

      {/* Submit Button */}
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
};

export default ProductForm;
