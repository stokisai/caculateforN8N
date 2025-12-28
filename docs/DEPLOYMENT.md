# 部署指南 - Vercel + GitHub

## 📋 部署步骤概览

1. ✅ 将代码推送到 GitHub
2. ✅ 在 Vercel 上连接 GitHub 仓库
3. ✅ 配置环境变量
4. ✅ 自动部署完成

---

## 第一步：准备 GitHub 仓库

### 1.1 初始化 Git（如果还没有）

```bash
git init
```

### 1.2 添加所有文件到 Git

```bash
git add .
```

### 1.3 提交代码

```bash
git commit -m "Initial commit: Next.js SaaS app"
```

### 1.4 在 GitHub 上创建新仓库

1. 访问 https://github.com/new
2. 输入仓库名称（例如：`n8n-saas-app`）
3. **不要**勾选 "Initialize with README"（因为本地已有代码）
4. 点击 "Create repository"

### 1.5 连接本地仓库到 GitHub

```bash
# 替换 YOUR_USERNAME 和 YOUR_REPO_NAME 为你的实际信息
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 第二步：在 Vercel 上部署

### 2.1 注册/登录 Vercel

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录（推荐，方便后续自动部署）

### 2.2 导入项目

1. 点击 "Add New..." → "Project"
2. 从 GitHub 仓库列表中选择你的项目
3. 点击 "Import"

### 2.3 配置项目设置

Vercel 会自动检测 Next.js 项目，通常不需要修改：
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（自动）
- **Output Directory**: `.next`（自动）

### 2.4 配置环境变量 ⚠️ 重要！

在部署前，必须添加环境变量：

1. 在项目设置中找到 "Environment Variables"
2. 添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

**如何获取这些值：**
- 登录 Supabase Dashboard
- 进入你的项目
- 点击 Settings → API
- 复制 "Project URL" 和 "anon public" 密钥

### 2.5 部署

点击 "Deploy" 按钮，Vercel 会自动：
1. 从 GitHub 拉取代码
2. 安装依赖 (`npm install`)
3. 构建项目 (`npm run build`)
4. 部署到全球 CDN

---

## 第三步：访问你的网站

部署完成后，Vercel 会提供一个 URL，例如：
- `https://your-project-name.vercel.app`

每次你推送代码到 GitHub 的 `main` 分支，Vercel 会自动重新部署！

---

## 🔄 后续更新代码流程

1. 修改代码
2. 提交更改：
   ```bash
   git add .
   git commit -m "描述你的更改"
   git push
   ```
3. Vercel 自动检测并重新部署（通常 1-2 分钟）

---

## 📝 注意事项

### ✅ 不需要手动打包
- Next.js 项目**不需要**手动打包
- Vercel 会自动运行 `npm run build` 进行构建
- 构建产物会自动部署，无需手动操作

### ✅ 环境变量安全
- `.env.local` 文件已经在 `.gitignore` 中，不会被推送到 GitHub
- 敏感信息（如 API 密钥）只在 Vercel 的环境变量中配置

### ✅ 免费额度
- Vercel 免费版提供：
  - 无限个人项目
  - 100GB 带宽/月
  - 自动 HTTPS
  - 全球 CDN

### ⚠️ Supabase 配置
- 确保 Supabase 项目的 RLS（Row Level Security）策略允许从你的 Vercel 域名访问
- 如果使用自定义域名，需要在 Supabase 中配置允许的域名

---

## 🆘 常见问题

### Q: 部署后出现环境变量错误？
A: 检查 Vercel 项目设置中的环境变量是否正确配置

### Q: 如何查看部署日志？
A: 在 Vercel 项目页面点击 "Deployments" → 选择部署 → 查看 "Build Logs"

### Q: 如何回滚到之前的版本？
A: 在 Vercel 的 "Deployments" 页面，找到之前的部署，点击 "..." → "Promote to Production"

### Q: 可以使用自定义域名吗？
A: 可以！在 Vercel 项目设置 → "Domains" 中添加你的域名

---

## 🎉 完成！

部署完成后，你的应用就可以在公网上访问了！

