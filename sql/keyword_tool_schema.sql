-- =============================================
-- 易逊跨境关键词词库搭建工具 - 数据库 Schema
-- =============================================

-- 关键词任务表
create table if not exists public.keyword_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'processing', 'success', 'failed')),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  result_url text,
  error_msg text,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

-- 关键词任务文件表 (14个文件)
create table if not exists public.keyword_task_files (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.keyword_tasks(id) on delete cascade,
  file_type text not null check (file_type in (
    'h10_main',           -- H10反查总表（主表）
    'self_asin',          -- 自身ASIN反查
    'competitor_aba',     -- 竞对ABA热搜词反查
    'competitor_1',       -- 竞品1
    'competitor_2',       -- 竞品2
    'competitor_3',       -- 竞品3
    'competitor_4',       -- 竞品4
    'competitor_5',       -- 竞品5
    'competitor_6',       -- 竞品6
    'competitor_7',       -- 竞品7
    'competitor_8',       -- 竞品8
    'competitor_9',       -- 竞品9
    'competitor_10',      -- 竞品10
    'keyword_base'        -- 拓词基础表
  )),
  file_name text not null,
  storage_path text not null,
  file_size bigint,
  created_at timestamptz default timezone('utc', now()) not null
);

-- 索引
create index if not exists idx_keyword_tasks_user_id on public.keyword_tasks(user_id);
create index if not exists idx_keyword_tasks_status on public.keyword_tasks(status);
create index if not exists idx_keyword_task_files_task_id on public.keyword_task_files(task_id);

-- 更新 updated_at 触发器
create or replace function public.set_keyword_task_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_keyword_tasks_updated_at on public.keyword_tasks;
create trigger set_keyword_tasks_updated_at
before update on public.keyword_tasks
for each row execute procedure public.set_keyword_task_updated_at();

-- RLS
alter table public.keyword_tasks enable row level security;
alter table public.keyword_task_files enable row level security;

-- Policies for keyword_tasks
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'keyword_tasks' and policyname = 'Keyword tasks are readable by owner') then
    create policy "Keyword tasks are readable by owner" on public.keyword_tasks
      for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'keyword_tasks' and policyname = 'Keyword tasks are insertable by owner') then
    create policy "Keyword tasks are insertable by owner" on public.keyword_tasks
      for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'keyword_tasks' and policyname = 'Keyword tasks are updatable by owner') then
    create policy "Keyword tasks are updatable by owner" on public.keyword_tasks
      for update using (auth.uid() = user_id);
  end if;
end $$;

-- Policies for keyword_task_files (通过 task_id 关联检查)
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'keyword_task_files' and policyname = 'Keyword task files are readable by task owner') then
    create policy "Keyword task files are readable by task owner" on public.keyword_task_files
      for select using (
        exists (
          select 1 from public.keyword_tasks kt 
          where kt.id = task_id and kt.user_id = auth.uid()
        )
      );
  end if;
  if not exists (select 1 from pg_policies where tablename = 'keyword_task_files' and policyname = 'Keyword task files are insertable by task owner') then
    create policy "Keyword task files are insertable by task owner" on public.keyword_task_files
      for insert with check (
        exists (
          select 1 from public.keyword_tasks kt 
          where kt.id = task_id and kt.user_id = auth.uid()
        )
      );
  end if;
end $$;

-- Storage bucket for keyword tool files
insert into storage.buckets (id, name, public)
values ('keyword-files', 'keyword-files', false)
on conflict (id) do nothing;

-- Storage policies for keyword-files bucket
do $$
begin
  if not exists (
    select 1
    from storage.policies p
    join storage.buckets b on b.id = p.bucket_id
    where p.name = 'Allow authenticated uploads to keyword-files'
      and b.id = 'keyword-files'
  ) then
    create policy "Allow authenticated uploads to keyword-files"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'keyword-files');
  end if;

  if not exists (
    select 1
    from storage.policies p
    join storage.buckets b on b.id = p.bucket_id
    where p.name = 'Allow authenticated reads from keyword-files'
      and b.id = 'keyword-files'
  ) then
    create policy "Allow authenticated reads from keyword-files"
      on storage.objects for select
      to authenticated
      using (bucket_id = 'keyword-files');
  end if;
end $$;

-- 添加关键词工具服务到 services 表
insert into public.services (id, title, description, image_url, webhook_url, input_type)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '关键词词库搭建工具',
  '上传14个Excel文件，自动对关键词进行分类标记（关键词类别、相关性分类、流量大小分类）',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  '/api/keyword-tool',
  'file'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  webhook_url = excluded.webhook_url,
  input_type = excluded.input_type;

