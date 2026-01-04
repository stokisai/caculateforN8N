"use client";

import { useMemo, useState, useCallback } from "react";
import { 
  LogOut, Upload, FileSpreadsheet, CheckCircle, Loader2, 
  Download, AlertCircle, X, ArrowLeft, Trash2
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { KeywordTask, KeywordFileType } from "@/types/supabase";

// 文件类型配置
const FILE_CONFIG: { type: KeywordFileType; label: string; required: boolean }[] = [
  { type: "h10_main", label: "H10反查总表", required: true },
  { type: "self_asin", label: "自身ASIN反查", required: true },
  { type: "competitor_aba", label: "竞对ABA热搜词反查", required: true },
  { type: "competitor_1", label: "竞品1", required: false },
  { type: "competitor_2", label: "竞品2", required: false },
  { type: "competitor_3", label: "竞品3", required: false },
  { type: "competitor_4", label: "竞品4", required: false },
  { type: "competitor_5", label: "竞品5", required: false },
  { type: "competitor_6", label: "竞品6", required: false },
  { type: "competitor_7", label: "竞品7", required: false },
  { type: "competitor_8", label: "竞品8", required: false },
  { type: "competitor_9", label: "竞品9", required: false },
  { type: "competitor_10", label: "竞品10", required: false },
  { type: "keyword_base", label: "拓词基础表", required: true },
];

interface FileUploadState {
  file: File | null;
  uploading: boolean;
  uploaded: boolean;
  error: string | null;
}

type FilesState = Record<KeywordFileType, FileUploadState>;

const initialFileState: FileUploadState = {
  file: null,
  uploading: false,
  uploaded: false,
  error: null,
};

export default function KeywordToolClient({ 
  user, 
  recentTasks 
}: { 
  user: { id: string; email?: string }; 
  recentTasks: KeywordTask[];
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  
  // 文件状态
  const [files, setFiles] = useState<FilesState>(() => {
    const initial: Partial<FilesState> = {};
    FILE_CONFIG.forEach(config => {
      initial[config.type] = { ...initialFileState };
    });
    return initial as FilesState;
  });
  
  // 任务状态
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("idle");
  const [taskProgress, setTaskProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 历史任务
  const [tasks, setTasks] = useState<KeywordTask[]>(recentTasks);

  // 处理文件选择
  const handleFileSelect = useCallback((fileType: KeywordFileType, file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: {
        ...prev[fileType],
        file,
        uploaded: false,
        error: null,
      }
    }));
  }, []);

  // 清除文件
  const handleFileClear = useCallback((fileType: KeywordFileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: { ...initialFileState }
    }));
  }, []);

  // 检查必填文件是否都已选择
  const requiredFilesSelected = useMemo(() => {
    return FILE_CONFIG
      .filter(c => c.required)
      .every(c => files[c.type].file !== null);
  }, [files]);

  // 获取已选择的文件数量
  const selectedFilesCount = useMemo(() => {
    return Object.values(files).filter(f => f.file !== null).length;
  }, [files]);

  // 提交任务
  const handleSubmit = async () => {
    if (!requiredFilesSelected) {
      setErrorMsg("请上传所有必填文件");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setTaskStatus("uploading");
    setTaskProgress(0);

    try {
      // 1. 创建任务记录
      const { data: task, error: taskError } = await supabase
        .from("keyword_tasks")
        .insert({ user_id: user.id, status: "pending", progress: 0 })
        .select()
        .single();

      if (taskError || !task) {
        throw new Error(taskError?.message || "创建任务失败");
      }

      setTaskId(task.id);
      setTaskProgress(5);

      // 2. 上传所有文件到 Storage
      const fileRecords: { file_type: KeywordFileType; storage_path: string; file_name: string; file_size: number }[] = [];
      const filesToUpload = Object.entries(files).filter(([, state]) => state.file !== null);
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const [fileType, state] = filesToUpload[i] as [KeywordFileType, FileUploadState];
        const file = state.file!;
        
        const storagePath = `${user.id}/${task.id}/${fileType}_${Date.now()}.xlsx`;
        
        setFiles(prev => ({
          ...prev,
          [fileType]: { ...prev[fileType], uploading: true }
        }));

        const { error: uploadError } = await supabase.storage
          .from("keyword-files")
          .upload(storagePath, file);

        if (uploadError) {
          throw new Error(`上传 ${FILE_CONFIG.find(c => c.type === fileType)?.label} 失败: ${uploadError.message}`);
        }

        fileRecords.push({
          file_type: fileType,
          storage_path: storagePath,
          file_name: file.name,
          file_size: file.size,
        });

        setFiles(prev => ({
          ...prev,
          [fileType]: { ...prev[fileType], uploading: false, uploaded: true }
        }));

        setTaskProgress(5 + Math.round((i + 1) / filesToUpload.length * 20));
      }

      // 3. 保存文件记录到数据库
      const { error: filesError } = await supabase
        .from("keyword_task_files")
        .insert(fileRecords.map(r => ({ ...r, task_id: task.id })));

      if (filesError) {
        throw new Error(`保存文件记录失败: ${filesError.message}`);
      }

      setTaskProgress(30);
      setTaskStatus("processing");

      // 4. 调用后端处理 API
      const response = await fetch("/api/keyword-tool/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: task.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "处理请求失败");
      }

      // 5. 轮询任务状态
      pollTaskStatus(task.id);

    } catch (error) {
      console.error("Submit error:", error);
      setErrorMsg(error instanceof Error ? error.message : "提交失败");
      setTaskStatus("failed");
      setIsSubmitting(false);
    }
  };

  // 轮询任务状态
  const pollTaskStatus = async (id: string) => {
    const poll = async () => {
      const { data: task, error } = await supabase
        .from("keyword_tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !task) {
        setErrorMsg("获取任务状态失败");
        setTaskStatus("failed");
        setIsSubmitting(false);
        return;
      }

      setTaskProgress(task.progress ?? 0);
      setTaskStatus(task.status ?? "pending");

      if (task.status === "success") {
        setResultUrl(task.result_url);
        setIsSubmitting(false);
        // 刷新任务列表
        refreshTasks();
      } else if (task.status === "failed") {
        setErrorMsg(task.error_msg || "处理失败");
        setIsSubmitting(false);
      } else {
        // 继续轮询
        setTimeout(poll, 2000);
      }
    };

    poll();
  };

  // 刷新任务列表
  const refreshTasks = async () => {
    const { data } = await supabase
      .from("keyword_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (data) {
      setTasks(data);
    }
  };

  // 下载结果
  const handleDownload = async (downloadTaskId: string) => {
    try {
      const response = await fetch(`/api/keyword-tool/download/${downloadTaskId}`);
      
      if (!response.ok) {
        throw new Error("下载失败");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `关键词分类结果_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("下载失败，请重试");
    }
  };

  // 重置表单
  const handleReset = () => {
    setFiles(() => {
      const initial: Partial<FilesState> = {};
      FILE_CONFIG.forEach(config => {
        initial[config.type] = { ...initialFileState };
      });
      return initial as FilesState;
    });
    setTaskId(null);
    setTaskStatus("idle");
    setTaskProgress(0);
    setResultUrl(null);
    setErrorMsg(null);
    setIsSubmitting(false);
  };

  // 登出
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 顶部导航 */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </a>
            <div>
              <h1 className="text-xl font-bold text-white">易逊跨境关键词词库搭建工具</h1>
              <p className="text-sm text-slate-400">上传Excel文件，自动分类标记关键词</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} /> 退出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：文件上传区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 说明卡片 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">📋 使用说明</h2>
              <div className="text-sm text-slate-300 space-y-2">
                <p>1. 上传 <span className="text-amber-400 font-medium">14个Excel文件</span>（标有 * 的为必填）</p>
                <p>2. 系统将自动处理并生成三列分类：<span className="text-emerald-400">关键词类别</span>、<span className="text-blue-400">相关性分类</span>、<span className="text-purple-400">流量大小分类</span></p>
                <p>3. 处理完成后可下载结果Excel文件</p>
              </div>
            </div>

            {/* 文件上传网格 */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">📁 上传文件</h2>
                <span className="text-sm text-slate-400">
                  已选择 {selectedFilesCount} / {FILE_CONFIG.length} 个文件
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {FILE_CONFIG.map((config) => (
                  <FileUploadCard
                    key={config.type}
                    config={config}
                    state={files[config.type]}
                    onSelect={(file) => handleFileSelect(config.type, file)}
                    onClear={() => handleFileClear(config.type)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={!requiredFilesSelected || isSubmitting}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 transition-all shadow-lg shadow-emerald-500/25"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    处理中...
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    开始搭建词库
                  </>
                )}
              </button>
              
              {(taskStatus !== "idle" || selectedFilesCount > 0) && (
                <button
                  onClick={handleReset}
                  disabled={isSubmitting && taskStatus === "processing"}
                  className="px-6 py-4 bg-slate-700 text-slate-300 rounded-xl font-medium hover:bg-slate-600 disabled:opacity-50 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            {/* 进度显示 */}
            {taskStatus !== "idle" && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-medium">处理进度</h3>
                  <StatusBadge status={taskStatus} />
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${taskProgress}%` }}
                  />
                </div>
                
                <p className="text-sm text-slate-400 text-center">{taskProgress}% 完成</p>

                {errorMsg && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-300">{errorMsg}</p>
                  </div>
                )}

                {taskStatus === "success" && taskId && (
                  <button
                    onClick={() => handleDownload(taskId)}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-indigo-600 transition-all"
                  >
                    <Download size={20} />
                    下载结果文件
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 右侧：历史任务 */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">📜 历史任务</h2>
              
              {tasks.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">暂无历史任务</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskHistoryCard
                      key={task.id}
                      task={task}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// 文件上传卡片组件
function FileUploadCard({ 
  config, 
  state, 
  onSelect, 
  onClear,
  disabled 
}: { 
  config: { type: KeywordFileType; label: string; required: boolean };
  state: FileUploadState;
  onSelect: (file: File | null) => void;
  onClear: () => void;
  disabled: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // 验证文件类型
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('请上传 Excel 文件 (.xlsx 或 .xls)');
        return;
      }
      onSelect(file);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
        state.file 
          ? 'border-emerald-500/50 bg-emerald-500/5' 
          : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white truncate">
              {config.label}
            </span>
            {config.required && (
              <span className="text-red-400 text-xs">*</span>
            )}
          </div>
          
          {state.file ? (
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="text-emerald-400 flex-shrink-0" size={16} />
              <span className="text-xs text-emerald-300 truncate">{state.file.name}</span>
              {state.uploaded && <CheckCircle className="text-emerald-400 flex-shrink-0" size={14} />}
              {state.uploading && <Loader2 className="text-blue-400 animate-spin flex-shrink-0" size={14} />}
            </div>
          ) : (
            <p className="text-xs text-slate-500">点击选择文件</p>
          )}
        </div>
        
        {state.file && !disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {state.error && (
        <p className="mt-2 text-xs text-red-400">{state.error}</p>
      )}
    </div>
  );
}

// 状态徽章组件
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    idle: { label: "就绪", className: "bg-slate-600 text-slate-300" },
    uploading: { label: "上传中", className: "bg-blue-500/20 text-blue-300" },
    processing: { label: "处理中", className: "bg-amber-500/20 text-amber-300" },
    success: { label: "完成", className: "bg-emerald-500/20 text-emerald-300" },
    failed: { label: "失败", className: "bg-red-500/20 text-red-300" },
    pending: { label: "等待中", className: "bg-slate-500/20 text-slate-300" },
  };

  const { label, className } = config[status] || config.pending;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

// 历史任务卡片组件
function TaskHistoryCard({ 
  task, 
  onDownload 
}: { 
  task: KeywordTask; 
  onDownload: (taskId: string) => void;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const status = task.status ?? "pending";
  
  return (
    <div className="bg-slate-700/30 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-slate-400">{formatDate(task.created_at)}</span>
        <StatusBadge status={status} />
      </div>
      
      {status === "success" && task.result_url && (
        <button
          onClick={() => onDownload(task.id)}
          className="w-full mt-2 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Download size={14} />
          下载结果
        </button>
      )}
      
      {status === "failed" && task.error_msg && (
        <p className="mt-2 text-xs text-red-400 line-clamp-2">{task.error_msg}</p>
      )}
      
      {status === "processing" && (
        <div className="mt-2">
          <div className="w-full bg-slate-600 rounded-full h-1.5">
            <div 
              className="bg-amber-400 h-1.5 rounded-full transition-all"
              style={{ width: `${task.progress ?? 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

