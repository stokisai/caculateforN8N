"use client";

import { useMemo, useState, useCallback } from "react";
import { 
  LogOut, Upload, FileSpreadsheet, CheckCircle, Loader2, 
  Download, AlertCircle, X, ArrowLeft, Trash2, Info, LayoutGrid, Clock, ChevronRight
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { KeywordTask, KeywordFileType } from "@/types/supabase";

// 文件类型配置
const FILE_CONFIG: { type: KeywordFileType; label: string; required: boolean; group: 'main' | 'compete' | 'base' }[] = [
  { type: "h10_main", label: "H10反查总表", required: true, group: 'main' },
  { type: "self_asin", label: "自身ASIN反查", required: true, group: 'main' },
  { type: "competitor_aba", label: "竞对ABA热搜词反查", required: true, group: 'main' },
  { type: "competitor_1", label: "竞品1", required: false, group: 'compete' },
  { type: "competitor_2", label: "竞品2", required: false, group: 'compete' },
  { type: "competitor_3", label: "竞品3", required: false, group: 'compete' },
  { type: "competitor_4", label: "竞品4", required: false, group: 'compete' },
  { type: "competitor_5", label: "竞品5", required: false, group: 'compete' },
  { type: "competitor_6", label: "竞品6", required: false, group: 'compete' },
  { type: "competitor_7", label: "竞品7", required: false, group: 'compete' },
  { type: "competitor_8", label: "竞品8", required: false, group: 'compete' },
  { type: "competitor_9", label: "竞品9", required: false, group: 'compete' },
  { type: "competitor_10", label: "竞品10", required: false, group: 'compete' },
  { type: "keyword_base", label: "拓词基础表", required: true, group: 'base' },
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
  
  const [files, setFiles] = useState<FilesState>(() => {
    const initial: Partial<FilesState> = {};
    FILE_CONFIG.forEach(config => {
      initial[config.type] = { ...initialFileState };
    });
    return initial as FilesState;
  });
  
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("idle");
  const [taskProgress, setTaskProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tasks, setTasks] = useState<KeywordTask[]>(recentTasks);

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

  const handleFileClear = useCallback((fileType: KeywordFileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: { ...initialFileState }
    }));
  }, []);

  const requiredFilesSelected = useMemo(() => {
    return FILE_CONFIG
      .filter(c => c.required)
      .every(c => files[c.type].file !== null);
  }, [files]);

  const selectedFilesCount = useMemo(() => {
    return Object.values(files).filter(f => f.file !== null).length;
  }, [files]);

  const handleSubmit = async () => {
    if (!requiredFilesSelected) {
      setErrorMsg("请先上传标记为 '*' 的必填文件");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setTaskStatus("uploading");
    setTaskProgress(0);

    try {
      const { data: task, error: taskError } = await supabase
        .from("keyword_tasks")
        .insert({ user_id: user.id, status: "pending", progress: 0 })
        .select()
        .single();

      if (taskError || !task) throw new Error(taskError?.message || "创建任务失败");

      setTaskId(task.id);
      setTaskProgress(5);

      const fileRecords: { file_type: KeywordFileType; storage_path: string; file_name: string; file_size: number }[] = [];
      const filesToUpload = Object.entries(files).filter(([, state]) => state.file !== null);
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const [fileType, state] = filesToUpload[i] as [KeywordFileType, FileUploadState];
        const file = state.file!;
        const storagePath = `${user.id}/${task.id}/${fileType}_${Date.now()}.xlsx`;
        
        setFiles(prev => ({ ...prev, [fileType]: { ...prev[fileType], uploading: true } }));

        const { error: uploadError } = await supabase.storage.from("keyword-files").upload(storagePath, file);
        if (uploadError) throw new Error(`上传 ${FILE_CONFIG.find(c => c.type === fileType)?.label} 失败`);

        fileRecords.push({ file_type: fileType, storage_path: storagePath, file_name: file.name, file_size: file.size });
        setFiles(prev => ({ ...prev, [fileType]: { ...prev[fileType], uploading: false, uploaded: true } }));
        setTaskProgress(5 + Math.round((i + 1) / filesToUpload.length * 20));
      }

      const { error: filesError } = await supabase.from("keyword_task_files").insert(fileRecords.map(r => ({ ...r, task_id: task.id })));
      if (filesError) throw new Error("保存文件记录失败");

      setTaskProgress(30);
      setTaskStatus("processing");

      const response = await fetch("/api/keyword-tool/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: task.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "后端处理请求失败");
      }

      pollTaskStatus(task.id);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "提交失败");
      setTaskStatus("failed");
      setIsSubmitting(false);
    }
  };

  const pollTaskStatus = async (id: string) => {
    const poll = async () => {
      const { data: task, error } = await supabase.from("keyword_tasks").select("*").eq("id", id).single();
      if (error || !task) {
        setErrorMsg("同步任务进度失败");
        setTaskStatus("failed");
        setIsSubmitting(false);
        return;
      }
      setTaskProgress(task.progress ?? 0);
      setTaskStatus(task.status ?? "pending");
      if (task.status === "success") {
        setResultUrl(task.result_url);
        setIsSubmitting(false);
        refreshTasks();
      } else if (task.status === "failed") {
        setErrorMsg(task.error_msg || "处理失败");
        setIsSubmitting(false);
      } else {
        setTimeout(poll, 2000);
      }
    };
    poll();
  };

  const refreshTasks = async () => {
    const { data } = await supabase.from("keyword_tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10);
    if (data) setTasks(data);
  };

  const handleDownload = async (downloadTaskId: string) => {
    try {
      const response = await fetch(`/api/keyword-tool/download/${downloadTaskId}`);
      if (!response.ok) throw new Error("下载失败");
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
      alert("下载失败");
    }
  };

  const handleReset = () => {
    setFiles(() => {
      const initial: Partial<FilesState> = {};
      FILE_CONFIG.forEach(config => { initial[config.type] = { ...initialFileState }; });
      return initial as FilesState;
    });
    setTaskId(null); setTaskStatus("idle"); setTaskProgress(0); setResultUrl(null); setErrorMsg(null); setIsSubmitting(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a 
              href="/dashboard" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all border border-slate-300 shadow-sm font-bold"
            >
              <ArrowLeft size={20} />
              <span>返回工作台</span>
            </a>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                易逊关键词库搭建工具
                <span className="bg-indigo-600 text-white text-[12px] px-2 py-0.5 rounded-md font-black">V2.0</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
            <div className="text-right">
              <p className="text-[11px] text-slate-500 font-bold">登录账号</p>
              <p className="text-sm font-bold text-slate-800">{user.email}</p>
            </div>
            <button onClick={handleSignOut} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8">
            {/* 说明卡片 */}
            <div className="bg-white rounded-3xl p-8 border-2 border-indigo-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Info size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900">操作说明</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "1. 准备数据", text: "上传 14 个 Excel 业务报表" },
                  { title: "2. 逻辑标记", text: "系统自动计算三维度分类" },
                  { title: "3. 一键下载", text: "直接获取标准词库 Excel" }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <p className="font-black text-indigo-600 mb-1">{item.title}</p>
                    <p className="text-sm text-slate-600 font-bold leading-snug">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 文件上传核心区 */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">文件上传</h2>
                  <p className="text-base text-slate-500 font-bold">请确保必填项 (*) 全部上传</p>
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl border-2 border-slate-200 shadow-sm text-center min-w-[120px]">
                  <p className="text-[12px] text-slate-400 font-black uppercase tracking-widest mb-1">已选文件</p>
                  <p className="text-2xl font-mono text-slate-900 font-black">{selectedFilesCount} / {FILE_CONFIG.length}</p>
                </div>
              </div>
              
              <div className="p-8 space-y-10">
                {[
                  { id: 'main', label: '核心反查表 (必填)', color: 'indigo' },
                  { id: 'compete', label: '竞品分析表 (选填)', color: 'emerald' },
                  { id: 'base', label: '拓词基础表 (必填)', color: 'amber' }
                ].map(group => (
                  <div key={group.id} className="space-y-5">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-1 border-l-4 border-current">{group.label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {FILE_CONFIG.filter(c => c.group === group.id).map((config) => (
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
                ))}
              </div>
            </div>

            {/* 操作控制台 */}
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-xl flex gap-6 items-center">
              <button
                onClick={handleSubmit}
                disabled={!requiredFilesSelected || isSubmitting}
                className="flex-1 h-16 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 text-white rounded-2xl font-black text-xl transition-all flex justify-center items-center gap-4 shadow-xl active:scale-[0.98] group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin text-indigo-400" size={28} />
                    <span>处理中，请稍后...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} />
                    <span>立即开始搭建词库</span>
                  </>
                )}
              </button>
              
              {(taskStatus !== "idle" || selectedFilesCount > 0) && (
                <button
                  onClick={handleReset}
                  disabled={isSubmitting && taskStatus === "processing"}
                  className="w-16 h-16 flex items-center justify-center bg-white text-slate-400 rounded-2xl hover:text-red-600 transition-all border-2 border-slate-200 hover:border-red-200 disabled:opacity-20"
                  title="重置"
                >
                  <Trash2 size={28} />
                </button>
              )}
            </div>

            {/* 进度条 */}
            {taskStatus !== "idle" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-lg space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner">
                      <Loader2 className={taskStatus === 'processing' || taskStatus === 'uploading' ? "animate-spin" : ""} size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">执行管道任务</h3>
                      <p className="text-sm text-slate-500 font-bold">任务号: {taskId}</p>
                    </div>
                  </div>
                  <StatusBadge status={taskStatus} />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-black text-slate-500 uppercase">进度详情</span>
                    <span className="text-4xl font-mono text-slate-900 font-black">{taskProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-6 p-1.5 shadow-inner border border-slate-200">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                      style={{ width: `${taskProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-6 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
                    <div className="flex-1">
                      <p className="text-lg font-black text-red-700">系统错误</p>
                      <p className="text-base text-red-600/80 font-bold leading-relaxed">{errorMsg}</p>
                    </div>
                  </div>
                )}

                {taskStatus === "success" && taskId && (
                  <button
                    onClick={() => handleDownload(taskId)}
                    className="w-full bg-green-600 text-white h-20 rounded-2xl font-black text-2xl flex items-center justify-center gap-4 hover:bg-green-700 transition-all shadow-xl shadow-green-100 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Download size={32} />
                    <span>下载处理结果 (.xlsx)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 右侧历史 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <Clock className="text-slate-400" size={20} />
                <h2 className="text-lg font-black text-slate-900 tracking-tight">运行历史</h2>
              </div>
              
              <div className="p-6 space-y-5 max-h-[800px] overflow-y-auto">
                {tasks.length === 0 ? (
                  <div className="text-center py-20 text-slate-300">
                    <Clock size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">暂无历史记录</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskHistoryCard key={task.id} task={task} onDownload={handleDownload} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

function FileUploadCard({ config, state, onSelect, onClear, disabled }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('请上传 Excel 文件');
        return;
      }
      onSelect(file);
    }
  };

  const isSelected = !!state.file;

  return (
    <div 
      className={`group relative rounded-2xl p-6 transition-all duration-300 border-2 ${
        isSelected 
          ? 'border-indigo-600 bg-white shadow-md' 
          : 'border-slate-200 bg-white hover:border-indigo-300'
      } ${disabled ? 'opacity-40 grayscale' : 'cursor-pointer'}`}
    >
      {!isSelected && (
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      )}
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-indigo-600'
          }`}>
            {isSelected ? <CheckCircle size={24} /> : <Upload size={24} />}
          </div>
          {config.required && !isSelected && (
            <span className="text-[11px] font-black text-white bg-red-500 px-2 py-0.5 rounded shadow-sm">必填</span>
          )}
        </div>

        <div className="min-w-0">
          <p className={`text-lg font-black truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
            {config.label}
          </p>
          
          <div className="mt-1">
            {isSelected ? (
              <span className="text-sm text-indigo-600 font-black truncate block font-mono">{state.file!.name}</span>
            ) : (
              <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">点击上传</span>
            )}
          </div>
        </div>
        
        {isSelected && !disabled && (
          <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-600">
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    idle: { label: "就绪", color: "slate" },
    uploading: { label: "同步中", color: "blue" },
    processing: { label: "分析中", color: "amber" },
    success: { label: "已完成", color: "green" },
    failed: { label: "失败", color: "red" },
    pending: { label: "排队", color: "slate" },
  };
  const { label, color } = config[status] || config.pending;
  const colorMap: any = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-700 border-red-200"
  };
  return (
    <div className={`px-4 py-1.5 rounded-full border-2 font-black text-sm ${colorMap[color]}`}>
      {label}
    </div>
  );
}

function TaskHistoryCard({ task, onDownload }: any) {
  const status = task.status ?? "pending";
  const isSuccess = status === "success";
  const date = new Date(task.created_at).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`rounded-2xl p-5 border-2 transition-all ${isSuccess ? 'border-slate-100 hover:border-indigo-600 shadow-sm hover:shadow-md' : 'border-slate-50'}`}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-black text-slate-900 font-mono tracking-tighter">{date}</span>
        <StatusBadge status={status} />
      </div>
      {isSuccess ? (
        <button onClick={() => onDownload(task.id)} className="w-full h-12 bg-indigo-600 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-50 active:scale-95 transition-transform">
          <Download size={18} /> 下载报表
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div className="bg-indigo-600 h-full transition-all" style={{ width: `${task.progress}%` }} />
          </div>
          <span className="text-xs font-black text-slate-900 font-mono">{task.progress}%</span>
        </div>
      )}
    </div>
  );
}
