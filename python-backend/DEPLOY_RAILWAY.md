# Railway 部署指南

## 📋 部署步骤

### 方法 1：通过 GitHub 部署（推荐）

#### 步骤 1：提交代码到 Git

```bash
# 在项目根目录
cd python-backend

# 检查 Git 状态
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "修复文件名编码问题，支持中文文件名"

# 推送到 GitHub
git push origin main
```

#### 步骤 2：在 Railway 中部署

1. **登录 Railway**
   - 访问 https://railway.app
   - 使用 GitHub 账号登录

2. **选择项目**
   - 找到你的 FastAPI 项目（`caculateforn8n-production`）
   - 点击进入项目

3. **触发重新部署**
   - 如果项目已连接 GitHub，Railway 会自动检测到新的提交
   - 在 "Deployments" 标签页，点击 "Redeploy" 或等待自动部署
   - 或者点击 "Settings" -> "Source" -> "Redeploy"

4. **查看部署日志**
   - 在 "Deployments" 标签页查看部署进度
   - 确认部署成功（状态变为 "Success"）

---

### 方法 2：通过 Railway CLI 部署

#### 步骤 1：安装 Railway CLI

```bash
# Windows (使用 PowerShell)
iwr https://railway.app/install.ps1 | iex

# 或者使用 npm
npm i -g @railway/cli
```

#### 步骤 2：登录 Railway

```bash
railway login
```

#### 步骤 3：部署

```bash
# 进入 python-backend 目录
cd python-backend

# 初始化 Railway 项目（如果还没有）
railway init

# 部署
railway up
```

---

### 方法 3：直接上传文件（如果使用 Railway Dashboard）

1. **进入项目设置**
   - 在 Railway 项目页面，点击 "Settings"
   - 找到 "Source" 部分

2. **上传文件**
   - 如果使用文件上传方式，需要上传以下文件：
     - `main.py`
     - `requirements.txt`
     - `Procfile`
     - `runtime.txt`（可选）

3. **触发部署**
   - Railway 会自动检测文件更改并重新部署

---

## 🔧 环境变量配置

确保在 Railway 项目中设置了以下环境变量：

1. **进入项目设置**
   - 在 Railway 项目页面，点击 "Variables" 标签页

2. **添加环境变量**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-role-key
   ```

3. **保存更改**
   - 添加环境变量后，Railway 会自动重新部署

---

## ✅ 验证部署

### 1. 检查服务状态

访问你的 Railway 项目 URL：
```
https://caculateforn8n-production.up.railway.app
```

应该看到：
```json
{
  "status": "running",
  "message": "Python Backend is Running!",
  "endpoints": {
    "/process": "处理 Excel 文件",
    "/webhook/{path}": "Webhook 接口（兼容 n8n）",
    "/docs": "API 文档"
  }
}
```

### 2. 检查健康状态

访问：
```
https://caculateforn8n-production.up.railway.app/health
```

应该看到：
```json
{
  "status": "healthy",
  "supabase_connected": true
}
```

### 3. 查看 API 文档

访问：
```
https://caculateforn8n-production.up.railway.app/docs
```

应该看到 Swagger UI 文档页面。

---

## 🐛 故障排查

### 部署失败

1. **查看部署日志**
   - 在 Railway 项目的 "Deployments" 标签页
   - 点击失败的部署，查看详细日志

2. **常见问题**
   - **依赖安装失败**：检查 `requirements.txt` 是否正确
   - **端口错误**：确保 `Procfile` 中使用 `$PORT` 环境变量
   - **环境变量缺失**：检查是否设置了 `SUPABASE_URL` 和 `SUPABASE_KEY`

### 服务无法访问

1. **检查 Public Networking**
   - 在 Railway 项目设置中，确保启用了 "Public Networking"
   - 生成了公共域名

2. **检查服务状态**
   - 在 Railway Dashboard 中查看服务是否正在运行
   - 检查 CPU 和内存使用情况

---

## 📝 部署后检查清单

- [ ] 代码已提交到 Git
- [ ] Railway 项目已连接 GitHub 仓库
- [ ] 环境变量已正确设置
- [ ] 部署状态为 "Success"
- [ ] 服务可以正常访问（/health 返回 healthy）
- [ ] API 文档可以访问（/docs）
- [ ] 前端可以成功调用 /process 接口

---

## 🚀 快速部署命令（如果使用 Git）

```bash
# 在项目根目录执行
cd python-backend
git add .
git commit -m "修复编码问题"
git push origin main

# Railway 会自动检测并部署
```

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Railway 部署日志
2. 检查环境变量配置
3. 确认代码已正确提交到 Git
4. 查看 Railway 官方文档：https://docs.railway.app


















