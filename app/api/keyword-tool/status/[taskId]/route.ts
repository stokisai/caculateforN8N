import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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

    // 获取任务状态（验证归属）
    const { data: task, error } = await supabase
      .from("keyword_tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", user.id)
      .single();

    if (error || !task) {
      return NextResponse.json({ error: "任务不存在或无权访问" }, { status: 404 });
    }

    return NextResponse.json(task);

  } catch (error) {
    console.error("Get task status error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "获取状态失败" },
      { status: 500 }
    );
  }
}

