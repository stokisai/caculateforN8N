import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { KeywordTask } from "@/types/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const supabase = await createSupabaseServerClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 获取任务信息（验证归属和状态）
    const { data, error } = await supabase
      .from("keyword_tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "任务不存在或无权访问" }, { status: 404 });
    }

    const task = data as KeywordTask;

    if (task.status !== "success" || !task.result_url) {
      return NextResponse.json({ error: "结果文件尚未生成" }, { status: 400 });
    }

    // 从 Storage 下载文件
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("keyword-files")
      .download(task.result_url);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: "下载文件失败" }, { status: 500 });
    }

    // 返回文件
    const fileName = `关键词分类结果_${new Date().toISOString().slice(0, 10)}.xlsx`;
    
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    });

  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "下载失败" },
      { status: 500 }
    );
  }
}

