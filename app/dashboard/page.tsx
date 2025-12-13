import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  // 👇 关键修改：一定要加 await ！！！
  const supabase = await createSupabaseServerClient();

  // 获取 Session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 没登录就踢回登录页
  if (!session) {
    redirect("/login");
  }

  // 获取服务列表
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  // 调试：显示从数据库获取的服务数据
  console.log("📦 从数据库获取的服务:", services?.map(s => ({ 
    title: s.title, 
    webhook_url: s.webhook_url 
  })));

  return (
    <DashboardClient
      services={services ?? []}
      user={session.user}
    />
  );
}