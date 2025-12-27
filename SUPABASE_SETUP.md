# 🔒 Supabase RLS Policy 设置指南

## 📋 问题说明

你的应用需要为 `tasks` 表设置 Row Level Security (RLS) 策略，确保：
- ✅ 用户只能查看自己的任务
- ✅ 用户只能创建自己的任务
- 🔒 保护数据安全，防止用户访问其他用户的数据

## 🚀 快速设置步骤

### 方法一：使用 SQL 编辑器（推荐）

1. **登录 Supabase Dashboard**
   - 访问 https://app.supabase.com
   - 选择你的项目

2. **打开 SQL 编辑器**
   - 点击左侧菜单的 **"SQL Editor"**
   - 点击 **"New query"**

3. **执行 SQL 脚本**
   - 打开项目中的 `supabase_rls_policies.sql` 文件
   - 复制全部内容
   - 粘贴到 SQL 编辑器中
   - 点击 **"Run"** 或按 `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **验证设置**
   - 在 SQL 编辑器中运行：
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'tasks';
   ```
   - 应该看到 2 条策略：
     - `Users can view their own tasks` (SELECT)
     - `Users can insert their own tasks` (INSERT)

### 方法二：使用 Supabase Dashboard UI

1. **进入 Database → Policies**
   - 在左侧菜单点击 **"Database"**
   - 点击 **"Policies"** 标签
   - 找到 `tasks` 表

2. **确认 RLS 已启用**
   - 在 `tasks` 表旁边，确保 **"RLS"** 开关是 **ON**（绿色）
   - 如果未启用，点击开关启用

3. **创建 SELECT 策略**
   - 点击 `tasks` 表下的 **"New Policy"**
   - 选择 **"Create a policy from scratch"**
   - 设置：
     - **Policy name**: `Users can view their own tasks`
     - **Allowed operation**: `SELECT`
     - **Target roles**: `authenticated`
     - **USING expression**: `auth.uid() = user_id`
   - 点击 **"Review"** → **"Save policy"**

4. **创建 INSERT 策略**
   - 再次点击 **"New Policy"**
   - 选择 **"Create a policy from scratch"**
   - 设置：
     - **Policy name**: `Users can insert their own tasks`
     - **Allowed operation**: `INSERT`
     - **Target roles**: `authenticated`
     - **WITH CHECK expression**: `auth.uid() = user_id`
   - 点击 **"Review"** → **"Save policy"**

## ✅ 验证设置

### 测试 RLS 是否工作

1. **在 SQL 编辑器中测试**（使用你的用户 ID）：
   ```sql
   -- 查看当前用户 ID
   SELECT auth.uid();
   
   -- 尝试查看所有任务（应该只看到自己的）
   SELECT * FROM public.tasks;
   ```

2. **在前端测试**
   - 登录你的应用
   - 创建一个任务
   - 确认任务能正常创建和显示

## 🔍 图片显示问题排查

### 问题：图片有 URL 但看不到

#### ✅ 已完成的配置

你的 `next.config.ts` 已经正确配置了：
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ],
}
```

#### 🔧 如果图片仍然不显示，检查以下几点：

1. **检查图片 URL 是否有效**
   - 在浏览器中直接访问图片 URL
   - 例如：`https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=80`

2. **检查 Next.js Image 组件使用**
   - 确认使用的是 `next/image` 而不是 `<img>`
   - 检查 `alt` 属性是否正确设置

3. **检查控制台错误**
   - 打开浏览器开发者工具（F12）
   - 查看 Console 标签是否有错误信息
   - 查看 Network 标签，检查图片请求是否成功

4. **检查服务数据**
   - 确认 `services` 表中的 `image_url` 字段有值
   - 可以在 Supabase Dashboard → Table Editor → services 中查看

## 📝 常见问题

### Q: 设置 RLS 后，用户无法创建任务？
A: 检查 INSERT 策略是否正确设置，确保 `WITH CHECK` 表达式是 `auth.uid() = user_id`

### Q: 用户看不到任何任务？
A: 检查 SELECT 策略，确保 `USING` 表达式是 `auth.uid() = user_id`，并且用户已正确登录

### Q: 如何临时禁用 RLS 进行测试？
A: 在 SQL 编辑器中运行：
```sql
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
```
⚠️ **注意**：测试完成后记得重新启用！

## 🎯 完成后的检查清单

- [ ] RLS 已启用（Database → Tables → tasks → RLS 开关为 ON）
- [ ] SELECT 策略已创建（用户只能查看自己的任务）
- [ ] INSERT 策略已创建（用户只能创建自己的任务）
- [ ] 在前端测试创建任务成功
- [ ] 在前端测试查看任务成功
- [ ] 图片能正常显示

## 🔗 相关文件

- `supabase_rls_policies.sql` - RLS 策略 SQL 脚本
- `supabase_schema.sql` - 完整的数据库 schema（包含基础 RLS 设置）
- `next.config.ts` - Next.js 图片配置









