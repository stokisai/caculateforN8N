"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut, Upload, FileText, CheckCircle, Loader2, Copy } from "lucide-react";

export default function DashboardClient({ services, user }: any) {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // 新增：用来存储 n8n 返回的文字内容
  const [resultContent, setResultContent] = useState("");

  // 初始化客户端 Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleCloseModal = () => {
    setSuccess(false);
    setResultContent("");
    setSelectedService(null);
    setFile(null);
    setInputText("");
  };

  const handleSubmit = async () => {
    if (!selectedService) return;
    setLoading(true);
    setResultContent(""); // 清空旧结果

    try {
      // 1. 如果有文件，直接上传到 n8n webhook（multipart/form-data）
      let response: Response;
      
      if (file) {
        // 使用 FormData 直接上传文件
        const formData = new FormData();
        formData.append("data", file);

        response = await fetch("/api/n8n", {
          method: "POST",
          body: formData,
          headers: {
            "X-Webhook-URL": selectedService.webhook_url || "",
          },
        });
      } else {
        // 没有文件时，发送 JSON
        response = await fetch("/api/n8n", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            webhook_url: selectedService.webhook_url,
            input_text: inputText,
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Processing failed: ${errorText}`);
      }

      // === 核心逻辑：判断是文件还是文字 ===
      const contentType = response.headers.get("content-type");

      if (contentType && !contentType.includes("application/json")) {
        // [情况 A] 是文件：触发下载
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // 尝试从 header 获取文件名，如果没有则用默认的
        const contentDisposition = response.headers.get("content-disposition");
        let fileName = `result_${Date.now()}.xlsx`;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
        }
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setSuccess(true); // 显示简单的成功提示
      } else {
        // [情况 B] 是文字 (JSON)：解析并展示
        const data = await response.json();
        
        // 智能提取：尝试找到看起来像结果的字段
        const textToShow = 
            data.result || 
            data.message || 
            data.output || 
            data.text ||
            (typeof data === 'string' ? data : JSON.stringify(data, null, 2));
        
        setResultContent(textToShow);
        setSuccess(true); // 显示带文字的成功提示
      }

    } catch (error) {
      console.error("Error:", error);
      alert("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* 顶部导航 */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">控制台</h1>
          <p className="text-slate-500">欢迎回来, {user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} /> 退出登录
        </button>
      </div>

      {/* 服务卡片网格 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service: any) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="group bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-500 cursor-pointer transition-all"
          >
            <div className="h-40 bg-slate-100 rounded-lg mb-4 overflow-hidden relative">
              {service.image_url ? (
                <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
            <p className="text-slate-500 text-sm line-clamp-2">{service.description}</p>
            <div className="mt-4 flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              立即使用 &rarr;
            </div>
          </div>
        ))}
      </div>

      {/* 弹窗 Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {!success ? (
              // === 表单状态 ===
              <>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold">{selectedService.title}</h2>
                  <button onClick={() => setSelectedService(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                <div className="space-y-4">
                  {/* 文件上传区 */}
                  {(selectedService.input_type === "file" || selectedService.input_type === "both") && (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-indigo-400 transition-colors relative">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <div className="flex flex-col items-center gap-2">
                        {file ? (
                          <>
                            <FileText className="text-indigo-600" size={32} />
                            <span className="text-sm font-medium text-slate-900">{file.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="text-slate-400" size={32} />
                            <span className="text-sm text-slate-500">拖拽或点击上传文件</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 文本输入区 */}
                  {(selectedService.input_type === "text" || selectedService.input_type === "both") && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">需求描述</label>
                      <textarea
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        rows={3}
                        placeholder="请输入具体要求..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading || ((selectedService.input_type === "file" && !file) || (selectedService.input_type === "text" && !inputText))}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
                  >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    {loading ? "处理中..." : "提交任务"}
                  </button>
                </div>
              </>
            ) : (
              // === 成功结果展示状态 ===
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">处理完成！</h3>
                
                {resultContent ? (
                  // 如果有文字结果，显示文本框
                  <div className="mt-4 text-left">
                    <p className="text-sm text-slate-500 mb-2 font-medium">AI 回复内容：</p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-60 overflow-y-auto mb-3">
                      <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans break-words">
                        {resultContent}
                      </pre>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(resultContent);
                        alert("已复制到剪贴板");
                      }}
                      className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                    >
                      <Copy size={14} /> 复制结果
                    </button>
                  </div>
                ) : (
                  // 如果没有文字（说明是文件下载），显示简单提示
                  <p className="text-slate-500">文件已自动开始下载。</p>
                )}

                <button
                  onClick={handleCloseModal}
                  className="mt-6 w-full bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  关闭
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}