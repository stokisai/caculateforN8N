"use client";

import { useMemo, useState, useCallback } from "react";
import { 
  LogOut, Upload, FileSpreadsheet, CheckCircle, Loader2, 
  Download, AlertCircle, X, ArrowLeft, Trash2, Info, LayoutGrid, Clock
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* 顶部导航 */}
      <header className="border-b border-slate-800/60 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/50 shadow-inner group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">返回工作台</span>
            </a>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                易逊跨境关键词词库搭建工具
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">AI-POWERED KEYWORD CLASSIFICATION</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500">当前账号</span>
              <span className="text-sm text-slate-300 font-medium">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
              title="退出登录"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 左侧：操作核心 */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 使用说明卡片 */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Info size={80} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Info size={20} />
                </div>
                <h2 className="text-lg font-bold text-white">快速上手指引</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <LayoutGrid className="text-amber-400" size={18} />, text: "上传 14 个 Excel 文件，系统将识别特定列名进行处理" },
                  { icon: <CheckCircle className="text-emerald-400" size={18} />, text: "自动完成：关键词类别、相关性、流量大小三维度标记" },
                  { icon: <Download className="text-blue-400" size={18} />, text: "处理完成后，可一键导出处理后的 H10 反查总表" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                    <div className="mt-0.5">{item.icon}</div>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 文件上传核心区 */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">数据源上传</h2>
                  <p className="text-sm text-slate-500">请按照分类上传对应的业务报表文件</p>
                </div>
                <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">已选进度</p>
                    <p className="text-sm font-mono text-indigo-400 font-bold">{selectedFilesCount} / {FILE_CONFIG.length}</p>
                  </div>
                  <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-500" 
                      style={{ width: `${(selectedFilesCount / FILE_CONFIG.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                {[
                  { id: 'main', label: '核心反查表', color: 'indigo' },
                  { id: 'compete', label: '竞品分析表 (可选)', color: 'emerald' },
                  { id: 'base', label: '配置基准表', color: 'amber' }
                ].map(group => (
                  <div key={group.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-1 h-4 rounded-full bg-${group.color}-500 shadow-[0_0_8px_rgba(var(--tw-color-${group.color}-500),0.5)]`} />
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{group.label}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
            <div className="sticky bottom-6 z-40">
              <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/5 p-4 rounded-2xl shadow-2xl flex gap-4 items-center">
                <button
                  onClick={handleSubmit}
                  disabled={!requiredFilesSelected || isSubmitting}
                  className="flex-1 h-14 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white rounded-xl font-bold text-lg disabled:opacity-30 disabled:grayscale transition-all flex justify-center items-center gap-3 shadow-[0_8px_32px_rgba(79,70,229,0.3)] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      <span>正在构建词库逻辑...</span>
                    </>
                  ) : (
                    <>
                      <div className="p-1.5 bg-white/20 rounded-lg">
                        <Upload size={20} />
                      </div>
                      <span>立即开始执行任务</span>
                    </>
                  )}
                </button>
                
                {(taskStatus !== "idle" || selectedFilesCount > 0) && (
                  <button
                    onClick={handleReset}
                    disabled={isSubmitting && taskStatus === "processing"}
                    className="w-14 h-14 flex items-center justify-center bg-slate-800 text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all border border-slate-700/50 hover:border-red-500/30 disabled:opacity-20 shadow-inner group"
                    title="清空所有上传"
                  >
                    <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* 实时执行面板 */}
            {taskStatus !== "idle" && (
              <div className="bg-[#1e293b]/60 border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Loader2 className={taskStatus === 'processing' || taskStatus === 'uploading' ? "animate-spin" : ""} size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">后台处理管道</h3>
                      <p className="text-xs text-slate-500">Task ID: {taskId?.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <StatusBadge status={taskStatus} />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400 font-medium">总体执行进度</span>
                      <span className="text-indigo-400 font-bold">{taskProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 rounded-full h-4 p-1 border border-white/5 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 bg-[length:200%_auto] animate-gradient h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4">
                      <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                        <AlertCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-400 mb-1">执行遇到错误</p>
                        <p className="text-xs text-red-300/80 leading-relaxed">{errorMsg}</p>
                      </div>
                    </div>
                  )}

                  {taskStatus === "success" && taskId && (
                    <button
                      onClick={() => handleDownload(taskId)}
                      className="w-full bg-emerald-500 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-[0_8px_24px_rgba(16,185,129,0.25)] hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <Download size={24} />
                      <span>下载处理后的 Excel 报表</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 右侧：记录面板 */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-md sticky top-[100px]">
              <div className="p-6 border-b border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                    <Clock size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white">最近任务</h2>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500 font-bold uppercase tracking-tighter">History</span>
              </div>
              
              <div className="p-6">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center text-slate-600 mb-4">
                      <Clock size={32} />
                    </div>
                    <p className="text-slate-500 text-sm">暂无运行记录</p>
                  </div>
                ) : (
                  <div className="space-y-4">
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
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
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
        alert('请上传 Excel 文件 (.xlsx 或 .xls)');
        return;
      }
      onSelect(file);
    }
  };

  const isSelected = !!state.file;

  return (
    <div 
      className={`group relative rounded-2xl p-4 transition-all duration-300 border ${
        isSelected 
          ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
          : 'border-slate-800 bg-slate-800/20 hover:border-slate-700 hover:bg-slate-800/40'
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
      
      <div className="flex items-center gap-4 relative z-0">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500 group-hover:text-slate-400'
        }`}>
          {isSelected ? <CheckCircle size={24} /> : <FileSpreadsheet size={24} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-sm font-bold truncate ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
              {config.label}
            </span>
            {config.required && !isSelected && (
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-tighter">REQ</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isSelected ? (
              <>
                <span className="text-[10px] text-emerald-500/80 font-medium truncate max-w-[120px]">{state.file!.name}</span>
                {state.uploading && <Loader2 className="text-indigo-400 animate-spin" size={12} />}
              </>
            ) : (
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:text-slate-400 transition-colors">
                等待上传文件
              </span>
            )}
          </div>
        </div>
        
        {isSelected && !disabled && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {state.error && (
        <div className="mt-2 flex items-center gap-1.5 text-red-400">
          <AlertCircle size={10} />
          <p className="text-[10px] font-bold">{state.error}</p>
        </div>
      )}
    </div>
  );
}

// 状态徽章组件
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; dot: string; bg: string; text: string }> = {
    idle: { label: "准备就绪", dot: "bg-slate-400", bg: "bg-slate-400/10", text: "text-slate-400" },
    uploading: { label: "同步文件中", dot: "bg-blue-400", bg: "bg-blue-400/10", text: "text-blue-400" },
    processing: { label: "计算逻辑中", dot: "bg-amber-400", bg: "bg-amber-400/10", text: "text-amber-400" },
    success: { label: "执行成功", dot: "bg-emerald-400", bg: "bg-emerald-400/10", text: "text-emerald-400" },
    failed: { label: "执行失败", dot: "bg-red-400", bg: "bg-red-400/10", text: "text-red-400" },
    pending: { label: "队列等待", dot: "bg-slate-500", bg: "bg-slate-500/10", text: "text-slate-500" },
  };

  const { label, dot, bg, text } = config[status] || config.pending;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-current/10 ${bg} ${text} transition-all duration-500`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dot} ${status === 'processing' || status === 'uploading' ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`} />
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
    <div className={`group rounded-xl p-4 transition-all duration-300 border ${
      isSuccess ? 'bg-slate-800/30 border-slate-800 hover:border-emerald-500/30' : 'bg-slate-900/40 border-slate-800'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tight">{formatDate(task.created_at)}</span>
        </div>
        <StatusBadge status={status} />
      </div>
      
      {isSuccess && task.result_url ? (
        <button
          onClick={() => onDownload(task.id)}
          className="w-full h-10 bg-slate-800 hover:bg-indigo-500 text-slate-300 hover:text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all border border-slate-700 group-hover:border-indigo-500/50 shadow-lg active:scale-95"
        >
          <Download size={14} />
          下载报表
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {status === "failed" && task.error_msg ? (
            <div className="flex items-start gap-2 p-2 bg-red-500/5 rounded-lg border border-red-500/10">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={10} />
              <p className="text-[10px] text-red-300/60 line-clamp-2 leading-tight">{task.error_msg}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600">
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500/50 h-full animate-pulse" 
                  style={{ width: `${task.progress ?? 0}%` }} 
                />
              </div>
              <span className="text-[10px] font-mono">{task.progress ?? 0}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
