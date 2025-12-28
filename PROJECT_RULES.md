# 🏗️ 项目规范与开发指南

> 本文档是项目的核心规范，所有开发必须遵循这些规则以避免代码冗余和污染。

---

## 📋 目录

1. [黄金法则](#-黄金法则)
2. [文件夹结构规范](#-文件夹结构规范)
3. [添加新服务的标准流程](#-添加新服务的标准流程)
4. [代码规范](#-代码规范)
5. [文档规范](#-文档规范)
6. [Git 提交规范](#-git-提交规范)
7. [禁止事项清单](#-禁止事项清单)

---

## 🔱 黄金法则

### 1. 单一职责原则
- **每个文件只做一件事**
- Python 服务处理函数必须独立成文件
- 前端组件不超过 200 行

### 2. DRY 原则 (Don't Repeat Yourself)
- 重复代码必须抽取为工具函数
- 相似逻辑必须参数化复用
- 禁止复制粘贴代码块

### 3. 先删后加原则
- 添加新功能前，先检查是否有可复用的代码
- 废弃的代码必须立即删除，不要注释保留
- 临时调试代码必须在提交前清理

### 4. 文档跟随代码原则
- 新功能 = 新代码 + 更新文档
- 删除功能 = 删除代码 + 更新文档
- 禁止创建临时性文档（如 FIX.md, DEBUG.md）

---

## 📁 文件夹结构规范

### 推荐的项目结构

```
n8n-saas-curspr/
│
├── 📂 app/                          # Next.js 前端
│   ├── api/
│   │   └── n8n/route.ts             # API 代理
│   ├── dashboard/
│   │   ├── page.tsx                 # 服务端组件
│   │   └── dashboard-client.tsx     # 客户端组件
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── 📂 components/                   # 可复用 UI 组件
│   └── ui/
│       ├── button.tsx
│       └── input.tsx
│
├── 📂 lib/                          # 工具库
│   ├── supabase-browser.ts
│   └── supabase-server.ts
│
├── 📂 types/                        # TypeScript 类型定义
│   └── supabase.ts
│
├── 📂 python-backend/               # Python 后端
│   ├── 📂 services/                 # ⭐ 服务模块（每个服务一个文件）
│   │   ├── __init__.py
│   │   ├── base.py                  # 基础服务类
│   │   ├── ex_daming.py             # Ex大名服务
│   │   ├── filter_keywords.py       # 筛选关键词服务
│   │   ├── calculate_roi.py         # 计算投产比服务
│   │   ├── social_media_research.py # 社媒选品法服务
│   │   └── ...                      # 新服务添加在这里
│   │
│   ├── 📂 utils/                    # 工具函数
│   │   ├── __init__.py
│   │   ├── excel.py                 # Excel 处理工具
│   │   ├── amazon.py                # Amazon 爬虫工具
│   │   ├── llm.py                   # LLM API 调用
│   │   └── serp.py                  # SERP API 调用
│   │
│   ├── 📂 models/                   # 数据模型
│   │   ├── __init__.py
│   │   └── job.py                   # 任务模型
│   │
│   ├── main.py                      # FastAPI 入口（仅路由定义）
│   ├── config.py                    # 配置管理
│   ├── requirements.txt
│   └── README.md
│
├── 📂 docs/                         # ⭐ 统一文档目录
│   ├── ARCHITECTURE.md              # 架构说明
│   ├── DEPLOYMENT.md                # 部署指南
│   ├── SERVICES.md                  # 服务说明
│   └── API.md                       # API 文档
│
├── 📂 sql/                          # ⭐ SQL 文件统一管理
│   ├── schema.sql                   # 数据库结构
│   ├── rls_policies.sql             # RLS 策略
│   └── migrations/                  # 迁移记录
│       └── 001_initial.sql
│
├── .gitignore
├── package.json
├── README.md                        # 项目入口文档
└── PROJECT_RULES.md                 # 本文件
```

### 结构规则

| 目录 | 用途 | 规则 |
|------|------|------|
| `python-backend/services/` | 业务服务 | 每个服务一个文件，继承 BaseService |
| `python-backend/utils/` | 工具函数 | 纯函数，无业务逻辑 |
| `docs/` | 所有文档 | 禁止在根目录放文档 |
| `sql/` | 数据库文件 | 统一管理 SQL |

---

## ➕ 添加新服务的标准流程

### 步骤 1: 在 Supabase 添加服务记录

```sql
INSERT INTO public.services (id, title, description, webhook_url, input_type)
VALUES (
  gen_random_uuid(),
  '新服务名称',
  '服务描述',
  'https://your-backend.railway.app/process',
  'file'  -- 或 'text' 或 'both'
);
```

**记住新服务的 ID!**

### 步骤 2: 创建服务处理文件

在 `python-backend/services/` 创建新文件：

```python
# python-backend/services/new_service.py

from .base import BaseService
import pandas as pd

class NewService(BaseService):
    """
    新服务名称
    
    Service ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    Input Type: file / text / both
    Output Type: excel / json / text
    
    功能描述：
    - 功能点 1
    - 功能点 2
    """
    
    SERVICE_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    
    def process(self, df: pd.DataFrame, input_text: str = None) -> pd.DataFrame:
        """主处理逻辑"""
        result = df.copy()
        # 实现业务逻辑
        return result
```

### 步骤 3: 注册服务

在 `python-backend/services/__init__.py` 注册：

```python
from .new_service import NewService

SERVICE_REGISTRY = {
    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx": NewService,
    # ... 其他服务
}
```

### 步骤 4: 更新文档

在 `docs/SERVICES.md` 添加新服务说明。

### 步骤 5: 提交代码

```bash
git add python-backend/services/new_service.py
git add docs/SERVICES.md
git commit -m "feat(service): 添加新服务 - XXX"
git push
```

---

## 📝 代码规范

### Python 后端

```python
# ✅ 好的做法
class ServiceName(BaseService):
    """清晰的文档字符串"""
    SERVICE_ID = "xxx"
    
    def process(self, df, input_text=None):
        return self._do_something(df)
    
    def _do_something(self, df):
        """私有方法以下划线开头"""
        pass

# ❌ 坏的做法
def process_xxx(df):  # 不要用裸函数
    pass
```

### 前端组件

```typescript
// ✅ 好的做法
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

// ❌ 坏的做法
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 文件命名

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| Python 服务 | snake_case | `calculate_roi.py` |
| Python 工具 | snake_case | `excel_utils.py` |
| React 组件 | kebab-case | `dashboard-client.tsx` |
| TypeScript 类型 | camelCase | `supabase.ts` |

---

## 📚 文档规范

### 允许的文档

| 文件 | 位置 | 用途 |
|------|------|------|
| `README.md` | 根目录 | 项目入口 |
| `PROJECT_RULES.md` | 根目录 | 本规范文件 |
| `docs/*.md` | docs/ | 详细文档 |
| `python-backend/README.md` | 后端目录 | 后端说明 |

### 禁止的文档

- ❌ `XXX_FIX.md` - 临时修复文档
- ❌ `DEBUG_XXX.md` - 调试文档
- ❌ `XXX_CHANGES.md` - 变更日志（用 Git）
- ❌ `XXX_STATUS.md` - 状态跟踪
- ❌ 任何根目录的临时文档

### 文档模板

```markdown
# 功能名称

## 概述
简短描述

## 使用方法
步骤说明

## 配置
环境变量等

## 注意事项
重要提醒
```

---

## 📦 Git 提交规范

### 提交消息格式

```
<type>(<scope>): <description>

[optional body]
```

### 类型 (type)

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `refactor` | 重构（不改变功能） |
| `docs` | 文档更新 |
| `cleanup` | 代码清理 |
| `chore` | 构建/配置变更 |

### 作用域 (scope)

| 作用域 | 说明 |
|--------|------|
| `frontend` | 前端相关 |
| `backend` | Python 后端 |
| `service` | 新服务 |
| `db` | 数据库变更 |
| `deploy` | 部署相关 |

### 示例

```bash
# 添加新服务
git commit -m "feat(service): 添加新服务 - 关键词分析"

# 修复 bug
git commit -m "fix(backend): 修复 Excel 编码问题"

# 代码清理
git commit -m "cleanup: 删除未使用的组件和冗余代码"

# 文档更新
git commit -m "docs: 更新 API 文档"
```

---

## 🚫 禁止事项清单

### 代码禁止

1. ❌ **禁止在根目录创建临时文件**
2. ❌ **禁止注释掉大段代码保留**
3. ❌ **禁止复制粘贴重复逻辑**
4. ❌ **禁止在 main.py 添加业务逻辑（超过 50 行）**
5. ❌ **禁止硬编码 API 密钥**
6. ❌ **禁止在组件内直接创建 Supabase 客户端**
7. ❌ **禁止创建空文件占位**

### 文档禁止

1. ❌ **禁止在根目录创建新的 .md 文件**（除 README 和 PROJECT_RULES）
2. ❌ **禁止创建临时性文档**
3. ❌ **禁止重复文档内容**

### Git 禁止

1. ❌ **禁止提交 .backup 文件**
2. ❌ **禁止提交调试用的 console.log/print**
3. ❌ **禁止提交未完成的代码**

---

## ✅ 检查清单

### 每次提交前检查

- [ ] 没有创建新的根目录文档
- [ ] 没有注释掉的废弃代码
- [ ] 没有重复的逻辑
- [ ] 新服务遵循标准结构
- [ ] 文档已更新
- [ ] 没有硬编码密钥
- [ ] 构建通过 (`npm run build`)

### 每周检查

- [ ] 清理未使用的依赖
- [ ] 检查是否有冗余文件
- [ ] 验证所有服务正常工作

---

## 🔧 重构当前 Python 后端（推荐）

当前 `main.py` 超过 2000 行，建议按以下结构重构：

### 目标结构

```
python-backend/
├── main.py                 # 仅路由（~100行）
├── config.py               # 配置管理
├── services/
│   ├── __init__.py         # 服务注册表
│   ├── base.py             # 基础服务类
│   ├── ex_daming.py        # Ex大名
│   ├── filter_keywords.py  # 筛选关键词
│   ├── calculate_roi.py    # 计算投产比
│   └── social_research.py  # 社媒选品法
└── utils/
    ├── __init__.py
    ├── excel.py            # Excel 工具
    ├── amazon.py           # Amazon 爬虫
    ├── llm.py              # LLM 调用
    └── serp.py             # SERP API
```

### 重构后的 main.py 示例

```python
from fastapi import FastAPI, UploadFile, File, Form
from services import SERVICE_REGISTRY

app = FastAPI()

@app.post("/process")
async def process(
    file: UploadFile = File(None),
    service_id: str = Form(None),
    input_text: str = Form(None)
):
    service_class = SERVICE_REGISTRY.get(service_id)
    if not service_class:
        return {"error": "Unknown service"}
    
    service = service_class()
    return await service.handle(file, input_text)
```

---

## 📞 联系与支持

如有疑问，请参考：
- `docs/ARCHITECTURE.md` - 架构说明
- `docs/SERVICES.md` - 服务列表
- `docs/DEPLOYMENT.md` - 部署指南

---

*最后更新: 2024-12-28*

