import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import KeywordToolClient from "./keyword-tool-client";

export default async function KeywordToolPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取用户最近的任务
  const { data: recentTasks } = await supabase
    .from("keyword_tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return <KeywordToolClient user={user} recentTasks={recentTasks || []} />;
}

