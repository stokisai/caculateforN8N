# 易逊跨境关键词词库搭建工具 - 部署指南

## 项目结构

```
├── app/
│   ├── keyword-tool/           # 关键词工具前端页面
│   │   ├── page.tsx            # 服务端页面
│   │   └── keyword-tool-client.tsx  # 客户端组件
│   └── api/keyword-tool/       # Next.js API Routes
│       ├── process/route.ts    # 处理任务接口
│       ├── status/[taskId]/route.ts  # 获取任务状态
│       └── download/[taskId]/route.ts # 下载结果文件
├── python-backend/
│   ├── main.py                 # FastAPI 主应用（已添加关键词处理端点）
│   └── services/
│       └── keyword_processor.py # 关键词处理核心逻辑
├── sql/
│   └── keyword_tool_schema.sql # 数据库表结构
└── types/
    └── supabase.ts             # TypeScript 类型定义
```

## 部署步骤

### 1. Supabase 配置

1. 登录 Supabase Dashboard
2. 执行 SQL 脚本创建必要的表：
   ```sql
   -- 在 SQL Editor 中运行 sql/keyword_tool_schema.sql
   ```
3. 确保 Storage Bucket `keyword-files` 已创建
4. 检查 RLS 策略是否正确配置

### 2. Railway 后端部署

1. 确保 `python-backend/` 已部署到 Railway
2. 在 Railway 设置中添加环境变量：
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-role-key
   ```
3. 重启服务使配置生效

### 3. Vercel 前端部署

1. 在 Vercel 项目设置中添加环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   FASTAPI_URL=https://your-railway-app.up.railway.app
   ```
2. 重新部署前端

## 功能说明

### 文件上传（共14个）

| 文件类型 | 说明 | 必填 |
|---------|------|------|
| H10反查总表 | 主表，处理结果会写入此表 | ✅ |
| 自身ASIN反查 | 用于 AN 列 F 标记 | ✅ |
| 竞对ABA热搜词反查 | 用于 AN 列 E 标记（读取第二工作表） | ✅ |
| 竞品1-10 | 用于 AN 列 D/C/B/A 标记 | ❌ |
| 拓词基础表 | 用于 AO 列分类（A-E列） | ✅ |

### AN 列 - 关键词类别

优先级：F > E > D > C > B > A

| 标记 | 条件 |
|------|------|
| F | 关键词出现在「自身ASIN反查」 |
| E | 关键词出现在「竞对ABA热搜词反查」第二工作表 |
| D | 在任一竞品中出现，广告排名≤20 且 自然排名≤20 |
| C | 在任一竞品中出现，仅自然排名≤20 |
| B | 在任一竞品中出现，仅广告排名≤20 |
| A | 出现在竞品但排名>20，或未出现在竞品 |

### AO 列 - 相关性分类

基于拓词基础表的 A-E 列进行整词匹配：

| 优先级 | 分类 | 条件 |
|--------|------|------|
| 1 | 不相关词 | 包含 D 列词 |
| 2 | 品牌词 | 包含 E 列词 |
| 3 | a精准属性精准词 | 包含 A+B，不含 D/E |
| 4 | b泛属性精准词 | 包含 A+C，不含 B/D/E |
| 5 | 大词或泛词 | 仅含 A，不含 B/C/D/E |
| 6 | 相关词 | 其他情况 |

### AP 列 - 流量大小分类

基于 D 列搜索量的累计百分比：

| 区间 | 标记 |
|------|------|
| 0-40% | 高流量词1 |
| 40-70% | 中高流量词2 |
| 70-90% | 中低流量词3 |
| 90-100% | 低流量词4 |

## 使用流程

1. 用户登录后，从仪表板进入「关键词词库搭建工具」
2. 上传 14 个 Excel 文件（必填文件必须上传）
3. 点击「开始搭建词库」按钮
4. 系统自动处理，显示进度条
5. 处理完成后下载结果文件

## API 端点

### 前端 API Routes (Vercel)

- `POST /api/keyword-tool/process` - 触发任务处理
- `GET /api/keyword-tool/status/{taskId}` - 获取任务状态
- `GET /api/keyword-tool/download/{taskId}` - 下载结果文件

### 后端 API (Railway FastAPI)

- `POST /api/keyword-tool/process` - 执行关键词处理
- `GET /api/keyword-tool/task/{taskId}` - 获取任务状态

## 故障排除

1. **文件上传失败**: 检查 Supabase Storage 配置和 RLS 策略
2. **处理超时**: 检查 Railway 服务是否正常运行
3. **下载失败**: 确认 result_url 路径正确存在于 Storage

