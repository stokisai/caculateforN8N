# Supabase 配置指南（可选）

## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息






## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息





## 📋 概述

Supabase 配置是**可选的**。当前"社媒选品法"服务可以在没有 Supabase 的情况下运行，任务会存储在内存中。

**但是，建议配置 Supabase 以获得：**
- ✅ 任务持久化存储（重启后不丢失）
- ✅ 任务历史记录
- ✅ 更好的可扩展性

## 🔑 获取 Supabase 配置

### 1. 登录 Supabase

访问：https://supabase.com/dashboard

### 2. 选择或创建项目

- 如果已有项目，直接选择
- 如果没有，点击 "New Project" 创建

### 3. 获取配置信息

在项目设置页面：

1. **获取 SUPABASE_URL**:
   - 进入 **Settings** → **API**
   - 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）

2. **获取 SUPABASE_KEY**:
   - 在同一个页面
   - 复制 **service_role** 密钥（⚠️ 注意：不是 `anon` 密钥）
   - 格式类似：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 在 Railway 中设置环境变量

### 方法 1: 通过 Web 界面

1. 登录 Railway: https://railway.app
2. 选择您的项目
3. 点击 **Variables** 标签页
4. 添加以下环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

5. 保存后，Railway 会自动重新部署

### 方法 2: 通过 Railway CLI

```bash
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_KEY=your-service-role-key
```

## ✅ 验证配置

部署完成后，检查 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功（任务将持久化存储）
```

**ℹ️ 如果未配置，会显示：**
```
ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）
```

## 🔍 当前状态

**不配置 Supabase 的影响：**
- ✅ 服务可以正常运行
- ✅ 任务可以正常创建和处理
- ⚠️ 任务数据存储在内存中
- ⚠️ 服务重启后任务记录会丢失
- ⚠️ 无法查看历史任务

**配置 Supabase 的好处：**
- ✅ 任务数据持久化存储
- ✅ 服务重启后任务记录保留
- ✅ 可以查询历史任务
- ✅ 更好的可扩展性

## 💡 建议

**如果您：**
- 只是测试功能 → **可以不配置** Supabase
- 需要生产环境 → **建议配置** Supabase
- 需要任务历史记录 → **必须配置** Supabase

## 📞 需要帮助？

如果遇到问题：
1. 确认使用的是 `service_role` 密钥，不是 `anon` 密钥
2. 检查 URL 格式是否正确（以 `https://` 开头）
3. 查看 Railway 日志获取详细错误信息








