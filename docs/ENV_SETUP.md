# 环境变量配置指南

## Vercel 前端环境变量

在 Vercel 项目设置中添加以下环境变量：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Railway FastAPI 后端地址
FASTAPI_URL=https://your-railway-app.up.railway.app
```

## Railway 后端环境变量

在 Railway 项目设置中添加以下环境变量：

```bash
# Supabase 配置 (使用 service_role key)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 其他可选 API 密钥
SERP_API_KEY=your-serp-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

## Supabase 配置

1. 在 Supabase 项目中执行 `sql/keyword_tool_schema.sql` 创建必要的表
2. 确保 Storage Bucket `keyword-files` 已创建
3. 配置 RLS 策略以保护数据安全

## 获取配置值

- **NEXT_PUBLIC_SUPABASE_URL**: Supabase 项目 Settings → API → Project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase 项目 Settings → API → anon public
- **SUPABASE_KEY (service_role)**: Supabase 项目 Settings → API → service_role (保密)
- **FASTAPI_URL**: Railway 部署后的公开 URL

