"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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
  const [resultText, setResultText] = useState<string | null>(null);  // 存储文本结果内容
  const [jobId, setJobId] = useState<string | null>(null);  // 社媒选品法任务 ID
  const [jobStatus, setJobStatus] = useState<any>(null);  // 任务状态
  const pollingRef = useRef<NodeJS.Timeout | null>(null);  // 轮询定时器引用
  
  // ✅ H10 服务专用状态
  const H10_SERVICE_ID = "a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f";
  const [h10Files, setH10Files] = useState<Record<string, File | null>>({
    "H10反查总表": null,
    "竞品1": null,
    "竞品2": null,
    "竞品3": null,
    "竞品4": null,
    "竞品5": null,
    "竞品6": null,
    "竞品7": null,
    "竞品8": null,
    "竞品9": null,
    "竞品10": null,
    "自身ASIN反查": null,
    "竞对ABA热搜词反查": null,
    "拓词基础表": null,
  });
  const [h10Folder, setH10Folder] = useState<FileList | null>(null);

  const requiresText = selected?.input_type === "text" || selected?.input_type === "both";
  const requiresFile = selected?.input_type === "file" || selected?.input_type === "both";

  const resetModal = () => {
    setInputText("");
    setFile(null);
    setSelected(null);
    setOpen(false);
    setLoading(false);
    setError(null);
    setSuccess(null);
    setResultText(null);
    // 清理轮询
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setJobId(null);
    setJobStatus(null);
    // ✅ 重置 H10 文件状态
    setH10Files({
      "H10反查总表": null,
      "竞品1": null,
      "竞品2": null,
      "竞品3": null,
      "竞品4": null,
      "竞品5": null,
      "竞品6": null,
      "竞品7": null,
      "竞品8": null,
      "竞品9": null,
      "竞品10": null,
      "自身ASIN反查": null,
      "竞对ABA热搜词反查": null,
      "拓词基础表": null,
    });
    setH10Folder(null);
  };

  // 轮询任务状态
  const startJobPolling = (jobId: string, baseUrl: string) => {
    console.log("🔄 startJobPolling 被调用:", { jobId, baseUrl });
    
    // 清除之前的轮询
    if (pollingRef.current) {
      console.log("🧹 清除之前的轮询");
      clearInterval(pollingRef.current);
    }

    // 立即查询一次
    console.log("📡 立即查询一次任务状态");
    fetchJobStatus(jobId, baseUrl);

    // 每 3 秒轮询一次
    const interval = setInterval(() => {
      console.log("⏰ 定时轮询任务状态");
      fetchJobStatus(jobId, baseUrl);
    }, 3000);

    pollingRef.current = interval;
    console.log("✅ 轮询已启动，interval ID:", interval);
  };

  // 查询任务状态
  const fetchJobStatus = async (jobId: string, baseUrl: string) => {
    try {
      const apiBase = baseUrl.replace("/process", "");
      const statusUrl = `${apiBase}/api/jobs/${jobId}`;
      
      const response = await fetch(statusUrl);
      if (!response.ok) {
        throw new Error(`查询任务状态失败: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 任务状态响应:", data);
      setJobStatus(data);

      // 更新进度文本
      const progressPercent = Math.round((data.progress || 0) * 100);
      const completedSections = data.sections?.filter((s: any) => s.state === "llm_done").length || 0;
      const totalSections = data.sections?.length || 18;
      
      let statusText = `任务进度: ${progressPercent}%\n`;
      statusText += `已完成章节: ${completedSections}/${totalSections}\n\n`;
      statusText += `状态: ${data.status}\n`;
      
      if (data.sections && data.sections.length > 0) {
        statusText += `\n章节详情:\n`;
        data.sections.forEach((section: any, index: number) => {
          const stateEmojiMap: Record<string, string> = {
            pending: "⏳",
            serp_fetching: "🔍",
            serp_done: "✅",
            llm_writing: "✍️",
            llm_done: "✅",
            failed: "❌"
          };
          const stateEmoji = stateEmojiMap[section.state] || "⏳";
          statusText += `${stateEmoji} ${section.title || `章节${index + 1}`}: ${section.state}\n`;
        });
      }

      setResultText(statusText);

      // 如果任务完成或失败，停止轮询
      if (data.status === "done" || data.status === "failed") {
        if (pollingRef.current) {
          console.log("🛑 任务完成/失败，停止轮询");
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }

        if (data.status === "done") {
          setSuccess("任务完成！可以下载报告了");
          setLoading(false); // ✅ 修复：任务完成时重置 loading 状态
        } else {
          setError(data.error || "任务失败");
          setLoading(false); // ✅ 修复：任务失败时重置 loading 状态
        }
      }
    } catch (err: any) {
      console.error("❌ 查询任务状态失败:", err);
      // 不显示错误，继续轮询
    }
  };

  // 下载报告
  const downloadReport = async (jobId: string, baseUrl: string) => {
    try {
      console.log("📥 开始下载报告，Job ID:", jobId);
      
      // ✅ 修复：确保轮询已停止
      if (pollingRef.current) {
        console.log("🛑 停止轮询（下载报告时）");
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      
      const apiBase = baseUrl.replace("/process", "");
      const reportUrl = `${apiBase}/api/jobs/${jobId}/report`;
      
      const response = await fetch(reportUrl);
      if (!response.ok) {
        throw new Error(`下载报告失败: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Market_Research_Report_${jobId}.doc`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      console.log("✅ 报告下载完成");
    } catch (err: any) {
      console.error("❌ 下载报告失败:", err);
      setError(err?.message || "下载报告失败");
    }
  };

  // 下载图片
  const downloadImage = async (jobId: string, baseUrl: string) => {
    try {
      const apiBase = baseUrl.replace("/process", "");
      const imageUrl = `${apiBase}/api/jobs/${jobId}/image`;
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`下载图片失败: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Product_Image_${jobId}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("❌ 下载图片失败:", err);
      setError(err?.message || "下载图片失败");
    }
  };

  // 组件卸载时清理轮询
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const onSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    // ✅ 修复：防止重复提交（如果已有任务在运行，不允许提交新任务）
    if (loading) {
      console.log("⚠️ 任务正在提交中，忽略重复提交");
      return;
    }
    
    // ✅ 修复：如果已有任务在运行，提示用户
    if (jobId && jobStatus?.status === "running") {
      console.log("⚠️ 已有任务正在运行，请等待完成后再提交新任务");
      setError("已有任务正在运行，请等待完成后再提交新任务");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // ✅ H10 服务特殊验证
      if (selected.id === H10_SERVICE_ID) {
        // 检查是否至少上传了 H10反查总表
        if (!h10Files["H10反查总表"] && (!h10Folder || h10Folder.length === 0)) {
          throw new Error("请至少上传 H10反查总表 文件，或选择包含所有表格的文件夹");
        }
      } else {
        // 其他服务的验证
        if (requiresText && !inputText.trim()) {
          throw new Error("Please provide the required text input.");
        }
        if (requiresFile && !file) {
          throw new Error("Please attach the required file.");
        }
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
      
      // ✅ H10 服务特殊处理
      if (selected.id === H10_SERVICE_ID) {
        // 添加所有 H10 文件（包括单独上传和文件夹中的文件）
        Object.entries(h10Files).forEach(([key, file]) => {
          if (file) {
            formData.append(`file_${key}`, file);
            console.log(`📁 ${key} 文件已添加:`, file.name, file.size, "bytes");
          }
        });
        
        // 如果有文件夹，也添加所有文件（作为单独的文件参数）
        if (h10Folder && h10Folder.length > 0) {
          // ✅ 修复：先匹配竞品10，再匹配竞品1-9，避免 "竞品10" 被 "竞品1" 误匹配
          const namePatterns: Record<string, string[]> = {
            "H10反查总表": ["h10", "反查总表", "h10反查"],
            "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10"],  // 先匹配更长的
            "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9"],
            "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8"],
            "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7"],
            "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6"],
            "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5"],
            "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4"],
            "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3"],
            "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2"],
            "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1"],  // 最后匹配更短的
            "自身ASIN反查": ["自身", "asin反查", "自身asin"],
            "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
            "拓词基础表": ["拓词", "基础表"],
          };
          
          Array.from(h10Folder).forEach((file) => {
            const fileName = file.name.toLowerCase();
            let matched = false;
            
            // ✅ 修复：使用精确匹配，避免部分匹配导致的误判
            for (const [key, patterns] of Object.entries(namePatterns)) {
              if (matched) break;  // 如果已匹配，跳出循环
              
              // 对于竞品文件，使用精确的数字匹配
              if (key.startsWith("竞品")) {
                // 提取竞品编号（如 "竞品10" -> "10", "竞品1" -> "1"）
                const competitorNum = key.replace("竞品", "");
                
                for (const pattern of patterns) {
                  const patternLower = pattern.toLowerCase();
                  
                  // 对于数字模式（如 "1", "10"），使用精确匹配确保不会误匹配
                  if (patternLower === competitorNum) {
                    // 精确数字匹配：确保文件名中包含 "竞品" + 数字（完整匹配）
                    const exactPattern = `竞品${competitorNum}`.toLowerCase();
                    if (fileName.includes(exactPattern)) {
                      // 额外检查：如果文件名包含更大的数字（如文件名有"竞品10"但当前是"竞品1"），则跳过
                      if (competitorNum !== "10" && fileName.includes("竞品10")) {
                        continue;  // 跳过，让 "竞品10" 模式匹配
                      }
                      matched = true;
                      break;
                    }
                  } else if (fileName.includes(patternLower)) {
                    // 对于其他模式（如 "竞品10", "竞品 10"），直接匹配
                    // 但需要排除：如果文件名包含更大的数字（如文件名有"竞品10"但模式是"竞品1"），则跳过
                    if (competitorNum !== "10" && fileName.includes("竞品10")) {
                      continue;  // 文件名包含竞品10，跳过竞品1-9的匹配
                    }
                    matched = true;
                    break;
                  }
                }
              } else {
                // 其他文件使用普通匹配
                matched = patterns.some(pattern => fileName.includes(pattern.toLowerCase()));
              }
              
              if (matched) {
                // 如果这个文件还没有被单独上传，则添加
                if (!h10Files[key]) {
                  formData.append(`file_${key}`, file);
                  console.log(`📁 从文件夹添加 ${key}:`, file.name);
                  break;
                }
              }
            }
            
            if (!matched) {
              console.warn(`⚠️ 未匹配文件: ${file.name}`);
            }
          });
          console.log(`📁 文件夹文件处理完成: ${h10Folder.length} 个文件`);
        }
      } else {
        // 其他服务的处理
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
      }
      
      // ✅ 传递 service_id 给 FastAPI（用于区分不同的处理逻辑）
      formData.append("service_id", selected.id);
      console.log("🔑 Service ID:", selected.id);

      // 直接 POST 到 FastAPI
      console.log("📤 发送请求到:", fastApiUrl);
      console.log("📦 FormData 内容:", {
        hasServiceId: formData.has("service_id"),
        fileKeys: Array.from(formData.keys()).filter(k => k.startsWith("file_")),
      });
      
      let response: Response;
      try {
        response = await fetch(fastApiUrl, {
          method: "POST",
          body: formData,
          // 不要设置 Content-Type，让浏览器自动设置 multipart/form-data with boundary
        });
      } catch (fetchError: any) {
        console.error("❌ Fetch 请求失败:", fetchError);
        throw new Error(`无法连接到服务器: ${fetchError?.message || "网络错误"}。请检查服务器是否运行，URL 是否正确: ${fastApiUrl}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ FastAPI 错误响应:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: fastApiUrl,
        });
        throw new Error(errorText || `FastAPI 返回错误: ${response.status} ${response.statusText}`);
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
        
        // ✅ 修复 A：检查是否是社媒选品法任务（返回了 job_id）
        // 检查方式：1) 有 job_id 字段，或 2) message 中包含 "Job ID:" 或 "job_id"
        const detectedJobId = data.job_id || 
          (data.message?.match(/Job ID:\s*([a-f0-9-]+)/i)?.[1]) ||
          (data.message?.match(/job_id[:\s]+([a-f0-9-]+)/i)?.[1]);
        
        console.log("🔍 检测任务类型:", {
          hasJobId: !!data.job_id,
          detectedJobId,
          selectedId: selected.id,
          selectedTitle: selected.title,
        });
        
        // ✅ 修复 A：如果有 job_id，就启动轮询（自动轮询进度）
        if (detectedJobId) {
          console.log("✅ 检测到 job_id，启动轮询:", detectedJobId);
          
          // 设置状态
          setJobId(detectedJobId);
          setResultText(`任务已创建，Job ID: ${detectedJobId}\n正在处理中，请稍候...`);
          setSuccess("任务已创建");
          
          // ⚠️ 重要：使用 setTimeout 确保状态更新后再启动轮询
          setTimeout(() => {
            console.log("🚀 启动轮询，Job ID:", detectedJobId, "Base URL:", fastApiUrl);
            try {
              startJobPolling(detectedJobId, fastApiUrl);
              console.log("✅ 轮询函数已调用");
            } catch (err) {
              console.error("❌ 启动轮询失败:", err);
              setError("启动进度查询失败: " + (err as Error).message);
            }
          }, 100);
        } else {
          console.log("⚠️ 未检测到 job_id，使用普通响应处理");
          // 其他服务的普通 JSON 响应
          const resultText = data.message || data.result || JSON.stringify(data, null, 2);
          setResultText(resultText);
          setSuccess("处理完成");
        }
      } else if (contentType.includes("text/plain")) {
        // 文本文件响应（.txt）- 读取内容并显示
        const text = await response.text();
        console.log("📥 FastAPI 文本响应:", text);
        setResultText(text);
        setSuccess("处理完成");
      } else {
        // 其他文件响应（如 Excel）- 直接下载
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
        // Excel 文件下载后自动关闭
        setTimeout(() => {
          setInputText("");
          setFile(null);
          setOpen(false);
        }, 1500);
      }
      // 文本结果（JSON 或 text/plain）不自动关闭，让用户查看和下载
    } catch (err: any) {
      console.error("❌ FastAPI 调用失败:", err);
      const errorMessage = err?.message ?? "处理失败，请重试";
      console.error("错误详情:", {
        message: errorMessage,
        name: err?.name,
        stack: err?.stack,
        fastApiUrl: selected?.webhook_url,
      });
      // 如果错误消息包含 "Failed to fetch"，提供更友好的提示
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("fetch")) {
        setError(`无法连接到服务器: ${selected?.webhook_url}。请检查：1) 服务器是否运行，2) URL 是否正确，3) 是否存在 CORS 问题。`);
      } else {
        setError(errorMessage);
      }
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
            // 移除调试日志，避免重复打印（性能优化）

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
                        console.log("🔍 服务 ID 检查:", { 
                          serviceId: service.id, 
                          h10ServiceId: H10_SERVICE_ID, 
                          isMatch: service.id === H10_SERVICE_ID,
                          serviceTitle: service.title
                        });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full ${selected.id === H10_SERVICE_ID ? 'max-w-4xl' : 'max-w-xl'} rounded-2xl border border-slate-200 bg-white p-6 shadow-xl my-8`}>
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
              {/* ✅ H10 服务特殊界面 */}
              {selected.id === H10_SERVICE_ID ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      方式一：分别上传各个表格文件
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(h10Files).map((key) => (
                        <label
                          key={key}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:border-slate-400"
                        >
                          <span className="truncate flex-1 mr-2">{key}</span>
                          <span className="text-xs text-slate-500">
                            {h10Files[key] ? h10Files[key]!.name : "选择文件"}
                          </span>
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              setH10Files((prev) => ({ ...prev, [key]: f }));
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      方式二：选择包含所有表格的文件夹
                    </p>
                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-400">
                      <div className="flex items-center gap-3">
                        <Upload className="h-4 w-4" />
                        <span>
                          {h10Folder && h10Folder.length > 0
                            ? `已选择 ${h10Folder.length} 个文件`
                            : "选择文件夹"}
                        </span>
                      </div>
                      <input
                        type="file"
                        {...({ webkitdirectory: "" } as any)}
                        multiple
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          setH10Folder(e.target.files);
                          // 自动匹配文件名
                          if (e.target.files) {
                            const newFiles: Record<string, File | null> = { ...h10Files };
                            const namePatterns: Record<string, string[]> = {
                              "H10反查总表": ["h10", "反查总表", "h10反查"],
                              // ✅ 修复：先匹配竞品10，再匹配竞品1-9，避免 "竞品10" 被 "竞品1" 误匹配
                              "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10", "10"],
                              "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9", "9"],
                              "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8", "8"],
                              "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7", "7"],
                              "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6", "6"],
                              "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5", "5"],
                              "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4", "4"],
                              "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3", "3"],
                              "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2", "2"],
                              "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1", "1"],
                              "自身ASIN反查": ["自身", "asin反查", "自身asin"],
                              "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
                              "拓词基础表": ["拓词", "基础表"],
                            };
                            
                            Array.from(e.target.files).forEach((file) => {
                              const fileName = file.name.toLowerCase();
                              let matched = false;
                              
                              // ✅ 修复：使用精确匹配，避免部分匹配导致的误判
                              for (const [key, patterns] of Object.entries(namePatterns)) {
                                if (matched) break;  // 如果已匹配，跳出外层循环
                                
                                // 对于竞品文件，使用精确的数字匹配
                                if (key.startsWith("竞品")) {
                                  // 提取竞品编号（如 "竞品10" -> "10", "竞品1" -> "1"）
                                  const competitorNum = key.replace("竞品", "");
                                  
                                  for (const pattern of patterns) {
                                    const patternLower = pattern.toLowerCase();
                                    
                                    // 对于数字模式（如 "1", "10"），使用精确匹配确保不会误匹配
                                    if (patternLower === competitorNum) {
                                      // 精确数字匹配：确保文件名中包含 "竞品" + 数字
                                      const exactPattern = `竞品${competitorNum}`.toLowerCase();
                                      if (fileName.includes(exactPattern)) {
                                        if (!newFiles[key]) {
                                          newFiles[key] = file;
                                          console.log(`✅ 自动匹配 (精确): ${file.name} -> ${key}`);
                                          matched = true;
                                          break;
                                        }
                                      }
                                    } else if (fileName.includes(patternLower)) {
                                      // 对于其他模式（如 "竞品10", "竞品 10"），直接匹配
                                      // 但需要排除：如果文件名包含更大的数字（如文件名有"竞品10"但模式是"竞品1"），则跳过
                                      if (competitorNum !== "10" && fileName.includes("竞品10")) {
                                        continue;  // 文件名包含竞品10，跳过竞品1-9的匹配
                                      }
                                      if (!newFiles[key]) {
                                        newFiles[key] = file;
                                        console.log(`✅ 自动匹配: ${file.name} -> ${key}`);
                                        matched = true;
                                        break;
                                      }
                                    }
                                  }
                                } else {
                                  // 其他文件使用普通匹配
                                  if (patterns.some(pattern => fileName.includes(pattern.toLowerCase()))) {
                                    if (!newFiles[key]) {
                                      newFiles[key] = file;
                                      console.log(`✅ 自动匹配: ${file.name} -> ${key}`);
                                      matched = true;
                                      break;
                                    }
                                  }
                                }
                              }
                              
                              if (!matched) {
                                console.warn(`⚠️ 未匹配文件: ${file.name}`);
                              }
                            });
                            setH10Files(newFiles);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
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
                </>
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
              
              {resultText && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {jobId ? "任务进度" : "分析结果"}
                    </h3>
                    <div className="flex gap-2">
                      {jobId && jobStatus?.status === "done" && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              downloadReport(jobId, selected.webhook_url);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            下载 Word 报告
                          </button>
                          {jobStatus?.artifacts?.image_path && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                downloadImage(jobId, selected.webhook_url);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              下载图片
                            </button>
                          )}
                        </>
                      )}
                      {!jobId && (
                        <button
                          onClick={() => {
                            const blob = new Blob([resultText], { type: 'text/plain; charset=utf-8' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `分析报告_${Date.now()}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          下载 .txt 文件
                        </button>
                      )}
                    </div>
                  </div>
                  {jobId && jobStatus && (
                    <div className="mb-3">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${Math.round((jobStatus.progress || 0) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        进度: {Math.round((jobStatus.progress || 0) * 100)}%
                      </p>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap break-words text-sm text-slate-700 font-mono max-h-96 overflow-y-auto">
                    {resultText}
                  </pre>
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
                      {selected.id === H10_SERVICE_ID ? "处理中..." : "Submitting..."}
                    </span>
                  ) : (
                    selected.id === H10_SERVICE_ID ? "开始搭建词库" : "Submit & Trigger"
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


        }
        if (requiresFile && !file) {
          throw new Error("Please attach the required file.");
        }
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
      
      // ✅ H10 服务特殊处理
      if (selected.id === H10_SERVICE_ID) {
        // 添加所有 H10 文件（包括单独上传和文件夹中的文件）
        Object.entries(h10Files).forEach(([key, file]) => {
          if (file) {
            formData.append(`file_${key}`, file);
            console.log(`📁 ${key} 文件已添加:`, file.name, file.size, "bytes");
          }
        });
        
        // 如果有文件夹，也添加所有文件（作为单独的文件参数）
        if (h10Folder && h10Folder.length > 0) {
          // ✅ 修复：先匹配竞品10，再匹配竞品1-9，避免 "竞品10" 被 "竞品1" 误匹配
          const namePatterns: Record<string, string[]> = {
            "H10反查总表": ["h10", "反查总表", "h10反查"],
            "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10"],  // 先匹配更长的
            "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9"],
            "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8"],
            "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7"],
            "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6"],
            "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5"],
            "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4"],
            "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3"],
            "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2"],
            "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1"],  // 最后匹配更短的
            "自身ASIN反查": ["自身", "asin反查", "自身asin"],
            "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
            "拓词基础表": ["拓词", "基础表"],
          };
          
          Array.from(h10Folder).forEach((file) => {
            const fileName = file.name.toLowerCase();
            let matched = false;
            
            // ✅ 修复：使用精确匹配，避免部分匹配导致的误判
            for (const [key, patterns] of Object.entries(namePatterns)) {
              if (matched) break;  // 如果已匹配，跳出循环
              
              // 对于竞品文件，使用精确的数字匹配
              if (key.startsWith("竞品")) {
                // 提取竞品编号（如 "竞品10" -> "10", "竞品1" -> "1"）
                const competitorNum = key.replace("竞品", "");
                
                for (const pattern of patterns) {
                  const patternLower = pattern.toLowerCase();
                  
                  // 对于数字模式（如 "1", "10"），使用精确匹配确保不会误匹配
                  if (patternLower === competitorNum) {
                    // 精确数字匹配：确保文件名中包含 "竞品" + 数字（完整匹配）
                    const exactPattern = `竞品${competitorNum}`.toLowerCase();
                    if (fileName.includes(exactPattern)) {
                      // 额外检查：如果文件名包含更大的数字（如文件名有"竞品10"但当前是"竞品1"），则跳过
                      if (competitorNum !== "10" && fileName.includes("竞品10")) {
                        continue;  // 跳过，让 "竞品10" 模式匹配
                      }
                      matched = true;
                      break;
                    }
                  } else if (fileName.includes(patternLower)) {
                    // 对于其他模式（如 "竞品10", "竞品 10"），直接匹配
                    // 但需要排除：如果文件名包含更大的数字（如文件名有"竞品10"但模式是"竞品1"），则跳过
                    if (competitorNum !== "10" && fileName.includes("竞品10")) {
                      continue;  // 文件名包含竞品10，跳过竞品1-9的匹配
                    }
                    matched = true;
                    break;
                  }
                }
              } else {
                // 其他文件使用普通匹配
                matched = patterns.some(pattern => fileName.includes(pattern.toLowerCase()));
              }
              
              if (matched) {
                // 如果这个文件还没有被单独上传，则添加
                if (!h10Files[key]) {
                  formData.append(`file_${key}`, file);
                  console.log(`📁 从文件夹添加 ${key}:`, file.name);
                  break;
                }
              }
            }
            
            if (!matched) {
              console.warn(`⚠️ 未匹配文件: ${file.name}`);
            }
          });
          console.log(`📁 文件夹文件处理完成: ${h10Folder.length} 个文件`);
        }
      } else {
        // 其他服务的处理
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
      }
      
      // ✅ 传递 service_id 给 FastAPI（用于区分不同的处理逻辑）
      formData.append("service_id", selected.id);
      console.log("🔑 Service ID:", selected.id);

      // 直接 POST 到 FastAPI
      console.log("📤 发送请求到:", fastApiUrl);
      console.log("📦 FormData 内容:", {
        hasServiceId: formData.has("service_id"),
        fileKeys: Array.from(formData.keys()).filter(k => k.startsWith("file_")),
      });
      
      let response: Response;
      try {
        response = await fetch(fastApiUrl, {
          method: "POST",
          body: formData,
          // 不要设置 Content-Type，让浏览器自动设置 multipart/form-data with boundary
        });
      } catch (fetchError: any) {
        console.error("❌ Fetch 请求失败:", fetchError);
        throw new Error(`无法连接到服务器: ${fetchError?.message || "网络错误"}。请检查服务器是否运行，URL 是否正确: ${fastApiUrl}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ FastAPI 错误响应:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: fastApiUrl,
        });
        throw new Error(errorText || `FastAPI 返回错误: ${response.status} ${response.statusText}`);
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
        
        // ✅ 修复 A：检查是否是社媒选品法任务（返回了 job_id）
        // 检查方式：1) 有 job_id 字段，或 2) message 中包含 "Job ID:" 或 "job_id"
        const detectedJobId = data.job_id || 
          (data.message?.match(/Job ID:\s*([a-f0-9-]+)/i)?.[1]) ||
          (data.message?.match(/job_id[:\s]+([a-f0-9-]+)/i)?.[1]);
        
        console.log("🔍 检测任务类型:", {
          hasJobId: !!data.job_id,
          detectedJobId,
          selectedId: selected.id,
          selectedTitle: selected.title,
        });
        
        // ✅ 修复 A：如果有 job_id，就启动轮询（自动轮询进度）
        if (detectedJobId) {
          console.log("✅ 检测到 job_id，启动轮询:", detectedJobId);
          
          // 设置状态
          setJobId(detectedJobId);
          setResultText(`任务已创建，Job ID: ${detectedJobId}\n正在处理中，请稍候...`);
          setSuccess("任务已创建");
          
          // ⚠️ 重要：使用 setTimeout 确保状态更新后再启动轮询
          setTimeout(() => {
            console.log("🚀 启动轮询，Job ID:", detectedJobId, "Base URL:", fastApiUrl);
            try {
              startJobPolling(detectedJobId, fastApiUrl);
              console.log("✅ 轮询函数已调用");
            } catch (err) {
              console.error("❌ 启动轮询失败:", err);
              setError("启动进度查询失败: " + (err as Error).message);
            }
          }, 100);
        } else {
          console.log("⚠️ 未检测到 job_id，使用普通响应处理");
          // 其他服务的普通 JSON 响应
          const resultText = data.message || data.result || JSON.stringify(data, null, 2);
          setResultText(resultText);
          setSuccess("处理完成");
        }
      } else if (contentType.includes("text/plain")) {
        // 文本文件响应（.txt）- 读取内容并显示
        const text = await response.text();
        console.log("📥 FastAPI 文本响应:", text);
        setResultText(text);
        setSuccess("处理完成");
      } else {
        // 其他文件响应（如 Excel）- 直接下载
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
        // Excel 文件下载后自动关闭
        setTimeout(() => {
          setInputText("");
          setFile(null);
          setOpen(false);
        }, 1500);
      }
      // 文本结果（JSON 或 text/plain）不自动关闭，让用户查看和下载
    } catch (err: any) {
      console.error("❌ FastAPI 调用失败:", err);
      const errorMessage = err?.message ?? "处理失败，请重试";
      console.error("错误详情:", {
        message: errorMessage,
        name: err?.name,
        stack: err?.stack,
        fastApiUrl: selected?.webhook_url,
      });
      // 如果错误消息包含 "Failed to fetch"，提供更友好的提示
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("fetch")) {
        setError(`无法连接到服务器: ${selected?.webhook_url}。请检查：1) 服务器是否运行，2) URL 是否正确，3) 是否存在 CORS 问题。`);
      } else {
        setError(errorMessage);
      }
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
            // 移除调试日志，避免重复打印（性能优化）

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
                        console.log("🔍 服务 ID 检查:", { 
                          serviceId: service.id, 
                          h10ServiceId: H10_SERVICE_ID, 
                          isMatch: service.id === H10_SERVICE_ID,
                          serviceTitle: service.title
                        });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full ${selected.id === H10_SERVICE_ID ? 'max-w-4xl' : 'max-w-xl'} rounded-2xl border border-slate-200 bg-white p-6 shadow-xl my-8`}>
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
              {/* ✅ H10 服务特殊界面 */}
              {selected.id === H10_SERVICE_ID ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      方式一：分别上传各个表格文件
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(h10Files).map((key) => (
                        <label
                          key={key}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:border-slate-400"
                        >
                          <span className="truncate flex-1 mr-2">{key}</span>
                          <span className="text-xs text-slate-500">
                            {h10Files[key] ? h10Files[key]!.name : "选择文件"}
                          </span>
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              setH10Files((prev) => ({ ...prev, [key]: f }));
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      方式二：选择包含所有表格的文件夹
                    </p>
                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-400">
                      <div className="flex items-center gap-3">
                        <Upload className="h-4 w-4" />
                        <span>
                          {h10Folder && h10Folder.length > 0
                            ? `已选择 ${h10Folder.length} 个文件`
                            : "选择文件夹"}
                        </span>
                      </div>
                      <input
                        type="file"
                        {...({ webkitdirectory: "" } as any)}
                        multiple
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          setH10Folder(e.target.files);
                          // 自动匹配文件名
                          if (e.target.files) {
                            const newFiles: Record<string, File | null> = { ...h10Files };
                            const namePatterns: Record<string, string[]> = {
                              "H10反查总表": ["h10", "反查总表", "h10反查"],
                              // ✅ 修复：先匹配竞品10，再匹配竞品1-9，避免 "竞品10" 被 "竞品1" 误匹配
                              "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10", "10"],
                              "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9", "9"],
                              "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8", "8"],
                              "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7", "7"],
                              "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6", "6"],
                              "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5", "5"],
                              "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4", "4"],
                              "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3", "3"],
                              "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2", "2"],
                              "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1", "1"],
                              "自身ASIN反查": ["自身", "asin反查", "自身asin"],
                              "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
                              "拓词基础表": ["拓词", "基础表"],
                            };
                            
                            Array.from(e.target.files).forEach((file) => {
                              const fileName = file.name.toLowerCase();
                              let matched = false;
                              
                              // ✅ 修复：使用精确匹配，避免部分匹配导致的误判
                              for (const [key, patterns] of Object.entries(namePatterns)) {
                                if (matched) break;  // 如果已匹配，跳出外层循环
                                
                                // 对于竞品文件，使用精确的数字匹配
                                if (key.startsWith("竞品")) {
                                  // 提取竞品编号（如 "竞品10" -> "10", "竞品1" -> "1"）
                                  const competitorNum = key.replace("竞品", "");
                                  
                                  for (const pattern of patterns) {
                                    const patternLower = pattern.toLowerCase();
                                    
                                    // 对于数字模式（如 "1", "10"），使用精确匹配确保不会误匹配
                                    if (patternLower === competitorNum) {
                                      // 精确数字匹配：确保文件名中包含 "竞品" + 数字
                                      const exactPattern = `竞品${competitorNum}`.toLowerCase();
                                      if (fileName.includes(exactPattern)) {
                                        if (!newFiles[key]) {
                                          newFiles[key] = file;
                                          console.log(`✅ 自动匹配 (精确): ${file.name} -> ${key}`);
                                          matched = true;
                                          break;
                                        }
                                      }
                                    } else if (fileName.includes(patternLower)) {
                                      // 对于其他模式（如 "竞品10", "竞品 10"），直接匹配
                                      // 但需要排除：如果文件名包含更大的数字（如文件名有"竞品10"但模式是"竞品1"），则跳过
                                      if (competitorNum !== "10" && fileName.includes("竞品10")) {
                                        continue;  // 文件名包含竞品10，跳过竞品1-9的匹配
                                      }
                                      if (!newFiles[key]) {
                                        newFiles[key] = file;
                                        console.log(`✅ 自动匹配: ${file.name} -> ${key}`);
                                        matched = true;
                                        break;
                                      }
                                    }
                                  }
                                } else {
                                  // 其他文件使用普通匹配
                                  if (patterns.some(pattern => fileName.includes(pattern.toLowerCase()))) {
                                    if (!newFiles[key]) {
                                      newFiles[key] = file;
                                      console.log(`✅ 自动匹配: ${file.name} -> ${key}`);
                                      matched = true;
                                      break;
                                    }
                                  }
                                }
                              }
                              
                              if (!matched) {
                                console.warn(`⚠️ 未匹配文件: ${file.name}`);
                              }
                            });
                            setH10Files(newFiles);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
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
                </>
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
              
              {resultText && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {jobId ? "任务进度" : "分析结果"}
                    </h3>
                    <div className="flex gap-2">
                      {jobId && jobStatus?.status === "done" && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              downloadReport(jobId, selected.webhook_url);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            下载 Word 报告
                          </button>
                          {jobStatus?.artifacts?.image_path && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                downloadImage(jobId, selected.webhook_url);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              下载图片
                            </button>
                          )}
                        </>
                      )}
                      {!jobId && (
                        <button
                          onClick={() => {
                            const blob = new Blob([resultText], { type: 'text/plain; charset=utf-8' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `分析报告_${Date.now()}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          下载 .txt 文件
                        </button>
                      )}
                    </div>
                  </div>
                  {jobId && jobStatus && (
                    <div className="mb-3">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${Math.round((jobStatus.progress || 0) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        进度: {Math.round((jobStatus.progress || 0) * 100)}%
                      </p>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap break-words text-sm text-slate-700 font-mono max-h-96 overflow-y-auto">
                    {resultText}
                  </pre>
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
                      {selected.id === H10_SERVICE_ID ? "处理中..." : "Submitting..."}
                    </span>
                  ) : (
                    selected.id === H10_SERVICE_ID ? "开始搭建词库" : "Submit & Trigger"
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


        }
        if (requiresFile && !file) {
          throw new Error("Please attach the required file.");
        }
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
      
      // ✅ H10 服务特殊处理
      if (selected.id === H10_SERVICE_ID) {
        // 添加所有 H10 文件（包括单独上传和文件夹中的文件）
        Object.entries(h10Files).forEach(([key, file]) => {
          if (file) {
            formData.append(`file_${key}`, file);
            console.log(`📁 ${key} 文件已添加:`, file.name, file.size, "bytes");
          }
        });
        
        // 如果有文件夹，也添加所有文件（作为单独的文件参数）
        if (h10Folder && h10Folder.length > 0) {
          // ✅ 修复：先匹配竞品10，再匹配竞品1-9，避免 "竞品10" 被 "竞品1" 误匹配
          const namePatterns: Record<string, string[]> = {
            "H10反查总表": ["h10", "反查总表", "h10反查"],
            "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10"],  // 先匹配更长的
            "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9"],
            "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8"],
            "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7"],
            "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6"],
            "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5"],
            "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4"],
            "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3"],
            "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2"],
            "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1"],  // 最后匹配更短的
            "自身ASIN反查": ["自身", "asin反查", "自身asin"],
            "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
            "拓词基础表": ["拓词", "基础表"],
          };
          
          Array.from(h10Folder).forEach((file) => {
            const fileName = file.name.toLowerCase();
            let matched = false;
            
            // ✅ 修复：使用精确匹配，避免部分匹配导致的误判
            for (const [key, patterns] of Object.entries(namePatterns)) {
              if (matched) break;  // 如果已匹配，跳出循环
              
              // 对于竞品文件，使用精确的数字匹配
              if (key.startsWith("竞品")) {
                // 提取竞品编号（如 "竞品10" -> "10", "竞品1" -> "1"）
                const competitorNum = key.replace("竞品", "");
                
                for (const pattern of patterns) {
                  const patternLower = pattern.toLowerCase();
                  
                  // 对于数字模式（如 "1", "10"），使用精确匹配确保不会误匹配
                  if (patternLower === competitorNum) {
                    // 精确数字匹配：确保文件名中包含 "竞品" + 数字（完整匹配）
                    const exactPattern = `竞品${competitorNum}`.toLowerCase();
                    if (fileName.includes(exactPattern)) {
                      // 额外检查：如果文件名包含更大的数字（如文件名有"竞品10"但当前是"竞品1"），则跳过
                      if (competitorNum !== "10" && fileName.includes("竞品10")) {
                        continue;  // 跳过，让 "竞品10" 模式匹配
                      }
                      matched = true;
                      break;
                    }
                  } else if (fileName.includes(patternLower)) {
                    // 对于其他模式（如 "竞品10", "竞品 10"），直接匹配
                    // 但需要排除：如果文件名包含更大的数字（如文件名有"竞品10"但模式是"竞品1"），则跳过
                    if (competitorNum !== "10" && fileName.includes("竞品10")) {
                      continue;  // 文件名包含竞品10，跳过竞品1-9的匹配
                    }
                    matched = true;
                    break;
                  }
                }
              } else {
                // 其他文件使用普通匹配
                matched = patterns.some(pattern => fileName.includes(pattern.toLowerCase()));
              }
              
              if (matched) {
                // 如果这个文件还没有被单独上传，则添加
                if (!h10Files[key]) {
                  formData.append(`file_${key}`, file);
                  console.log(`📁 从文件夹添加 ${key}:`, file.name);
                  break;
                }
              }
            }
            
            if (!matched) {
              console.warn(`⚠️ 未匹配文件: ${file.name}`);
            }
          });
          console.log(`📁 文件夹文件处理完成: ${h10Folder.length} 个文件`);
        }
      } else {
        // 其他服务的处理
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
      }
      
      // ✅ 传递 service_id 给 FastAPI（用于区分不同的处理逻辑）
      formData.append("service_id", selected.id);
      console.log("🔑 Service ID:", selected.id);

      // 直接 POST 到 FastAPI
      console.log("📤 发送请求到:", fastApiUrl);
      console.log("📦 FormData 内容:", {
        hasServiceId: formData.has("service_id"),
        fileKeys: Array.from(formData.keys()).filter(k => k.startsWith("file_")),
      });
      
      let response: Response;
      try {
        response = await fetch(fastApiUrl, {
          method: "POST",
          body: formData,
          // 不要设置 Content-Type，让浏览器自动设置 multipart/form-data with boundary
        });
      } catch (fetchError: any) {
        console.error("❌ Fetch 请求失败:", fetchError);
        throw new Error(`无法连接到服务器: ${fetchError?.message || "网络错误"}。请检查服务器是否运行，URL 是否正确: ${fastApiUrl}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ FastAPI 错误响应:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: fastApiUrl,
        });
        throw new Error(errorText || `FastAPI 返回错误: ${response.status} ${response.statusText}`);
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
        
        // ✅ 修复 A：检查是否是社媒选品法任务（返回了 job_id）
        // 检查方式：1) 有 job_id 字段，或 2) message 中包含 "Job ID:" 或 "job_id"
        const detectedJobId = data.job_id || 
          (data.message?.match(/Job ID:\s*([a-f0-9-]+)/i)?.[1]) ||
          (data.message?.match(/job_id[:\s]+([a-f0-9-]+)/i)?.[1]);
        
        console.log("🔍 检测任务类型:", {
          hasJobId: !!data.job_id,
          detectedJobId,
          selectedId: selected.id,
          selectedTitle: selected.title,
        });
        
        // ✅ 修复 A：如果有 job_id，就启动轮询（自动轮询进度）
        if (detectedJobId) {
          console.log("✅ 检测到 job_id，启动轮询:", detectedJobId);
          
          // 设置状态
          setJobId(detectedJobId);
          setResultText(`任务已创建，Job ID: ${detectedJobId}\n正在处理中，请稍候...`);
          setSuccess("任务已创建");
          
          // ⚠️ 重要：使用 setTimeout 确保状态更新后再启动轮询
          setTimeout(() => {
            console.log("🚀 启动轮询，Job ID:", detectedJobId, "Base URL:", fastApiUrl);
            try {
              startJobPolling(detectedJobId, fastApiUrl);
              console.log("✅ 轮询函数已调用");
            } catch (err) {
              console.error("❌ 启动轮询失败:", err);
              setError("启动进度查询失败: " + (err as Error).message);
            }
          }, 100);
        } else {
          console.log("⚠️ 未检测到 job_id，使用普通响应处理");
          // 其他服务的普通 JSON 响应
          const resultText = data.message || data.result || JSON.stringify(data, null, 2);
          setResultText(resultText);
          setSuccess("处理完成");
        }
      } else if (contentType.includes("text/plain")) {
        // 文本文件响应（.txt）- 读取内容并显示
        const text = await response.text();
        console.log("📥 FastAPI 文本响应:", text);
        setResultText(text);
        setSuccess("处理完成");
      } else {
        // 其他文件响应（如 Excel）- 直接下载
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
        // Excel 文件下载后自动关闭
        setTimeout(() => {
          setInputText("");
          setFile(null);
          setOpen(false);
        }, 1500);
      }
      // 文本结果（JSON 或 text/plain）不自动关闭，让用户查看和下载
    } catch (err: any) {
      console.error("❌ FastAPI 调用失败:", err);
      const errorMessage = err?.message ?? "处理失败，请重试";
      console.error("错误详情:", {
        message: errorMessage,
        name: err?.name,
        stack: err?.stack,
        fastApiUrl: selected?.webhook_url,
      });
      // 如果错误消息包含 "Failed to fetch"，提供更友好的提示
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("fetch")) {
        setError(`无法连接到服务器: ${selected?.webhook_url}。请检查：1) 服务器是否运行，2) URL 是否正确，3) 是否存在 CORS 问题。`);
      } else {
        setError(errorMessage);
      }
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
            // 移除调试日志，避免重复打印（性能优化）

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
                        console.log("🔍 服务 ID 检查:", { 
                          serviceId: service.id, 
                          h10ServiceId: H10_SERVICE_ID, 
                          isMatch: service.id === H10_SERVICE_ID,
                          serviceTitle: service.title
                        });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full ${selected.id === H10_SERVICE_ID ? 'max-w-4xl' : 'max-w-xl'} rounded-2xl border border-slate-200 bg-white p-6 shadow-xl my-8`}>
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
              {/* ✅ H10 服务特殊界面 */}
              {selected.id === H10_SERVICE_ID ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      方式一：分别上传各个表格文件
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(h10Files).map((key) => (
                        <label
                          key={key}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:border-slate-400"
                        >
                          <span className="truncate flex-1 mr-2">{key}</span>
                          <span className="text-xs text-slate-500">
                            {h10Files[key] ? h10Files[key]!.name : "选择文件"}
                          </span>
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              setH10Files((prev) => ({ ...prev, [key]: f }));
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      方式二：选择包含所有表格的文件夹
                    </p>
                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-400">
                      <div className="flex items-center gap-3">
                        <Upload className="h-4 w-4" />
                        <span>
                          {h10Folder && h10Folder.length > 0
                            ? `已选择 ${h10Folder.length} 个文件`
                            : "选择文件夹"}
                        </span>
                      </div>
                      <input
                        type="file"
                        {...({ webkitdirectory: "" } as any)}
                        multiple
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          setH10Folder(e.target.files);
                          // 自动匹配文件名
                          if (e.target.files) {
                            const newFiles: Record<string, File | null> = { ...h10Files };
                            const namePatterns: Record<string, string[]> = {
                              "H10反查总表": ["h10", "反查总表", "h10反查"],
                              // ✅ 修复：先匹配竞品10，再匹配竞品1-9，避免 "竞品10" 被 "竞品1" 误匹配
                              "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10", "10"],
                              "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9", "9"],
                              "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8", "8"],
                              "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7", "7"],
                              "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6", "6"],
                              "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5", "5"],
                              "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4", "4"],
                              "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3", "3"],
                              "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2", "2"],
                              "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1", "1"],
                              "自身ASIN反查": ["自身", "asin反查", "自身asin"],
                              "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
                              "拓词基础表": ["拓词", "基础表"],
                            };
                            
                            Array.from(e.target.files).forEach((file) => {
                              const fileName = file.name.toLowerCase();
                              let matched = false;
                              
                              // ✅ 修复：使用精确匹配，避免部分匹配导致的误判
                              for (const [key, patterns] of Object.entries(namePatterns)) {
                                if (matched) break;  // 如果已匹配，跳出外层循环
                                
                                // 对于竞品文件，使用精确的数字匹配
                                if (key.startsWith("竞品")) {
                                  // 提取竞品编号（如 "竞品10" -> "10", "竞品1" -> "1"）
                                  const competitorNum = key.replace("竞品", "");
                                  
                                  for (const pattern of patterns) {
                                    const patternLower = pattern.toLowerCase();
                                    
                                    // 对于数字模式（如 "1", "10"），使用精确匹配确保不会误匹配
                                    if (patternLower === competitorNum) {
                                      // 精确数字匹配：确保文件名中包含 "竞品" + 数字
                                      const exactPattern = `竞品${competitorNum}`.toLowerCase();
                                      if (fileName.includes(exactPattern)) {
                                        if (!newFiles[key]) {
                                          newFiles[key] = file;
                                          console.log(`✅ 自动匹配 (精确): ${file.name} -> ${key}`);
                                          matched = true;
                                          break;
                                        }
                                      }
                                    } else if (fileName.includes(patternLower)) {
                                      // 对于其他模式（如 "竞品10", "竞品 10"），直接匹配
                                      // 但需要排除：如果文件名包含更大的数字（如文件名有"竞品10"但模式是"竞品1"），则跳过
                                      if (competitorNum !== "10" && fileName.includes("竞品10")) {
                                        continue;  // 文件名包含竞品10，跳过竞品1-9的匹配
                                      }
                                      if (!newFiles[key]) {
                                        newFiles[key] = file;
                                        console.log(`✅ 自动匹配: ${file.name} -> ${key}`);
                                        matched = true;
                                        break;
                                      }
                                    }
                                  }
                                } else {
                                  // 其他文件使用普通匹配
                                  if (patterns.some(pattern => fileName.includes(pattern.toLowerCase()))) {
                                    if (!newFiles[key]) {
                                      newFiles[key] = file;
                                      console.log(`✅ 自动匹配: ${file.name} -> ${key}`);
                                      matched = true;
                                      break;
                                    }
                                  }
                                }
                              }
                              
                              if (!matched) {
                                console.warn(`⚠️ 未匹配文件: ${file.name}`);
                              }
                            });
                            setH10Files(newFiles);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
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
                </>
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
              
              {resultText && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {jobId ? "任务进度" : "分析结果"}
                    </h3>
                    <div className="flex gap-2">
                      {jobId && jobStatus?.status === "done" && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              downloadReport(jobId, selected.webhook_url);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            下载 Word 报告
                          </button>
                          {jobStatus?.artifacts?.image_path && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                downloadImage(jobId, selected.webhook_url);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              下载图片
                            </button>
                          )}
                        </>
                      )}
                      {!jobId && (
                        <button
                          onClick={() => {
                            const blob = new Blob([resultText], { type: 'text/plain; charset=utf-8' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `分析报告_${Date.now()}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          下载 .txt 文件
                        </button>
                      )}
                    </div>
                  </div>
                  {jobId && jobStatus && (
                    <div className="mb-3">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${Math.round((jobStatus.progress || 0) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        进度: {Math.round((jobStatus.progress || 0) * 100)}%
                      </p>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap break-words text-sm text-slate-700 font-mono max-h-96 overflow-y-auto">
                    {resultText}
                  </pre>
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
                      {selected.id === H10_SERVICE_ID ? "处理中..." : "Submitting..."}
                    </span>
                  ) : (
                    selected.id === H10_SERVICE_ID ? "开始搭建词库" : "Submit & Trigger"
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


        }
        if (requiresFile && !file) {
          throw new Error("Please attach the required file.");
        }
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
      
      // ✅ H10 服务特殊处理
      if (selected.id === H10_SERVICE_ID) {
        // 添加所有 H10 文件（包括单独上传和文件夹中的文件）
        Object.entries(h10Files).forEach(([key, file]) => {
          if (file) {
            formData.append(`file_${key}`, file);
            console.log(`📁 ${key} 文件已添加:`, file.name, file.size, "bytes");
          }
        });
        
        // 如果有文件夹，也添加所有文件（作为单独的文件参数）
        if (h10Folder && h10Folder.length > 0) {
          // ✅ 修复：先匹配竞品10，再匹配竞品1-9，避免 "竞品10" 被 "竞品1" 误匹配
          const namePatterns: Record<string, string[]> = {
            "H10反查总表": ["h10", "反查总表", "h10反查"],
            "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10"],  // 先匹配更长的
            "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9"],
            "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8"],
            "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7"],
            "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6"],
            "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5"],
            "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4"],
            "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3"],
            "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2"],
            "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1"],  // 最后匹配更短的
            "自身ASIN反查": ["自身", "asin反查", "自身asin"],
            "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
            "拓词基础表": ["拓词", "基础表"],
          };
          
          Array.from(h10Folder).forEach((file) => {
            const fileName = file.name.toLowerCase();
            let matched = false;
            
            // ✅ 修复：使用精确匹配，避免部分匹配导致的误判
            for (const [key, patterns] of Object.entries(namePatterns)) {
              if (matched) break;  // 如果已匹配，跳出循环
              
              // 对于竞品文件，使用精确的数字匹配
              if (key.startsWith("竞品")) {
                // 提取竞品编号（如 "竞品10" -> "10", "竞品1" -> "1"）
                const competitorNum = key.replace("竞品", "");
                
                for (const pattern of patterns) {
                  const patternLower = pattern.toLowerCase();
                  
                  // 对于数字模式（如 "1", "10"），使用精确匹配确保不会误匹配
                  if (patternLower === competitorNum) {
                    // 精确数字匹配：确保文件名中包含 "竞品" + 数字（完整匹配）
                    const exactPattern = `竞品${competitorNum}`.toLowerCase();
                    if (fileName.includes(exactPattern)) {
                      // 额外检查：如果文件名包含更大的数字（如文件名有"竞品10"但当前是"竞品1"），则跳过
                      if (competitorNum !== "10" && fileName.includes("竞品10")) {
                        continue;  // 跳过，让 "竞品10" 模式匹配
                      }
                      matched = true;
                      break;
                    }
                  } else if (fileName.includes(patternLower)) {
                    // 对于其他模式（如 "竞品10", "竞品 10"），直接匹配
                    // 但需要排除：如果文件名包含更大的数字（如文件名有"竞品10"但模式是"竞品1"），则跳过
                    if (competitorNum !== "10" && fileName.includes("竞品10")) {
                      continue;  // 文件名包含竞品10，跳过竞品1-9的匹配
                    }
                    matched = true;
                    break;
                  }
                }
              } else {
                // 其他文件使用普通匹配
                matched = patterns.some(pattern => fileName.includes(pattern.toLowerCase()));
              }
              
              if (matched) {
                // 如果这个文件还没有被单独上传，则添加
                if (!h10Files[key]) {
                  formData.append(`file_${key}`, file);
                  console.log(`📁 从文件夹添加 ${key}:`, file.name);
                  break;
                }
              }
            }
            
            if (!matched) {
              console.warn(`⚠️ 未匹配文件: ${file.name}`);
            }
          });
          console.log(`📁 文件夹文件处理完成: ${h10Folder.length} 个文件`);
        }
      } else {
        // 其他服务的处理
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
      }
      
      // ✅ 传递 service_id 给 FastAPI（用于区分不同的处理逻辑）
      formData.append("service_id", selected.id);
      console.log("🔑 Service ID:", selected.id);

      // 直接 POST 到 FastAPI
      console.log("📤 发送请求到:", fastApiUrl);
      console.log("📦 FormData 内容:", {
        hasServiceId: formData.has("service_id"),
        fileKeys: Array.from(formData.keys()).filter(k => k.startsWith("file_")),
      });
      
      let response: Response;
      try {
        response = await fetch(fastApiUrl, {
          method: "POST",
          body: formData,
          // 不要设置 Content-Type，让浏览器自动设置 multipart/form-data with boundary
        });
      } catch (fetchError: any) {
        console.error("❌ Fetch 请求失败:", fetchError);
        throw new Error(`无法连接到服务器: ${fetchError?.message || "网络错误"}。请检查服务器是否运行，URL 是否正确: ${fastApiUrl}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ FastAPI 错误响应:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: fastApiUrl,
        });
        throw new Error(errorText || `FastAPI 返回错误: ${response.status} ${response.statusText}`);
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
        
        // ✅ 修复 A：检查是否是社媒选品法任务（返回了 job_id）
        // 检查方式：1) 有 job_id 字段，或 2) message 中包含 "Job ID:" 或 "job_id"
        const detectedJobId = data.job_id || 
          (data.message?.match(/Job ID:\s*([a-f0-9-]+)/i)?.[1]) ||
          (data.message?.match(/job_id[:\s]+([a-f0-9-]+)/i)?.[1]);
        
        console.log("🔍 检测任务类型:", {
          hasJobId: !!data.job_id,
          detectedJobId,
          selectedId: selected.id,
          selectedTitle: selected.title,
        });
        
        // ✅ 修复 A：如果有 job_id，就启动轮询（自动轮询进度）
        if (detectedJobId) {
          console.log("✅ 检测到 job_id，启动轮询:", detectedJobId);
          
          // 设置状态
          setJobId(detectedJobId);
          setResultText(`任务已创建，Job ID: ${detectedJobId}\n正在处理中，请稍候...`);
          setSuccess("任务已创建");
          
          // ⚠️ 重要：使用 setTimeout 确保状态更新后再启动轮询
          setTimeout(() => {
            console.log("🚀 启动轮询，Job ID:", detectedJobId, "Base URL:", fastApiUrl);
            try {
              startJobPolling(detectedJobId, fastApiUrl);
              console.log("✅ 轮询函数已调用");
            } catch (err) {
              console.error("❌ 启动轮询失败:", err);
              setError("启动进度查询失败: " + (err as Error).message);
            }
          }, 100);
        } else {
          console.log("⚠️ 未检测到 job_id，使用普通响应处理");
          // 其他服务的普通 JSON 响应
          const resultText = data.message || data.result || JSON.stringify(data, null, 2);
          setResultText(resultText);
          setSuccess("处理完成");
        }
      } else if (contentType.includes("text/plain")) {
        // 文本文件响应（.txt）- 读取内容并显示
        const text = await response.text();
        console.log("📥 FastAPI 文本响应:", text);
        setResultText(text);
        setSuccess("处理完成");
      } else {
        // 其他文件响应（如 Excel）- 直接下载
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
        // Excel 文件下载后自动关闭
        setTimeout(() => {
          setInputText("");
          setFile(null);
          setOpen(false);
        }, 1500);
      }
      // 文本结果（JSON 或 text/plain）不自动关闭，让用户查看和下载
    } catch (err: any) {
      console.error("❌ FastAPI 调用失败:", err);
      const errorMessage = err?.message ?? "处理失败，请重试";
      console.error("错误详情:", {
        message: errorMessage,
        name: err?.name,
        stack: err?.stack,
        fastApiUrl: selected?.webhook_url,
      });
      // 如果错误消息包含 "Failed to fetch"，提供更友好的提示
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("fetch")) {
        setError(`无法连接到服务器: ${selected?.webhook_url}。请检查：1) 服务器是否运行，2) URL 是否正确，3) 是否存在 CORS 问题。`);
      } else {
        setError(errorMessage);
      }
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
            // 移除调试日志，避免重复打印（性能优化）

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
                        console.log("🔍 服务 ID 检查:", { 
                          serviceId: service.id, 
                          h10ServiceId: H10_SERVICE_ID, 
                          isMatch: service.id === H10_SERVICE_ID,
                          serviceTitle: service.title
                        });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full ${selected.id === H10_SERVICE_ID ? 'max-w-4xl' : 'max-w-xl'} rounded-2xl border border-slate-200 bg-white p-6 shadow-xl my-8`}>
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
              {/* ✅ H10 服务特殊界面 */}
              {selected.id === H10_SERVICE_ID ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      方式一：分别上传各个表格文件
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.keys(h10Files).map((key) => (
                        <label
                          key={key}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:border-slate-400"
                        >
                          <span className="truncate flex-1 mr-2">{key}</span>
                          <span className="text-xs text-slate-500">
                            {h10Files[key] ? h10Files[key]!.name : "选择文件"}
                          </span>
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] ?? null;
                              setH10Files((prev) => ({ ...prev, [key]: f }));
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      方式二：选择包含所有表格的文件夹
                    </p>
                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-400">
                      <div className="flex items-center gap-3">
                        <Upload className="h-4 w-4" />
                        <span>
                          {h10Folder && h10Folder.length > 0
                            ? `已选择 ${h10Folder.length} 个文件`
                            : "选择文件夹"}
                        </span>
                      </div>
                      <input
                        type="file"
                        {...({ webkitdirectory: "" } as any)}
                        multiple
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          setH10Folder(e.target.files);
                          // 自动匹配文件名
                          if (e.target.files) {
                            const newFiles: Record<string, File | null> = { ...h10Files };
                            const namePatterns: Record<string, string[]> = {
                              "H10反查总表": ["h10", "反查总表", "h10反查"],
                              // ✅ 修复：先匹配竞品10，再匹配竞品1-9，避免 "竞品10" 被 "竞品1" 误匹配
                              "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10", "10"],
                              "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9", "9"],
                              "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8", "8"],
                              "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7", "7"],
                              "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6", "6"],
                              "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5", "5"],
                              "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4", "4"],
                              "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3", "3"],
                              "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2", "2"],
                              "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1", "1"],
                              "自身ASIN反查": ["自身", "asin反查", "自身asin"],
                              "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
                              "拓词基础表": ["拓词", "基础表"],
                            };
                            
                            Array.from(e.target.files).forEach((file) => {
                              const fileName = file.name.toLowerCase();
                              let matched = false;
                              
                              // ✅ 修复：使用精确匹配，避免部分匹配导致的误判
                              for (const [key, patterns] of Object.entries(namePatterns)) {
                                if (matched) break;  // 如果已匹配，跳出外层循环
                                
                                // 对于竞品文件，使用精确的数字匹配
                                if (key.startsWith("竞品")) {
                                  // 提取竞品编号（如 "竞品10" -> "10", "竞品1" -> "1"）
                                  const competitorNum = key.replace("竞品", "");
                                  
                                  for (const pattern of patterns) {
                                    const patternLower = pattern.toLowerCase();
                                    
                                    // 对于数字模式（如 "1", "10"），使用精确匹配确保不会误匹配
                                    if (patternLower === competitorNum) {
                                      // 精确数字匹配：确保文件名中包含 "竞品" + 数字
                                      const exactPattern = `竞品${competitorNum}`.toLowerCase();
                                      if (fileName.includes(exactPattern)) {
                                        if (!newFiles[key]) {
                                          newFiles[key] = file;
                                          console.log(`✅ 自动匹配 (精确): ${file.name} -> ${key}`);
                                          matched = true;
                                          break;
                                        }
                                      }
                                    } else if (fileName.includes(patternLower)) {
                                      // 对于其他模式（如 "竞品10", "竞品 10"），直接匹配
                                      // 但需要排除：如果文件名包含更大的数字（如文件名有"竞品10"但模式是"竞品1"），则跳过
                                      if (competitorNum !== "10" && fileName.includes("竞品10")) {
                                        continue;  // 文件名包含竞品10，跳过竞品1-9的匹配
                                      }
                                      if (!newFiles[key]) {
                                        newFiles[key] = file;
                                        console.log(`✅ 自动匹配: ${file.name} -> ${key}`);
                                        matched = true;
                                        break;
                                      }
                                    }
                                  }
                                } else {
                                  // 其他文件使用普通匹配
                                  if (patterns.some(pattern => fileName.includes(pattern.toLowerCase()))) {
                                    if (!newFiles[key]) {
                                      newFiles[key] = file;
                                      console.log(`✅ 自动匹配: ${file.name} -> ${key}`);
                                      matched = true;
                                      break;
                                    }
                                  }
                                }
                              }
                              
                              if (!matched) {
                                console.warn(`⚠️ 未匹配文件: ${file.name}`);
                              }
                            });
                            setH10Files(newFiles);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
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
                </>
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
              
              {resultText && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {jobId ? "任务进度" : "分析结果"}
                    </h3>
                    <div className="flex gap-2">
                      {jobId && jobStatus?.status === "done" && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              downloadReport(jobId, selected.webhook_url);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            下载 Word 报告
                          </button>
                          {jobStatus?.artifacts?.image_path && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                downloadImage(jobId, selected.webhook_url);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              下载图片
                            </button>
                          )}
                        </>
                      )}
                      {!jobId && (
                        <button
                          onClick={() => {
                            const blob = new Blob([resultText], { type: 'text/plain; charset=utf-8' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `分析报告_${Date.now()}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          下载 .txt 文件
                        </button>
                      )}
                    </div>
                  </div>
                  {jobId && jobStatus && (
                    <div className="mb-3">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${Math.round((jobStatus.progress || 0) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        进度: {Math.round((jobStatus.progress || 0) * 100)}%
                      </p>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap break-words text-sm text-slate-700 font-mono max-h-96 overflow-y-auto">
                    {resultText}
                  </pre>
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
                      {selected.id === H10_SERVICE_ID ? "处理中..." : "Submitting..."}
                    </span>
                  ) : (
                    selected.id === H10_SERVICE_ID ? "开始搭建词库" : "Submit & Trigger"
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

