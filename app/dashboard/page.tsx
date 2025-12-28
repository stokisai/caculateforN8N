import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DashboardClient from "./dashboard-client";
import type { Service } from "@/types/supabase";

export default async function DashboardPage() {
  // 👇 必须 await
  const supabase = await createSupabaseServerClient();

  // 获取 Session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 未登录直接跳转
  if (!session) {
    redirect("/login");
  }

  // 查询所有服务
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  // 类型断言：确保 services 是正确的类型
  const typedServices: Service[] = (services ?? []) as Service[];

  // 调试日志
  console.log(
    "📦 从数据库获取的服务:",
    typedServices.map((s) => ({
      title: s.title,
      webhook_url: s.webhook_url,
    }))
  );

  return (
    <DashboardClient
      services={typedServices}
      user={session.user}
    />
  );
}
