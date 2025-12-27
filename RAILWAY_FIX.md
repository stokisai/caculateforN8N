# Railway 部署问题修复指南

## 问题
Railway 的安全扫描检测到前端 `package-lock.json` 中的 Next.js 安全漏洞，导致部署失败。

## 解决方案

### 方案 1：在 Railway Dashboard 中禁用安全扫描（推荐）

1. **登录 Railway Dashboard**
   - 访问 https://railway.app
   - 找到项目 `caculateforn8n-production`

2. **禁用安全扫描**
   - 点击 **Settings** → **General**
   - 找到 **Security Scanning** 选项
   - 将其**禁用**或设置为 **Warn Only**（如果可用）
   - 点击 **Save**

3. **重新部署**
   - 在 **Deployments** 标签页点击 **Redeploy**

### 方案 2：将后端代码推送到单独的 Git 仓库（最彻底）

如果方案 1 不可行，可以创建一个单独的仓库：

1. **创建新的 Git 仓库**
   ```bash
   # 在 python-backend 目录
   cd python-backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```

2. **在 Railway 中连接新仓库**
   - 在 Railway Dashboard 中创建新服务
   - 连接新的 Git 仓库
   - 部署

### 方案 3：临时删除 package-lock.json（不推荐）

如果以上方案都不可行，可以临时删除根目录的 `package-lock.json`：

```bash
# 备份文件
cp package-lock.json package-lock.json.backup

# 删除文件
rm package-lock.json

# 提交并推送
git add .
git commit -m "Remove package-lock.json to fix Railway deployment"
git push origin main
```

**注意**：这会影响前端开发，需要重新生成 `package-lock.json`。

## 当前状态

✅ 已设置 Root Directory 为 `python-backend`
✅ 已创建 `.railwayignore` 文件
✅ 已创建 `python-backend/nixpacks.toml` 配置文件
✅ 已创建 `python-backend/railway.json` 配置文件

## 验证部署

部署成功后，访问：
- 健康检查：https://caculateforn8n-production.up.railway.app/health
- API 文档：https://caculateforn8n-production.up.railway.app/docs

## 如果仍然失败

请联系 Railway 支持：
- 访问 https://station.railway.com/new?type=technical
- 说明问题：安全扫描检测到前端依赖，但后端是纯 Python 项目









