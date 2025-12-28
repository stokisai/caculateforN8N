# Railway 部署配置指南

## ⚠️ 重要：设置 Root Directory

Railway 默认会尝试构建整个项目（包括前端），但后端只需要 `python-backend` 目录。

### 解决方法：在 Railway Dashboard 中设置 Root Directory

1. **登录 Railway Dashboard**
   - 访问 https://railway.app
   - 找到你的项目 `caculateforn8n-production`

2. **设置 Root Directory**
   - 点击项目 → **Settings** → **Source**
   - 找到 **Root Directory** 设置
   - 设置为：`python-backend`
   - 点击 **Save**

3. **重新部署**
   - 在 **Deployments** 标签页
   - 点击 **Redeploy** 或等待自动部署

## ✅ 验证部署

部署成功后，访问：
- 健康检查：https://caculateforn8n-production.up.railway.app/health
- API 文档：https://caculateforn8n-production.up.railway.app/docs

## 🔧 如果 Root Directory 设置不生效

如果设置 Root Directory 后仍然报错，可以尝试：

1. **删除并重新创建服务**
   - 在 Railway Dashboard 中删除当前服务
   - 创建新服务，连接同一个 GitHub 仓库
   - 在创建时设置 Root Directory 为 `python-backend`

2. **或者使用单独的 Git 仓库**
   - 将 `python-backend` 目录推送到单独的 Git 仓库
   - 在 Railway 中连接这个新仓库

## 📝 环境变量

确保在 Railway Dashboard → Settings → Variables 中设置了以下环境变量：

- `SERP_API_KEY` - SERP API 密钥
- `OPENROUTER_API_KEY` - OpenRouter API 密钥
- `GEMINI_API_KEY` - Gemini API 密钥
- `SUPABASE_URL` - Supabase 项目 URL（可选）
- `SUPABASE_KEY` - Supabase Service Role Key（可选）











