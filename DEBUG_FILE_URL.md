# 🔍 文件 URL 问题调试指南

## 问题描述

错误信息：`Invalid key: a205832a-9d1e-4217-bf8d-8ec10cf95d90/d144da99-d3e6-4b78-9cd5-70b1e4ced346/1765720332635-关键词筛选.xlsx`

这个错误表明 n8n 收到了路径而不是完整的 URL。

## ✅ 代码修复

代码已经更新，现在会：
1. 上传文件到 Supabase Storage
2. 生成完整的公共 URL
3. 验证 URL 格式
4. 将完整的 URL 传递给 n8n

## 🔍 调试步骤

### 步骤 1：检查代码是否已部署

1. **提交并推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "修复文件 URL：添加验证和详细日志"
   git push
   ```

2. **等待 Vercel 部署完成**
   - 检查 Vercel Dashboard 确认部署成功
   - 等待 1-2 分钟让部署生效

### 步骤 2：清除浏览器缓存

1. 按 `Ctrl + Shift + R` (Windows) 或 `Cmd + Shift + R` (Mac) 强制刷新
2. 或打开开发者工具（F12）→ Network 标签 → 勾选 "Disable cache"

### 步骤 3：检查浏览器控制台

上传文件后，打开浏览器控制台（F12），应该看到：

```
📁 文件上传成功:
  - 路径: a205832a-9d1e-4217-bf8d-8ec10cf95d90/d144da99-d3e6-4b78-9cd5-70b1e4ced346/1765720332635-关键词筛选.xlsx
  - 完整 URL: https://hoxertvxlgtdcdzqrsvs.supabase.co/storage/v1/object/public/task-files/a205832a-9d1e-4217-bf8d-8ec10cf95d90/d144da99-d3e6-4b78-9cd5-70b1e4ced346/1765720332635-关键词筛选.xlsx
  - URL 格式验证: ✅
```

**如果看到的是路径而不是 URL，说明代码还没有更新。**

### 步骤 4：检查发送给 n8n 的数据

在控制台应该看到：

```
📤 发送给 n8n 的完整数据: {
  "task_id": "...",
  "service_id": "...",
  "user_id": "...",
  "input_text": "...",
  "file_url": "https://hoxertvxlgtdcdzqrsvs.supabase.co/storage/v1/object/public/task-files/..."
}
```

**确认 `file_url` 字段是完整的 HTTP URL，而不是路径。**

### 步骤 5：验证 URL 是否可访问

复制控制台中的 `file_url`，在浏览器中直接访问，应该能下载文件。

如果无法访问，可能是：
- Storage bucket 权限问题
- URL 格式错误

### 步骤 6：检查 n8n 配置

如果前端已经发送了正确的 URL，但 n8n 仍然报错，可能是 n8n 配置问题：

1. **检查 n8n workflow**
   - 查看 n8n 中接收 webhook 的节点
   - 确认它如何读取 `file_url` 字段

2. **检查 n8n 中的文件处理节点**
   - 如果 n8n 使用 HTTP Request 节点下载文件，确保：
     - URL 字段使用 `{{ $json.file_url }}`
     - Method 设置为 `GET`
     - Response Format 设置为 `File`

3. **如果 n8n 尝试使用 Supabase API**
   - 确保使用完整的 URL，而不是路径
   - 不要使用 Storage API 的 key 参数

## 🐛 常见问题

### Q1: 控制台显示路径而不是 URL

**原因**：代码还没有部署或浏览器缓存

**解决**：
1. 确认代码已推送到 GitHub
2. 确认 Vercel 部署成功
3. 清除浏览器缓存
4. 硬刷新页面（Ctrl+Shift+R）

### Q2: URL 格式正确但 n8n 仍然报错

**原因**：n8n 配置问题

**解决**：
1. 检查 n8n workflow 中如何读取 `file_url`
2. 确保使用 HTTP Request 节点直接下载 URL
3. 不要尝试使用路径作为 Supabase Storage API 的 key

### Q3: URL 无法访问

**原因**：Storage bucket 权限或配置问题

**解决**：
1. 检查 Supabase Dashboard → Storage → task-files bucket
2. 确认 bucket 是 `public: true`
3. 测试 URL 在浏览器中是否可访问

## 📝 正确的 URL 格式

✅ **正确格式**：
```
https://hoxertvxlgtdcdzqrsvs.supabase.co/storage/v1/object/public/task-files/{path}
```

❌ **错误格式**（路径）：
```
a205832a-9d1e-4217-bf8d-8ec10cf95d90/d144da99-d3e6-4b78-9cd5-70b1e4ced346/1765720332635-关键词筛选.xlsx
```

## 🔧 如果问题仍然存在

1. **截图浏览器控制台的日志**，特别是：
   - `📁 文件上传成功:` 日志
   - `📤 发送给 n8n 的完整数据:` 日志

2. **检查 n8n workflow**：
   - 截图 n8n 中处理文件的节点配置
   - 查看 n8n 的执行日志

3. **测试 URL**：
   - 复制控制台中的 `file_url`
   - 在浏览器中直接访问，确认可以下载

## 📞 需要帮助？

如果按照以上步骤仍然无法解决，请提供：
1. 浏览器控制台的完整日志
2. n8n workflow 的配置截图
3. n8n 的执行日志





