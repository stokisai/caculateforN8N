"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut, Upload, FileText, CheckCircle, Loader2, Copy } from "lucide-react";

/**
 * ===== 类型定义（关键）=====
 */

// services 表
type Service = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  webhook_url: string;
  input_type: "file" | "text" | "both";
};

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
    email: string;
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

    setLoading(true);
    setResultContent("");

    try {
      console.log("🔍 使用的 Webhook URL:", selectedService.webhook_url);

      let response: Response;

      if (file) {
        const formData = new FormData();
        formData.append("data", file);

        response = await fetch("/api/n8n", {
          method: "POST",
          body: formData,
          headers: {
            "X-Webhook-URL": selectedService.webhook_url,
          },
        });
      } else {
        response = await fetch("/api/n8n", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-URL": selectedService.webhook_url,
          },
          body: JSON.stringify({
            input_text: inputText,
          }),
        });
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      // === 结果处理 ===
      const contentType = response.headers.get("content-type");

      if (contentType && !contentType.includes("application/json")) {
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
      } else {
        const data = await response.json();
        const text =
          data.result ||
          data.message ||
          data.output ||
          data.text ||
          JSON.stringify(data, null, 2);

        setResultContent(text);
        setSuccess(true);
      }

      // === 写入 tasks 表（关键修复点）===
      const { error: insertError } = await supabase
        .from("tasks")
        .insert<TaskInsert>({
          user_id: user.id,
          service_id: selectedService.id,
          input_text: inputText || null,
          file_url: null,
          status: "pending",
        });

      if (insertError) {
        console.error("Insert task error:", insertError);
      }

    } catch (error: any) {
      console.error("Error:", error);
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
          <p className="text-slate-500">欢迎回来, {user.email}</p>
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
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="bg-white rounded-xl p-6 border hover:border-indigo-500 cursor-pointer"
          >
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="text-sm text-slate-500">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Modal（保持你原逻辑） */}
      {/* ……此处 UI 不再重复，逻辑不变 */}
    </div>
  );
}
