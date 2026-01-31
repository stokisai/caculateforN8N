"use client";

import { useMemo, useState } from "react";
import { LogOut, Upload, FileText, CheckCircle, Loader2, Copy } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function DashboardClient({ services, user }: any) {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // 新增：用来存储 FastAPI 返回的文字内容
  const [resultContent, setResultContent] = useState("");

  // 新增：异步任务处理状态
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [taskStatus, setTaskStatus] = useState("idle");

  // 使用集中式 Supabase 客户端
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

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
    setTaskId(null);
    setTaskProgress(0);
    setTaskStatus("idle");
  };

  // 轮询任务状态
  const pollTaskStatus = async (jobId: string, baseUrl: string) => {
    setTaskStatus("running");

    const poll = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/jobs/${jobId}`);
        if (!response.ok) throw new Error("Failed to fetch task status");

        const data = await response.json();
        setTaskProgress(Math.round((data.progress || 0) * 100));
        setTaskStatus(data.status);

        if (data.status === "done") {
          // 任务完成
          if (data.artifacts && data.artifacts.result_path) {
            // 是 Excel/文件处理任务
            handleDownloadResult(jobId, baseUrl);
            setSuccess(true);
            setLoading(false);
          } else if (data.artifacts && data.artifacts.report_url) {
            // 是社媒选品法任务（原来逻辑）
            setSuccess(true);
            setLoading(false);
          } else {
            // 可能只有消息
            setResultContent(data.message || "处理完成");
            setSuccess(true);
            setLoading(false);
          }
        } else if (data.status === "failed") {
          throw new Error(data.error || "后端任务执行失败");
        } else {
          // 继续轮询
          setTimeout(poll, 2000);
        }
      } catch (error: any) {
        console.error("Polling error:", error);
        alert(`任务处理出错: ${error.message}`);
        setLoading(false);
        setTaskStatus("failed");
      }
    };

    poll();
  };

  // 下载异步处理结果
  const handleDownloadResult = async (jobId: string, baseUrl: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/jobs/${jobId}/result`);
      if (!response.ok) throw new Error("下载结果失败");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = response.headers.get("content-disposition");
      let fileName = `processed_${jobId}.xlsx`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
      }

      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedService) return;
    setLoading(true);
    setResultContent(""); // 清空旧结果
    setTaskStatus("starting");
    setTaskProgress(0);

    try {
      // 1. 调用 FastAPI /process
      const webhookUrl = selectedService.webhook_url || "";
      if (!webhookUrl) {
        throw new Error("Missing service webhook_url");
      }

      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (selectedService?.id) {
        formData.append("service_id", selectedService.id);
      }
      if (inputText) {
        formData.append("input_text", inputText);
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Processing failed: ${errorText}`);
      }

      // === 核心逻辑：判断是异步任务 ID 还是直接结果 ===
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (data.job_id) {
          // [情况 C] 异步任务：开始轮询
          setTaskId(data.job_id);
          const baseUrl = new URL(webhookUrl).origin;
          pollTaskStatus(data.job_id, baseUrl);
          return; // pollTaskStatus 会处理后续 setLoading(false)
        }

        // [情况 B] 是文字 (JSON)：解析并展示
        const textToShow =
          data.result ||
          data.message ||
          data.output ||
          data.text ||
          (typeof data === 'string' ? data : JSON.stringify(data, null, 2));

        setResultContent(textToShow);
        setSuccess(true);
      } else {
        // [情况 A] 是文件：触发下载
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
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

        setSuccess(true);
      }

    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "提交失败，请重试");
    } finally {
      // 如果不是异步任务，则在这里关闭 loading
      if (taskStatus !== "running") {
        setLoading(false);
      }
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
            onClick={() => {
              const webhookUrl = service?.webhook_url || "";
              if (webhookUrl.startsWith("/") && !webhookUrl.startsWith("/api/")) {
                window.location.href = webhookUrl;
                return;
              }
              setSelectedService(service);
            }}
            className="group bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-500 cursor-pointer transition-all"
          >
            <div className="h-40 bg-slate-100 rounded-lg mb-4 overflow-hidden relative">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes("/images/service-fallback.svg")) {
                      target.src = "/images/service-fallback.svg";
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <img src="/images/service-fallback.svg" alt="Service" className="w-20 h-20 opacity-70" />
                </div>
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

                  {loading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{taskStatus === "running" ? "正在后台处理" : "准备执行..."}</span>
                        <span>{taskProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${taskProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading || ((selectedService.input_type === "file" && !file) || (selectedService.input_type === "text" && !inputText))}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
                  >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    {loading ? (taskStatus === "running" ? "处理中..." : "启动中...") : "提交任务"}
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
