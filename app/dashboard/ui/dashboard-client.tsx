"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Service, Database } from "@/types/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";

type Props = {
  services: Service[];
  user: User;
};

export default function DashboardClient({ services, user }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [selected, setSelected] = useState<Service | null>(null);
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requiresText = selected?.input_type === "text" || selected?.input_type === "both";
  const requiresFile = selected?.input_type === "file" || selected?.input_type === "both";

  const resetModal = () => {
    setInputText("");
    setFile(null);
    setSelected(null);
    setOpen(false);
    setLoading(false);
    setError(null);
  };

  const onSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 验证输入
      if (requiresText && !inputText.trim()) {
        throw new Error("Please provide the required text input.");
      }
      if (requiresFile && !file) {
        throw new Error("Please attach the required file.");
      }

      // ✅ 新架构：直接调用 FastAPI，不经过 n8n 和 Supabase Storage
      // FastAPI endpoint 存储在 services.webhook_url 中（需要更新为 FastAPI URL）
      const fastApiUrl = selected.webhook_url;
      
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
      formData.append("service_id", selected.id);
      console.log("🔑 Service ID:", selected.id);

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
        const resultText = data.message || data.result || JSON.stringify(data, null, 2);
        setSuccess(resultText);
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

        setSuccess("文件已下载！");
      }

      // 重置表单
      setInputText("");
      setFile(null);
      setTimeout(() => setOpen(false), 1500);
    } catch (err: any) {
      console.error("❌ FastAPI 调用失败:", err);
      setError(err?.message ?? "处理失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Service Catalog
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">AI Agents Shelf</h1>
          <p className="text-sm text-slate-600">
            Browse services and dispatch tasks straight into n8n.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
            {user.email ?? user.phone}
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            // 🔍 调试日志：检查每个 service 的数据完整性
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
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* ✅ 修复 1: 图片容器 - 确保有 relative 和固定高度 */}
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
                    <Button
                      className="w-full"
                      onClick={() => {
                        // ✅ 修复 2: 添加数据验证 - 防止点击无效
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
                        setSelected(service);
                        setOpen(true);
                        setError(null);
                        setSuccess(null);
                      }}
                    >
                      Use Agent
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
          {services.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
              No services yet. Add rows to the <code>services</code> table in Supabase.
            </div>
          )}
        </div>
      </main>

      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Submit task
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {selected.title}
                </h2>
                <p className="text-sm text-slate-600">{selected.description}</p>
              </div>
              <button
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                onClick={resetModal}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmitTask}>
              {requiresText && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Text Input
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Describe your task or paste keywords..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </div>
              )}

              {requiresFile && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Upload file (.csv, .xlsx, .txt)
                  </p>
                  <label className="mt-3 flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-400">
                    <div className="flex items-center gap-3">
                      <Upload className="h-4 w-4" />
                      <span>{file ? file.name : "Choose file"}</span>
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

              {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={resetModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit & Trigger"
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

