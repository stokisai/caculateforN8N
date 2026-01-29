"use client";

import { useState } from "react";
import {
  Upload,
  Globe,
  FileText,
  Image as ImageIcon,
  FileUp,
  Loader2,
  CheckCircle,
} from "lucide-react";

const SERVICE_ID = "b9f2b13e-2f4b-4a62-8b0e-d2f74d824230";
const WEBHOOK_URL = "https://caculateforn8n-production.up.railway.app/process";

const MARKETPLACES = [
  "US",
  "UK",
  "DE",
  "FR",
  "IT",
  "ES",
  "JP",
  "CA",
  "AU",
];

type UploadState = {
  file: File | null;
  label: string;
  accept: string;
  helper?: string;
};

export default function ListingExpertPage() {
  const [marketplace, setMarketplace] = useState<string>("");
  const [productDesc, setProductDesc] = useState<string>("");
  const [keywordBank, setKeywordBank] = useState<UploadState>({
    file: null,
    label: "关键词词库 (TXT/CSV)",
    accept: ".txt,.csv",
    helper: "支持 TXT/CSV，单文件",
  });
  const [productImage, setProductImage] = useState<UploadState>({
    file: null,
    label: "产品图片 (PNG/JPG/WEBP)",
    accept: "image/png,image/jpeg,image/webp",
    helper: "可选，单文件",
  });
  const [rfa, setRfa] = useState<UploadState>({
    file: null,
    label: "Rufus 问答 (TXT/CSV)",
    accept: ".txt,.csv",
    helper: "可选，单文件",
  });
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string>(\"\");

  const handleFileChange = (
    setter: (v: UploadState) => void,
    state: UploadState,
    file: File | null,
  ) => {
    setter({ ...state, file });
  };

  const pickPrimaryFile = () => {
    // 优先关键词词库，其次 Rufus 问答，最后产品图
    if (keywordBank.file) return keywordBank.file;
    if (rfa.file) return rfa.file;
    if (productImage.file) return productImage.file;
    return null;
  };

  const buildInputText = () => {
    const parts: string[] = [];
    if (marketplace) parts.push(`站点: ${marketplace}`);
    if (productDesc) parts.push(`产品信息: ${productDesc}`);
    if (keywordBank.file) parts.push(`已上传关键词词库文件: ${keywordBank.file.name}`);
    if (rfa.file) parts.push(`已上传 Rufus QA 文件: ${rfa.file.name}`);
    if (productImage.file) parts.push(`已上传产品图片: ${productImage.file.name}`);
    return parts.join(\"\\n\");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResultText(\"\");
    try {
      const primaryFile = pickPrimaryFile();
      let response: Response;

      if (primaryFile) {
        const formData = new FormData();
        formData.append(\"data\", primaryFile);
        formData.append(\"service_id\", SERVICE_ID);
        formData.append(\"input_text\", buildInputText());
        response = await fetch(\"/api/n8n\", {
          method: \"POST\",
          body: formData,
          headers: { \"X-Webhook-URL\": WEBHOOK_URL },
        });
      } else {
        response = await fetch(\"/api/n8n\", {
          method: \"POST\",
          headers: { \"Content-Type\": \"application/json\" },
          body: JSON.stringify({
            webhook_url: WEBHOOK_URL,
            service_id: SERVICE_ID,
            input_text: buildInputText(),
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || \"提交失败\");
      }

      const contentType = response.headers.get(\"content-type\") || \"\";
      if (contentType && !contentType.includes(\"application/json\")) {
        // 文件返回：触发下载
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement(\"a\");
        a.href = url;
        const contentDisposition = response.headers.get(\"content-disposition\");
        let fileName = `result_${Date.now()}.xlsx`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename=\"?(.+?)\"?$/);
          if (match && match[1]) fileName = match[1];
        }
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setResultText(\"文件已下载\");
      } else {
        const data = await response.json();
        const textToShow =
          data.result ||
          data.message ||
          data.output ||
          data.text ||
          (typeof data === \"string\" ? data : JSON.stringify(data, null, 2));
        setResultText(textToShow);
      }
    } catch (err: any) {
      setResultText(err?.message || \"提交失败\");
    } finally {
      setLoading(false);
    }
  };

  const renderUpload = (state: UploadState, setter: (v: UploadState) => void, icon: JSX.Element) => (
    <label className=\"block border border-slate-200 rounded-xl p-4 hover:border-slate-300 cursor-pointer bg-white\">
      <div className=\"flex items-center gap-2 text-slate-700 text-sm font-medium\">
        {icon}
        <span>{state.label}</span>
        {state.file && <span className=\"text-emerald-600 text-xs\">已选择：{state.file.name}</span>}
      </div>
      <input
        type=\"file\"
        accept={state.accept}
        className=\"hidden\"
        onChange={(e) => handleFileChange(setter, state, e.target.files?.[0] || null)}
      />
      {state.helper && <p className=\"mt-2 text-xs text-slate-500\">{state.helper}</p>}
    </label>
  );

  return (
    <div className=\"min-h-screen bg-slate-50 py-10 px-4\">
      <div className=\"max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-6\">
        <div className=\"flex items-center justify-between mb-6\">
          <div>
            <h1 className=\"text-xl font-semibold text-slate-900\">Amazon Listing Expert</h1>
            <p className=\"text-sm text-slate-500\">World-Class GEO & COSMO Algorithm Support</p>
          </div>
          <div className=\"text-xs text-slate-400\">Powered by Gemini 3.0 Pro</div>
        </div>

        <div className=\"grid gap-4 md:grid-cols-2\">
          <div className=\"md:col-span-2\">
            <h3 className=\"text-sm font-semibold text-slate-800 mb-3\">Step 1. 上传产品图片</h3>
            {renderUpload(
              productImage,
              setProductImage,
              <ImageIcon className=\"text-amber-500\" size={18} />,
            )}
          </div>

          <div>
            <h3 className=\"text-sm font-semibold text-slate-800 mb-2\">选择站点 (国家)</h3>
            <div className=\"border border-slate-200 rounded-xl px-3 py-2 bg-white\">
              <select
                className=\"w-full bg-white text-sm text-slate-800 outline-none\"
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
              >
                <option value=\"\">请选择一个国家</option>
                {MARKETPLACES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h3 className=\"text-sm font-semibold text-slate-800 mb-2\">关键词词库</h3>
            {renderUpload(
              keywordBank,
              setKeywordBank,
              <FileUp className=\"text-amber-500\" size={18} />,
            )}
          </div>

          <div className=\"md:col-span-2\">
            <h3 className=\"text-sm font-semibold text-slate-800 mb-2\">产品信息描述</h3>
            <textarea
              className=\"w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 h-28 outline-none focus:border-slate-300 bg-white\"
              placeholder=\"输入卖点、规格、材质、核心功能、用户场景等\"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
            />
          </div>

          <div className=\"md:col-span-2\">
            <h3 className=\"text-sm font-semibold text-slate-800 mb-2\">Rufus 相关问题及答案</h3>
            {renderUpload(
              rfa,
              setRfa,
              <FileText className=\"text-amber-500\" size={18} />,
            )}
          </div>
        </div>

        <div className=\"mt-6 flex justify-end\">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className=\"inline-flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed\"
          >
            {loading ? <Loader2 className=\"animate-spin\" size={16} /> : <CheckCircle size={16} />}
            {loading ? \"生成中...\" : \"提交任务\"}
          </button>
        </div>

        {resultText && (
          <div className=\"mt-4 border border-slate-200 rounded-xl p-3 bg-slate-50 text-sm text-slate-800 whitespace-pre-wrap break-words\">
            {resultText}
          </div>
        )}
      </div>
    </div>
  );
}
