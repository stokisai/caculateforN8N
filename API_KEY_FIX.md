# API 密钥配置修复指南

## 🔴 问题诊断

您提供的 OpenRouter API 密钥是占位符值：
```
__n8n_BLANK_VALUE_e5362baf-c777-4d57-a609-6eaf1f9e87f6
```

这不是真实的 API 密钥，这就是为什么报告生成失败的原因！

## ✅ 解决方案

### 步骤 1: 获取真实的 OpenRouter API 密钥

1. 访问 https://openrouter.ai/keys
2. 登录或注册账户
3. 创建新的 API 密钥
4. 复制密钥（格式类似：`sk-or-v1-xxxxxxxxxxxxxxxxxxxxx`）

### 步骤 2: 在 Railway 中更新环境变量

1. 登录 Railway: https://railway.app
2. 进入您的项目
3. 点击 **Variables** 标签页
4. 找到 `OPENROUTER_API_KEY` 环境变量
5. 点击编辑，将占位符值替换为真实的 API 密钥
6. 保存更改（Railway 会自动重新部署）

### 步骤 3: 验证 SERP_API_KEY

同时检查 `SERP_API_KEY` 是否也是占位符：

- 如果也是占位符，访问 https://serpapi.com/dashboard 获取真实密钥
- 当前值应该是：`081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40`
- 如果这个值有效，可以保留

### 步骤 4: 检查部署日志

部署完成后，查看 Railway 日志：

**✅ 正确的日志应该显示：**
```
✅ Supabase 连接成功
```

**❌ 如果看到以下错误，说明 API 密钥仍有问题：**
```
❌ 错误: OPENROUTER_API_KEY 是占位符值！
❌ 错误: OPENROUTER_API_KEY 未设置！
```

## 📋 完整的环境变量列表

确保以下环境变量都已正确配置：

```bash
# Supabase（必需）
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# 社媒选品法服务（必需）
SERP_API_KEY=081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx  # ⚠️ 替换为真实密钥

# Gemini（可选）
GEMINI_API_KEY=your-gemini-key
```

## 🔍 如何验证修复是否成功

1. 重新部署后，提交一个新的任务
2. 查看后端日志，应该看到：
   - ✅ 没有 "占位符值" 的错误
   - ✅ SERP 搜索成功
   - ✅ LLM 生成成功
3. 下载的报告应该包含完整的章节内容，而不是只有标题

## 💡 常见问题

**Q: 如何知道 API 密钥是否正确？**
A: 查看 Railway 日志，如果看到 "❌ 错误: OPENROUTER_API_KEY 是占位符值"，说明需要替换。

**Q: OpenRouter 账户需要充值吗？**
A: 是的，需要确保账户有足够的余额来调用 API。查看余额：https://openrouter.ai/credits

**Q: 部署后多久生效？**
A: Railway 通常在 1-2 分钟内完成重新部署。

**Q: 如何测试 API 密钥是否有效？**
A: 可以手动调用 OpenRouter API：
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-chat-v3-0324", "messages": [{"role": "user", "content": "Hello"}]}'
```

## 📞 需要帮助？

如果问题仍然存在，请检查：
1. Railway 日志中的详细错误信息
2. OpenRouter 账户余额是否充足
3. API 密钥是否有正确的权限




