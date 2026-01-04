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

      const { error: filesError } = await supabase
        .from("keyword_task_files")
        .insert(fileRecords.map(r => ({ ...r, task_id: task.id })));

      if (filesError) {
        throw new Error(`保存文件记录失败: ${filesError.message}`);
      }

      setTaskProgress(30);
      setTaskStatus("processing");

      const response = await fetch("/api/keyword-tool/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: task.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "处理请求失败");
      }

      pollTaskStatus(task.id);

    } catch (error) {
      console.error("Submit error:", error);
      setErrorMsg(error instanceof Error ? error.message : "提交失败");
      setTaskStatus("failed");
      setIsSubmitting(false);
    }
  };

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
      alert("下载失败，请重试");
    }
  };

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
      {/* 顶部导航 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <a 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200/60 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">返回工作台</span>
            </a>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                易逊关键词库工具
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase">PRO</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Automation & Classification System</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end border-r border-slate-200 pr-6 mr-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Authorized Account</span>
              <span className="text-sm text-slate-700 font-bold">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 左侧：操作核心 */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 说明卡片 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Info size={20} />
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900">操作指引</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: "上传文件", text: "提供 14 个业务报表，系统会自动对数据进行交叉验证" },
                    { label: "智能分类", text: "AI 逻辑将自动处理关键词类别、相关性及流量权重" },
                    { label: "结果导出", text: "处理完成后可一键下载符合易逊标准的标准词库表" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter">Step {i+1} / {item.label}</p>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 文件上传核心区 */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-end bg-slate-50/30">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-1">数据源管理</h2>
                  <p className="text-sm text-slate-400 font-medium">请按需上传对应的 Excel 报表</p>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Selected</p>
                    <p className="text-lg font-mono text-slate-900 font-black">{selectedFilesCount} <span className="text-slate-300">/</span> {FILE_CONFIG.length}</p>
                  </div>
                  <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-700 ease-out" 
                      style={{ width: `${(selectedFilesCount / FILE_CONFIG.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-10">
                {[
                  { id: 'main', label: '核心反查报表', color: 'indigo', icon: <FileSpreadsheet size={16}/> },
                  { id: 'compete', label: '竞品分析数据', color: 'emerald', icon: <LayoutGrid size={16}/> },
                  { id: 'base', label: '逻辑配置基础', color: 'amber', icon: <Info size={16}/> }
                ].map(group => (
                  <div key={group.id} className="space-y-5">
                    <div className="flex items-center gap-2">
                      <span className={`text-${group.color}-600`}>{group.icon}</span>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{group.label}</h3>
                    </div>
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
            <div className="sticky bottom-8 z-40">
              <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex gap-5 items-center max-w-2xl mx-auto">
                <button
                  onClick={handleSubmit}
                  disabled={!requiredFilesSelected || isSubmitting}
                  className="flex-1 h-16 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 text-white rounded-2xl font-bold text-lg transition-all flex justify-center items-center gap-3 shadow-xl disabled:shadow-none active:scale-[0.98] group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin text-indigo-400" size={24} />
                      <span className="text-slate-100">处理逻辑中...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={22} className="group-hover:-translate-y-1 transition-transform" />
                      <span>开始搭建词库库</span>
                    </>
                  )}
                </button>
                
                {(taskStatus !== "idle" || selectedFilesCount > 0) && (
                  <button
                    onClick={handleReset}
                    disabled={isSubmitting && taskStatus === "processing"}
                    className="w-16 h-16 flex items-center justify-center bg-white text-slate-400 rounded-2xl hover:text-rose-500 hover:bg-rose-50 transition-all border border-slate-200 hover:border-rose-100 disabled:opacity-20 group"
                    title="清空已上传"
                  >
                    <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* 处理进度面板 */}
            {taskStatus !== "idle" && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                      <Loader2 className={taskStatus === 'processing' || taskStatus === 'uploading' ? "animate-spin" : ""} size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">执行管道就绪</h3>
                      <p className="text-sm text-slate-400 font-bold font-mono tracking-tight">UID: {taskId?.slice(0, 12)}</p>
                    </div>
                  </div>
                  <StatusBadge status={taskStatus} />
                </div>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Processing Progress</span>
                      <span className="text-3xl font-mono text-slate-900 font-black">{taskProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-5 p-1.5 shadow-inner">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.3)] relative"
                        style={{ width: `${taskProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-5">
                      <div className="p-2.5 bg-white rounded-xl text-rose-500 shadow-sm">
                        <AlertCircle size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-rose-600 mb-1">系统报告异常</p>
                        <p className="text-sm text-rose-500/80 leading-relaxed font-medium">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  {taskStatus === "success" && taskId && (
                    <button
                      onClick={() => handleDownload(taskId)}
                      className="w-full bg-indigo-600 text-white h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Download size={24} />
                      <span>立即下载标准化词库表</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 右侧：记录面板 */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-[120px] overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                    <Clock size={16} />
                  </div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">运行历史</h2>
                </div>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black tracking-tighter">LIVE</span>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {tasks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                      <Clock size={40} />
                    </div>
                    <p className="text-sm text-slate-400 font-bold tracking-tight">暂无历史执行记录</p>
                  </div>
                ) : (
                  <div className="space-y-5">
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
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to { background-position: 200% 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
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
      className={`group relative rounded-2xl p-5 transition-all duration-500 border ${
        isSelected 
          ? 'border-indigo-600 bg-white shadow-[0_10px_25px_rgba(79,70,229,0.1)]' 
          : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/50'
      } ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {!isSelected && (
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
      )}
      
      <div className="flex flex-col gap-4 relative z-0">
        <div className="flex justify-between items-start">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm ${
            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-500'
          }`}>
            {isSelected ? <CheckCircle size={20} /> : <Upload size={20} />}
          </div>
          {config.required && !isSelected && (
            <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 uppercase">Required</span>
          )}
        </div>

        <div className="min-w-0">
          <p className={`text-sm font-extrabold truncate mb-1 ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
            {config.label}
          </p>
          
          <div className="flex items-center gap-2">
            {isSelected ? (
              <>
                <span className="text-[10px] text-indigo-600 font-bold truncate max-w-[140px] font-mono">{state.file!.name}</span>
                {state.uploading && <Loader2 className="text-indigo-400 animate-spin" size={10} />}
              </>
            ) : (
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">点击或拖拽上传</span>
            )}
          </div>
        </div>
        
        {isSelected && !disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// 状态徽章组件
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    idle: { label: "Ready", color: "slate" },
    uploading: { label: "Syncing", color: "blue" },
    processing: { label: "Analyzing", color: "amber" },
    success: { label: "Verified", color: "emerald" },
    failed: { label: "Error", color: "rose" },
    pending: { label: "Queue", color: "slate" },
  };

  const { label, color } = config[status] || config.pending;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-${color}-100 bg-${color}-50 text-${color}-600`}>
      <div className={`w-2 h-2 rounded-full bg-${color}-500 ${status === 'processing' || status === 'uploading' ? 'animate-ping' : ''}`} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
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
  const isSuccess = status === "success";
  
  return (
    <div className={`group rounded-2xl p-6 transition-all duration-500 border bg-white ${
      isSuccess ? 'border-slate-100 hover:border-indigo-600 hover:shadow-[0_10px_30px_rgba(79,70,229,0.08)]' : 'border-slate-100'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
          <span className="text-xs font-black text-slate-900 font-mono tracking-tighter">{formatDate(task.created_at)}</span>
        </div>
        <StatusBadge status={status} />
      </div>
      
      {isSuccess && task.result_url ? (
        <button
          onClick={() => onDownload(task.id)}
          className="w-full h-12 bg-slate-50 hover:bg-indigo-600 text-slate-900 hover:text-white text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all border border-slate-200 group-hover:border-indigo-600 shadow-sm active:scale-95"
        >
          <Download size={14} />
          <span>Get Report</span>
          <ChevronRight size={12} className="opacity-50" />
        </button>
      ) : (
        <div className="space-y-3">
          {status === "failed" ? (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <p className="text-[10px] text-rose-500/80 font-bold leading-tight line-clamp-2 italic">{task.error_msg}</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500" 
                  style={{ width: `${task.progress ?? 0}%` }} 
                />
              </div>
              <span className="text-[10px] font-black text-slate-900 font-mono">{task.progress ?? 0}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
