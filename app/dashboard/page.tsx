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

  // 确保“亚马逊顶级 Listing 专家”服务存在（若 Supabase 缺这条记录则插入一个前端兜底）
  const listingServiceId = "b9f2b13e-2f4b-4a62-8b0e-d2f74d824230";
  const hasListingService = typedServices.some((s) => s.id === listingServiceId);
  const mergedServices = hasListingService
    ? typedServices
    : [
        ...typedServices,
        {
          id: listingServiceId,
          title: "亚马逊顶级 Listing 专家 (GEO & COSMO 增强版)",
          description:
            "AI 生成高转化 Amazon Listing 文案，提交产品要点/需求即可获得示例草稿。",
          image_url: "/images/listing-expert.svg",
          webhook_url: "https://caculateforn8n-production.up.railway.app/process",
          input_type: "text",
          created_at: new Date().toISOString(),
        } as Service,
      ];

  // 调试日志
  console.log(
    "📦 从数据库获取的服务:",
    mergedServices.map((s) => ({
      title: s.title,
      webhook_url: s.webhook_url,
    }))
  );

  return (
    <DashboardClient
      services={mergedServices}
      user={session.user}
    />
  );
}
