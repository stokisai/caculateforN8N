# Railway 环境变量配置指南

## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志






## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志





## 🔑 必需的环境变量

请在 Railway 项目设置中添加以下环境变量：

### 1. Supabase 配置（如果使用）

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

### 2. 社媒选品法服务 API 密钥（必需）

#### SERP_API_KEY
```
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

#### OPENROUTER_API_KEY
```
OPENROUTER_API_KEY=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
```

### 3. Gemini API（可选，用于图片生成）

```
GEMINI_API_KEY=your-gemini-key
```

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 点击 **New Variable** 按钮
5. 输入变量名和值：
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
6. 重复步骤 4-5 添加 `SERP_API_KEY`
7. Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录
railway login

# 设置环境变量
railway variables set OPENROUTER_API_KEY=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
railway variables set SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明配置有问题：**
```
❌ 错误: OPENROUTER_API_KEY 未设置！
❌ 错误: OPENROUTER_API_KEY 是占位符值！
```

## 🔍 测试 API 密钥

### 测试 OpenRouter API

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-chat-v3-0324",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 测试 SerpAPI

```bash
curl "https://serpapi.com/search?q=blanket&api_key=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40"
```

## ⚠️ 安全提示

1. **不要将 API 密钥提交到 Git 仓库**
2. **使用环境变量而不是硬编码**
3. **定期轮换 API 密钥**
4. **限制 API 密钥的权限范围**

## 📞 故障排除

如果遇到问题：

1. **检查环境变量名称是否正确**（区分大小写）
2. **确认没有多余的空格**
3. **查看 Railway 日志获取详细错误信息**
4. **验证 API 密钥是否有效**（使用上面的测试命令）

## 🎯 下一步

配置完成后：

1. 等待 Railway 重新部署（通常 1-2 分钟）
2. 提交一个测试任务
3. 检查报告是否包含完整内容
4. 如果仍有问题，查看 Railway 日志








