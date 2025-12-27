# H10竞品分析服务设置指南

## ✅ 已完成的工作

1. **创建了新的 Service ID**: `a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f`
2. **创建了 SQL 脚本**: `create_h10_service.sql`
3. **更新了后端代码**: 添加了 H10 服务的处理框架
4. **支持文件上传**: 
   - ✅ ZIP 压缩包（自动解压并处理所有 Excel 文件）
   - ✅ 单个 Excel 文件（.xlsx, .xls）

## 📋 设置步骤

### 步骤 1: 在 Supabase 中创建 Service

1. 登录 Supabase Dashboard: https://supabase.com/dashboard
2. 选择您的项目
3. 进入 **SQL Editor**
4. 复制并执行 `create_h10_service.sql` 文件中的 SQL 语句

或者直接在 SQL Editor 中执行：

```sql
INSERT INTO public.services (id, title, description, image_url, webhook_url, input_type)
VALUES (
  'a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f',
  'H10竞品分析',
  '上传H10数据文件（支持ZIP压缩包或多个Excel文件），AI将自动分析竞品数据并生成分析报告。',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'https://caculateforn8n-production.up.railway.app/process',
  'file'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  webhook_url = EXCLUDED.webhook_url,
  input_type = EXCLUDED.input_type;
```

### 步骤 2: 验证 Service 已创建

执行以下 SQL 查询验证：

```sql
SELECT id, title, description, input_type, webhook_url 
FROM public.services 
WHERE id = 'a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f';
```

应该能看到：
- **id**: `a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f`
- **title**: `H10竞品分析`
- **input_type**: `file`

### 步骤 3: 前端会自动显示新服务

刷新前端页面，应该能看到新的 "H10竞品分析" 服务卡片。

## 🔧 后端代码结构

### Service ID 常量

```python
H10_SERVICE_ID = "a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f"
```

### 文件处理逻辑

后端代码已经支持：

1. **ZIP 文件处理**:
   - 自动解压 ZIP 文件
   - 查找所有 Excel 文件（.xlsx, .xls）
   - 读取所有文件（当前只读取第一个作为示例，等待您提供合并逻辑）

2. **单个 Excel 文件处理**:
   - 直接读取 Excel 文件
   - 传递给处理函数

### 待实现的处理逻辑

在 `python-backend/main.py` 的 `process_dataframe` 函数中，H10 服务的处理逻辑目前是占位符：

```python
if service_id == H10_SERVICE_ID:
    # ✅ H10竞品分析处理逻辑（等待用户提供具体逻辑）
    print("🔍 H10竞品分析：开始处理数据...")
    # TODO: 等待用户提供具体的竞品分析逻辑
    result_df = df.copy()
    result_df["处理状态"] = "待实现：等待用户提供分析逻辑"
```

## 📝 下一步：实现分析逻辑

当您准备好提供运算逻辑时，请告诉我：

1. **输入数据格式**:
   - Excel 文件的列结构
   - 如果有多个文件，如何合并或处理

2. **分析需求**:
   - 需要计算哪些指标
   - 需要生成什么样的报告
   - 输出格式（Excel、文本报告等）

3. **特殊要求**:
   - 是否需要处理多个文件的数据合并
   - 是否需要数据清洗或转换
   - 是否需要生成图表或可视化

## 🧪 测试

设置完成后，您可以：

1. 在前端上传一个 ZIP 文件或 Excel 文件
2. 查看后端日志，确认文件被正确接收
3. 当前会返回原始数据 + "处理状态" 列（等待实现具体逻辑）

## 📞 需要帮助？

如果遇到问题：
1. 检查 Supabase 中 service 是否已创建
2. 检查后端日志（Railway）确认请求是否到达
3. 查看浏览器控制台（F12）查看前端错误







