# Excel Processing Backend

基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```



基于 FastAPI 的 Excel 文件处理后端服务。

## 功能特性

- ✅ 支持 Excel 文件（.xlsx, .xls）直接处理
- ✅ 支持 ZIP 压缩包（自动解压并查找 Excel 文件）
- ✅ 根据不同的服务ID执行不同的业务逻辑
- ✅ 兼容 n8n webhook 格式
- ✅ 直接返回处理后的 Excel 文件供下载
- ✅ CORS 支持，前端可直接调用

## 部署到 Railway

### 1. 准备 GitHub 仓库

1. 在 GitHub 创建新仓库
2. 将以下文件推送到仓库：
   - `requirements.txt`
   - `main.py`
   - `Procfile`

### 2. 在 Railway 部署

1. 登录 Railway
2. 点击 "New Project" -> "GitHub Repository"
3. 选择你的仓库
4. 点击 "Deploy Now"

### 3. 设置环境变量

在 Railway 项目页面 -> Variables 标签页，添加以下环境变量：

**必需的环境变量：**

```
# Supabase 配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务 API 密钥（必需）
SERP_API_KEY=your-serpapi-key
OPENROUTER_API_KEY=your-openrouter-key

# Gemini API（可选，用于图片生成）
GEMINI_API_KEY=your-gemini-key
```

**重要提示：**

1. **SERP_API_KEY**: 
   - 获取地址: https://serpapi.com/dashboard
   - 用于搜索市场数据和趋势信息
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）

2. **OPENROUTER_API_KEY**:
   - 获取地址: https://openrouter.ai/keys
   - 用于 LLM 生成报告内容
   - ⚠️ 不要使用占位符值（如 `__n8n_BLANK_VALUE_`）
   - 确保账户有足够的余额

3. **验证配置**:
   - 部署后查看后端日志，确认 API 密钥已正确加载
   - 如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换为真实密钥

### 4. 获取部署地址

部署完成后，在 Settings -> Public Networking 中生成域名。

## API 接口

### POST /process

处理 Excel 文件

**请求格式：**
- Content-Type: `multipart/form-data`
- 参数：
  - `file`: 文件（必需）
  - `service_id`: 服务ID（可选）
  - `input_text`: 文本输入（可选）

**响应：**
- 直接返回 Excel 文件流，浏览器自动下载

### POST /webhook/{path}

兼容 n8n webhook 格式

**路径映射：**
- `/webhook/h10` -> Ex大名) 服务
- `/webhook/test-hook` -> 筛选核心关键词 服务
- `/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16` -> 计算投产比 服务

### GET /docs

查看 Swagger API 文档

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SUPABASE_URL=your-url
export SUPABASE_KEY=your-key

# 运行
uvicorn main:app --reload
```

## 与前端集成

前端代码无需修改，只需要更新 webhook_url：

```typescript
// 原来的 n8n URL
webhook_url: "https://primary-production-6672d.up.railway.app/webhook/h10-process"

// 新的 Python 后端 URL
webhook_url: "https://your-python-backend.up.railway.app/webhook/h10"
```


