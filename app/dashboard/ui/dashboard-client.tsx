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
      if (requiresText && !inputText.trim()) {
        throw new Error("Please provide the required text input.");
      }
      if (requiresFile && !file) {
        throw new Error("Please attach the required file.");
      }

      let filePath: string | null = null;
      let fileUrl: string | null = null;

      if (file) {
        // ① 上传文件
        const path = `${user.id}/${selected.id}/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("task-files")
          .upload(path, file);

        if (uploadError) {
          throw uploadError;
        }

        // ⚠️ 关键：必须使用 uploadData.path，不能自己拼
        filePath = uploadData?.path;
        if (!filePath) {
          throw new Error("文件上传失败：无法获取文件路径");
        }

        // ② 手动构建 Public URL（不依赖 getPublicUrl，确保格式正确）
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl) {
          throw new Error("NEXT_PUBLIC_SUPABASE_URL 未配置");
        }
        
        // 🔴 直接手动构建 URL，确保格式正确
        fileUrl = `${supabaseUrl}/storage/v1/object/public/task-files/${uploadData.path}`;
        
        // 🔴 强制验证：必须是完整的 HTTP URL
        if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
          throw new Error(`生成的 URL 格式错误: ${fileUrl}`);
        }
        
        // 🔴 强制验证：必须包含 /public/
        if (!fileUrl.includes("/storage/v1/object/public/")) {
          throw new Error(`URL 必须包含 /public/，但得到: ${fileUrl}`);
        }
        
        console.log("📁 文件上传成功:");
        console.log("  - 路径 (path):", filePath);
        console.log("  - Supabase URL:", supabaseUrl);
        console.log("  - 完整 URL (fileUrl):", fileUrl);
        console.log("  - URL 包含 /public/:", fileUrl.includes("/public/") ? "✅" : "❌");
        console.log("  - URL 格式验证: ✅");
      }

      const taskData = {
        user_id: user.id,
        service_id: selected.id,
        input_text: inputText || null,
        file_url: filePath, // 存储路径用于内部引用
        status: "pending",
      };

      const { data: task, error: insertError } = await (supabase
        .from("tasks")
        .insert(taskData as any) as any)
        .select()
        .single();

      if (insertError || !task) {
        throw insertError ?? new Error("Unable to create task.");
      }

      // ④ 发给 n8n（只允许 fileUrl，绝对不能是 path）
      const payload = {
        task_id: task.id,
        service_id: selected.id,
        user_id: user.id,
        input_text: inputText,
        file_url: fileUrl, // ✅ 只能是 URL，绝对不能是 path
      };

      // 【最终强制验证】确保 file_url 是完整的 URL（如果有文件）
      if (file) {
        if (!fileUrl) {
          throw new Error("文件已上传但无法生成 URL");
        }
        if (!fileUrl.startsWith("http://") && !fileUrl.startsWith("https://")) {
          throw new Error(`file_url 必须是完整的 HTTP URL，但得到: ${fileUrl}`);
        }
        // 额外检查：确保不是 path
        if (fileUrl.includes("\\") || (!fileUrl.includes("://") && fileUrl.includes("/"))) {
          throw new Error(`file_url 看起来像是路径而不是 URL: ${fileUrl}`);
        }
      }

      // 🔴 最终检查：如果 file_url 是 path 而不是 URL，直接报错
      if (file && payload.file_url) {
        const isPath = !payload.file_url.startsWith("http://") && !payload.file_url.startsWith("https://");
        if (isPath) {
          const errorMsg = `❌ 严重错误：file_url 是路径而不是 URL！\n\n路径: ${payload.file_url}\n\n这不应该发生！请检查代码。`;
          console.error(errorMsg);
          alert(errorMsg);
          throw new Error(errorMsg);
        }
      }

      console.log("📤 发送给 n8n 的完整数据:", JSON.stringify(payload, null, 2));
      console.log("📤 file_url 最终验证:", {
        value: payload.file_url,
        type: typeof payload.file_url,
        isUrl: payload.file_url?.startsWith("http"),
        isPath: payload.file_url?.includes("\\") || (!payload.file_url?.includes("://") && payload.file_url?.includes("/")),
      });

      // 🔴 发送前最后一次验证
      const bodyString = JSON.stringify(payload);
      if (file && bodyString.includes('"file_url":"') && !bodyString.includes('"file_url":"http')) {
        const errorMsg = `❌ 发送前检查失败：payload 中的 file_url 不是 URL！\n\n${bodyString}`;
        console.error(errorMsg);
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      console.log("✅ 验证通过，准备发送到 n8n...");
      console.log("🔗 Webhook URL:", selected.webhook_url);
      console.log("📦 Payload body:", bodyString);
      
      // 🔴 调试：显示实际发送的 file_url（仅开发环境）
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        console.log("🔍 [调试] 实际发送的 file_url:", payload.file_url);
        if (file && payload.file_url && !payload.file_url.startsWith("http")) {
          alert(`❌ 错误：file_url 不是 URL！\n\n值: ${payload.file_url}\n\n这不应该发生！`);
        }
      }

      await fetch(selected.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyString,
      });

      setSuccess("Task submitted and webhook triggered.");
      setInputText("");
      setFile(null);
      setTimeout(() => setOpen(false), 800);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
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

