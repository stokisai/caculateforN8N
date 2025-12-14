-- ============================================
-- Supabase RLS Policies 设置脚本
-- ============================================
-- 这个脚本用于为 tasks 表设置 Row Level Security (RLS) 策略
-- 确保用户只能访问自己的任务数据
-- ============================================

-- 1. 确保 RLS 已启用
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 2. 删除可能存在的旧策略（如果存在）
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Tasks are readable by owner" ON public.tasks;
DROP POLICY IF EXISTS "Tasks are insertable by owner" ON public.tasks;

-- 3. 创建 SELECT 策略：用户只能查看自己的任务
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. 创建 INSERT 策略：用户只能插入自己的任务
CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 5. 可选：如果需要更新和删除功能，可以添加以下策略
-- CREATE POLICY "Users can update their own tasks"
-- ON public.tasks
-- FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can delete their own tasks"
-- ON public.tasks
-- FOR DELETE
-- TO authenticated
-- USING (auth.uid() = user_id);

-- ============================================
-- 验证策略是否创建成功
-- ============================================
-- 运行以下查询来验证：
-- SELECT * FROM pg_policies WHERE tablename = 'tasks';

