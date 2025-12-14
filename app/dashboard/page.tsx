import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DashboardClient from "./dashboard-client";

/**
 * ✅ 明确定义 Service 类型
 * 必须和 Supabase services 表字段一致
 */
type Service = {
  id: string;
  title: string;
  webhook_url: string;
  created_at: string;
};

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

  // ✅ 明确声明返回类型
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false }) as {
      data: Service[] | null;
    };

  // 调试日志（现在 TS 完全安全）
  console.log(
    "📦 从数据库获取的服务:",
    services?.map((s) => ({
      title: s.title,
      webhook_url: s.webhook_url,
    }))
  );

  return (
    <DashboardClient
      services={services ?? []}
      user={session.user}
    />
  );
}
