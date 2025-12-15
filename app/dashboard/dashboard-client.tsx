"use client";

import { useState } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut, Upload, FileText, CheckCircle, Loader2, Copy, X } from "lucide-react";
import type { Service } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// tasks 表 insert 用
type TaskInsert = {
  user_id: string;
  service_id: string;
  input_text: string | null;
  file_url: string | null;
  status: string;
};

type DashboardClientProps = {
  services: Service[];
  user: {
    id: string;
    email?: string | null;
  };
};

export default function DashboardClient({ services, user }: DashboardClientProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultContent, setResultContent] = useState("");

  // 初始化 Supabase Browser Client
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

    // 验证输入
    const requiresText =
      selectedService.input_type === "text" ||
      selectedService.input_type === "both";
    const requiresFile =
      selectedService.input_type === "file" ||
      selectedService.input_type === "both";

    if (requiresText && !inputText.trim()) {
      alert("请输入文本内容");
      return;
    }
    if (requiresFile && !file) {
      alert("请上传文件");
      return;
    }

    setLoading(true);
    setResultContent("");
    setSuccess(false);

    try {
      // ✅ 新架构：直接调用 FastAPI，不经过 n8n 和 Supabase Storage
      // FastAPI endpoint 存储在 services.webhook_url 中（需要更新为 FastAPI URL）
      const fastApiUrl = selectedService.webhook_url;
      
      if (!fastApiUrl || !fastApiUrl.startsWith("http")) {
        throw new Error(`FastAPI URL 配置错误: ${fastApiUrl}`);
      }

      console.log("🚀 直接调用 FastAPI:", fastApiUrl);
      console.log("📤 发送数据:", {
        hasFile: !!file,
        fileName: file?.name,
        fileSize: file?.size,
        hasText: !!inputText,
        textLength: inputText?.length,
      });

      // 构建 FormData（multipart/form-data）
      const formData = new FormData();
      
      // 如果有文件，直接添加到 FormData
      if (file) {
        formData.append("file", file);
        console.log("📁 文件已添加到 FormData:", file.name, file.size, "bytes");
      }
      
      // 如果有文本输入，也添加到 FormData
      if (inputText) {
        formData.append("input_text", inputText);
        console.log("📝 文本已添加到 FormData:", inputText.length, "字符");
      }
      
      // ✅ 传递 service_id 给 FastAPI（用于区分不同的处理逻辑）
      formData.append("service_id", selectedService.id);
      console.log("🔑 Service ID:", selectedService.id);

      // 直接 POST 到 FastAPI
      const response = await fetch(fastApiUrl, {
        method: "POST",
        body: formData,
        // 不要设置 Content-Type，让浏览器自动设置 multipart/form-data with boundary
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ FastAPI 错误响应:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        throw new Error(errorText || `FastAPI 返回错误: ${response.status}`);
      }

      // 处理响应
      const contentType = response.headers.get("content-type") || "";
      console.log("📥 FastAPI 响应:", {
        status: response.status,
        contentType: contentType,
      });
      
      if (contentType.includes("application/json")) {
        // JSON 响应
        const data = await response.json();
        console.log("📥 FastAPI JSON 响应:", data);
        const text =
          data.result ||
          data.message ||
          data.output ||
          data.text ||
          JSON.stringify(data, null, 2);
        setResultContent(text);
        setSuccess(true);
      } else {
        // 文件响应（如 Excel）
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        const contentDisposition = response.headers.get("content-disposition");
        let fileName = `result_${Date.now()}.xlsx`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?(.+)"?/);
          if (match) fileName = match[1];
        }

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setSuccess(true);
        setResultContent("文件已下载");
      }

      // 重置表单
      setInputText("");
      setFile(null);
      setTimeout(() => handleCloseModal(), 1500);
    } catch (error: any) {
      console.error("❌ FastAPI 调用失败:", error);
      alert(error.message || "提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* 顶部 */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">控制台</h1>
          <p className="text-slate-500">欢迎回来, {user.email || "用户"}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600"
        >
          <LogOut size={16} /> 退出登录
        </button>
      </div>

      {/* 服务列表 */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          // 🔍 调试日志
          console.log("🔍 SERVICE DATA:", {
            id: service.id,
            title: service.title,
            webhook_url: service.webhook_url,
            input_type: service.input_type,
            image_url: service.image_url,
            has_webhook: !!service.webhook_url,
            has_input_type: !!service.input_type,
          });

          return (
            <article
              key={service.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md cursor-pointer"
              onClick={() => {
                // ✅ 数据验证
                if (!service.webhook_url) {
                  alert("该服务暂未配置 webhook URL，无法使用");
                  console.error("❌ 服务缺少 webhook_url:", service);
                  return;
                }
                if (!service.input_type) {
                  alert("该服务缺少输入类型配置");
                  console.error("❌ 服务缺少 input_type:", service);
                  return;
                }
                if (!service.id) {
                  alert("服务数据异常，缺少 ID");
                  console.error("❌ 服务缺少 id:", service);
                  return;
                }

                console.log("✅ 选择服务:", service);
                setSelectedService(service);
              }}
            >
              {/* ✅ 图片容器 - 确保有 relative 和固定高度 */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <Image
                  src={
                    service.image_url ||
                    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-700">
                    {service.input_type}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3">
                  {service.description}
                </p>
                <div className="mt-auto pt-2">
                  <Button className="w-full">Use Agent</Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {selectedService.title}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {selectedService.description}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              {(selectedService.input_type === "text" ||
                selectedService.input_type === "both") && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    文本输入
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="请输入..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </div>
              )}

              {(selectedService.input_type === "file" ||
                selectedService.input_type === "both") && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    上传文件 (.csv, .xlsx, .txt)
                  </p>
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-400">
                    <div className="flex items-center gap-3">
                      <Upload className="h-4 w-4" />
                      <span>{file ? file.name : "选择文件"}</span>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setFile(f ?? null);
                      }}
                    />
                  </label>
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {resultContent ? (
                    <div>
                      <p className="font-medium mb-2">处理成功！</p>
                      <pre className="text-xs whitespace-pre-wrap">
                        {resultContent}
                      </pre>
                    </div>
                  ) : (
                    "任务已提交！"
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  取消
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      提交中...
                    </span>
                  ) : (
                    "提交"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
