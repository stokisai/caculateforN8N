"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Service, Database } from "@/types/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";

type Props = {
  services: Service[];
  user: User;
};

export default function DashboardClient({ services, user }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [selected, setSelected] = useState<Service | null>(null);
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requiresText = selected?.input_type === "text" || selected?.input_type === "both";
  const requiresFile = selected?.input_type === "file" || selected?.input_type === "both";

  const resetModal = () => {
    setInputText("");
    setFile(null);
    setSelected(null);
    setOpen(false);
    setLoading(false);
    setError(null);
  };

  const onSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (requiresText && !inputText.trim()) {
        throw new Error("Please provide the required text input.");
      }
      if (requiresFile && !file) {
        throw new Error("Please attach the required file.");
      }

      let filePath: string | null = null;

      if (file) {
        const path = `${user.id}/${selected.id}/${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("task-files")
          .upload(path, file);

        if (uploadError) {
          throw uploadError;
        }
        filePath = data?.path ?? path;
      }

      const taskData = {
        user_id: user.id,
        service_id: selected.id,
        input_text: inputText || null,
        file_url: filePath,
        status: "pending",
      };

      const { data: task, error: insertError } = await (supabase
        .from("tasks")
        .insert(taskData as any) as any)
        .select()
        .single();

      if (insertError || !task) {
        throw insertError ?? new Error("Unable to create task.");
      }

      await fetch(selected.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: task.id,
          service_id: selected.id,
          user_id: user.id,
          input_text: inputText,
          file_url: filePath,
        }),
      });

      setSuccess("Task submitted and webhook triggered.");
      setInputText("");
      setFile(null);
      setTimeout(() => setOpen(false), 800);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Service Catalog
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">AI Agents Shelf</h1>
          <p className="text-sm text-slate-600">
            Browse services and dispatch tasks straight into n8n.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
            {user.email ?? user.phone}
          </div>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-40 w-full bg-slate-100">
                <Image
                  src={
                    service.image_url ||
                    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={service.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-700">
                    {service.input_type}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3">
                  {service.description}
                </p>
                <div className="mt-auto pt-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelected(service);
                      setOpen(true);
                      setError(null);
                      setSuccess(null);
                    }}
                  >
                    Use Agent
                  </Button>
                </div>
              </div>
            </article>
          ))}
          {services.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">
              No services yet. Add rows to the <code>services</code> table in Supabase.
            </div>
          )}
        </div>
      </main>

      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Submit task
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {selected.title}
                </h2>
                <p className="text-sm text-slate-600">{selected.description}</p>
              </div>
              <button
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                onClick={resetModal}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmitTask}>
              {requiresText && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Text Input
                  </label>
                  <Textarea
                    rows={4}
                    placeholder="Describe your task or paste keywords..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </div>
              )}

              {requiresFile && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Upload file (.csv, .xlsx, .txt)
                  </p>
                  <label className="mt-3 flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-400">
                    <div className="flex items-center gap-3">
                      <Upload className="h-4 w-4" />
                      <span>{file ? file.name : "Choose file"}</span>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.txt"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setFile(f ?? null);
                      }}
                    />
                  </label>
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={resetModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit & Trigger"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

