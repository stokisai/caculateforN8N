# 🏗️ 架构重构说明

## ✅ 已完成的架构变更

### 之前（旧架构）
```
前端 → Supabase Storage → n8n → FastAPI → 计算
```

### 现在（新架构）
```
前端 → FastAPI → 计算
```

## 📝 代码变更总结

### 1. 前端代码修改

#### ✅ `app/dashboard/ui/dashboard-client.tsx`
- ❌ 删除了 Supabase Storage 上传逻辑
- ❌ 删除了 tasks 表插入逻辑
- ❌ 删除了 n8n webhook 调用逻辑
- ✅ 改为直接使用 `FormData` 上传文件到 FastAPI
- ✅ 使用 `multipart/form-data` 格式

#### ✅ `app/dashboard/dashboard-client.tsx`
- 同样的修改（备用组件）

### 2. 新的请求流程

```typescript
// 构建 FormData
const formData = new FormData();
if (file) {
  formData.append("file", file);
}
if (inputText) {
  formData.append("input_text", inputText);
}

// 直接 POST 到 FastAPI
const response = await fetch(fastApiUrl, {
  method: "POST",
  body: formData,
  // 不设置 Content-Type，让浏览器自动设置
});
```

### 3. 响应处理

- **JSON 响应**：显示在 Modal 中
- **文件响应**：自动下载（如 Excel 文件）

## 🔧 需要配置的内容

### 1. 更新 Supabase services 表

需要将 `webhook_url` 字段更新为 FastAPI 的 endpoint URL。

**当前 services 表数据：**
- Ex大名): `https://primary-production-6672d.up.railway.app/webhook/h10`
- 计算投产比: `https://primary-production-6672d.up.railway.app/webhook/d6898f17-a3dd-4171-9a74-24e5cbe67e16`
- 筛选核心关键词: `https://primary-production-6672d.up.railway.app/webhook/test-hook`

**需要更新为 FastAPI endpoint（示例）：**
- Ex大名): `https://your-fastapi-railway.app/api/ex-daming`
- 计算投产比: `https://your-fastapi-railway.app/api/calculate-roi`
- 筛选核心关键词: `https://your-fastapi-railway.app/api/filter-keywords`

### 2. FastAPI 需要实现的接口

每个服务需要对应的 FastAPI endpoint，接收：
- `file`: 文件（multipart/form-data）
- `input_text`: 文本输入（可选）

返回：
- JSON 响应：`{ "result": "...", "message": "..." }`
- 或文件响应：Excel/CSV 文件（带 `Content-Disposition` header）

## 📋 下一步操作

### 步骤 1：获取 FastAPI URL

从 Railway Dashboard 获取你的 FastAPI 服务的公共 URL。

### 步骤 2：更新数据库

运行以下 SQL 更新 services 表：

```sql
-- 示例：更新 webhook_url 为 FastAPI endpoint
-- 请根据实际的 FastAPI URL 和 endpoint 路径修改

UPDATE public.services 
SET webhook_url = 'https://your-fastapi-railway.app/api/ex-daming'
WHERE id = 'abfaf85c-9553-4d7b-9416-e3aff65e8587';

UPDATE public.services 
SET webhook_url = 'https://your-fastapi-railway.app/api/calculate-roi'
WHERE id = '65bb6f50-5087-488e-8f1b-350d4ed9fe00';

UPDATE public.services 
SET webhook_url = 'https://your-fastapi-railway.app/api/filter-keywords'
WHERE id = 'd144da99-d3e6-4b78-9cd5-70b1e4ced346';
```

### 步骤 3：测试

1. 部署前端代码到 Vercel
2. 测试文件上传功能
3. 确认 FastAPI 能正常接收和处理文件

## 🗑️ 可以删除的文件（可选）

以下文件现在不再需要，但可以保留作为备份：

- `app/api/n8n/route.ts` - n8n 代理 API（不再使用）

## 📝 注意事项

1. **CORS 配置**：确保 FastAPI 允许来自 Vercel 域名的跨域请求
2. **文件大小限制**：FastAPI 需要配置合适的文件大小限制
3. **错误处理**：FastAPI 应该返回清晰的错误信息
4. **响应格式**：确保 FastAPI 返回的格式与前端期望一致

## 🔍 调试提示

如果遇到问题，检查：
1. 浏览器控制台的网络请求（Network 标签）
2. FastAPI 的日志
3. 确认 FastAPI URL 是否正确
4. 确认 FastAPI endpoint 路径是否正确









