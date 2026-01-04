import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Railway FastAPI 后端地址（从环境变量读取）
const FASTAPI_URL = process.env.FASTAPI_URL || "https://your-railway-app.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 验证用户登录状态
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 获取请求体
    const body = await request.json();
    const { task_id } = body;

    if (!task_id) {
      return NextResponse.json({ error: "缺少 task_id" }, { status: 400 });
    }

    // 验证任务归属
    const { data: task, error: taskError } = await supabase
      .from("keyword_tasks")
      .select("*")
      .eq("id", task_id)
      .eq("user_id", user.id)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: "任务不存在或无权访问" }, { status: 404 });
    }

    // 调用 Railway FastAPI 后端处理
    const formData = new FormData();
    formData.append("task_id", task_id);

    const response = await fetch(`${FASTAPI_URL}/api/keyword-tool/process`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI error:", errorText);
      return NextResponse.json(
        { error: `后端处理失败: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Keyword tool process error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "处理失败" },
      { status: 500 }
    );
  }
}
