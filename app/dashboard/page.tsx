import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DashboardClient from "./dashboard-client";
import type { Service } from "@/types/supabase";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  const typedServices: Service[] = (services ?? []) as Service[];

  return <DashboardClient services={typedServices} user={session.user} />;
}
