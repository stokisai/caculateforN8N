from fastapi import FastAPI, UploadFile, File, HTTPException, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import pandas as pd
import io
import zipfile
import os
from typing import Optional, List, Dict, Tuple
from supabase import create_client, Client
import json
import locale
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import quote
import asyncio
import aiohttp
from datetime import datetime
import uuid
import base64


# --- 配置部分 ---
app = FastAPI(title="Excel Processing API", version="1.0.0")

# RapidAPI 配置
RAPIDAPI_KEY = "a28a42a0a7mshddbb4f5e053ac79p10bb74jsn713f074877fc"
RAPIDAPI_HOST = "realtime-amazon-data.p.rapidapi.com"  # 注意：你提供的 host 是 realtime（没有连字符）

# 允许跨域请求（这样你的前端才能调这个接口）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议把 * 换成你前端的域名，如 ["https://yourdomain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 连接 Supabase（可选，用于任务持久化存储）
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # 建议使用 service_role key

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase 连接成功（任务将持久化存储）")
    except Exception as e:
        print(f"⚠️ Supabase 连接失败: {e}")
        print("   提示: 任务将存储在内存中，重启后会丢失")
else:
    # ✅ 修复：Supabase 是可选的，不显示警告（任务存储在内存中）
    print("ℹ️ 提示: Supabase 未配置，任务将存储在内存中（重启后会丢失）")
    print("   如需持久化存储，请在 Railway 环境变量中设置 SUPABASE_URL 和 SUPABASE_KEY")

# 社媒选品法服务配置（从环境变量读取）
# ⚠️ 注意：生产环境应该通过 Railway 环境变量设置，不要硬编码密钥
SERP_API_KEY = os.getenv("SERP_API_KEY", "081c24883966800829defaacc9226d81832f54fbeb82b82bda1f5c8a9d01df40")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
SERP_API_URL = "https://serpapi.com/search"
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
REFERENCE_IMAGE_URL = "https://m.media-amazon.com/images/I/61HVDJy8R4L._SL1500_.jpg"

# ✅ 修复：检测占位符API密钥
def is_placeholder_key(key: str) -> bool:
    """检测是否是占位符密钥"""
    if not key:
        return False
    placeholder_patterns = [
        "__n8n_BLANK_VALUE_",
        "__BLANK_VALUE__",
        "your-",
        "placeholder",
        "example",
        "test-key",
        "REPLACE_ME"
    ]
    key_lower = key.lower()
    return any(pattern.lower() in key_lower for pattern in placeholder_patterns)

# 检查 API 密钥配置
if not OPENROUTER_API_KEY:
    print("❌ 错误: OPENROUTER_API_KEY 未设置！LLM 生成将失败。")
    print("   请在 Railway 环境变量中设置 OPENROUTER_API_KEY")
elif is_placeholder_key(OPENROUTER_API_KEY):
    print(f"❌ 错误: OPENROUTER_API_KEY 是占位符值！当前值: {OPENROUTER_API_KEY[:50]}...")
    print("   请替换为真实的 OpenRouter API 密钥")
    print("   获取密钥: https://openrouter.ai/keys")
    OPENROUTER_API_KEY = ""  # 清空占位符，避免使用

if not SERP_API_KEY:
    print("❌ 错误: SERP_API_KEY 未设置！SERP 搜索将失败。")
    print("   请在 Railway 环境变量中设置 SERP_API_KEY")
elif is_placeholder_key(SERP_API_KEY):
    print(f"❌ 错误: SERP_API_KEY 是占位符值！当前值: {SERP_API_KEY[:50]}...")
    print("   请替换为真实的 SerpAPI 密钥")
    print("   获取密钥: https://serpapi.com/dashboard")
    SERP_API_KEY = ""  # 清空占位符，避免使用

# 任务存储（生产环境应使用 Redis 或数据库）
job_storage: Dict[str, Dict] = {}

# --- 核心逻辑 ---
@app.post("/process")
async def process_excel(
    file: Optional[UploadFile] = File(None),
    service_id: Optional[str] = Form(None),
    input_text: Optional[str] = Form(None),
):
    """
    处理上传的 Excel/ZIP 文件或文本输入
    
    参数:
    - file: 上传的文件（支持 .xlsx, .xls, .zip），对于文本输入服务可为空
    - service_id: 可选的服务ID（用于记录）
    - input_text: 可选的文本输入（对于文本输入服务必需）
    """
    # 检查服务类型：如果是"社媒选品法"，只需要 input_text，不需要 file
    if service_id == "7b83cf63-0ad0-4c11-8dc5-6d8c242fbfe6":
        if not input_text or not input_text.strip():
            raise HTTPException(status_code=400, detail="社媒选品法服务需要提供关键词（input_text）")
        
        keyword = input_text.strip()
        
        # ✅ 修复：检查是否有相同关键词的任务正在运行（防止重复提交）
        running_jobs = [
            (job_id, job) 
            for job_id, job in job_storage.items() 
            if job.get("keyword") == keyword and job.get("status") in ["queued", "running"]
        ]
        
        if running_jobs:
            existing_job_id, existing_job = running_jobs[0]
            print(f"⚠️ 警告: 关键词 '{keyword}' 的任务已在运行中 (Job ID: {existing_job_id}, 状态: {existing_job.get('status')})")
            return JSONResponse({
                "message": f"关键词 '{keyword}' 的任务已在运行中，Job ID: {existing_job_id}。请等待完成或使用该 Job ID 查询进度。",
                "job_id": existing_job_id,
                "warning": "duplicate_keyword"
            }, status_code=200)  # 返回 200 而不是错误，因为任务确实存在
        
        # 直接调用异步任务处理逻辑
        job_id = str(uuid.uuid4())
        print(f"✅ 创建新任务: Job ID={job_id}, 关键词={keyword}")
        job_storage[job_id] = {
            "status": "queued",
            "keyword": keyword,
            "progress": 0.0,
            "sections": [],
            "created_at": datetime.now().isoformat(),
            "artifacts": {}
        }
        # 启动后台任务
        asyncio.create_task(execute_research_job(job_id, keyword))
        return JSONResponse({
            "message": f"任务已创建，Job ID: {job_id}。请使用 GET /api/jobs/{job_id} 查询进度。",
            "job_id": job_id
        })

    # 新增：亚马逊顶级 Listing 专家 (GEO & COSMO 增强版) 文本服务（仅文本输入，不需要文件）
    if service_id == "b9f2b13e-2f4b-4a62-8b0e-d2f74d824230":
        if not input_text or not input_text.strip():
            raise HTTPException(status_code=400, detail="?????????????????input_text?")
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY ???")

        try:
            import google.generativeai as genai

            # ????????????
            market_code = None
            match = re.search(r"\((US|UK|DE|FR|IT|ES|JP|CA|AU)\)", input_text, re.IGNORECASE)
            if match:
                market_code = match.group(1).upper()

            language_map = {
                "US": "??",
                "UK": "??",
                "CA": "??",
                "AU": "??",
                "DE": "??",
                "FR": "??",
                "IT": "????",
                "ES": "????",
                "JP": "??",
            }
            output_language = language_map.get(market_code, "??")

            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("google/gemini-3-pro-preview")

            prompt = f"""????? Amazon Listing ?????
??????????????? Listing ???

?????
{input_text}

?????{output_language}

?????
1) ???Title?????????????<= 200 ???
2) ?????Bullet Points??5 ???????????????????/???
3) ?????Description??1 ?????????????????
4) Search Terms?5-10 ????????????????

???????????
?Title?
...
?Bullet Points?
1. ...
2. ...
3. ...
4. ...
5. ...
?Description?
...
?Search Terms?
...
"""

            response = model.generate_content(prompt)
            result_text = getattr(response, "text", None) or ""
            if not result_text.strip():
                raise HTTPException(status_code=500, detail="Gemini ???????")

            return JSONResponse({
                "message": "????",
                "service_id": service_id,
                "result": result_text,
            })
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gemini ????: {str(e)}")

    if service_id != "7b83cf63-0ad0-4c11-8dc5-6d8c242fbfe6":  # 社媒选品法不需要文件
        if not file:
            raise HTTPException(status_code=400, detail="此服务需要上传文件")
    
    # ✅ 修复：安全处理文件名（可能包含非 ASCII 字符）
    original_filename = file.filename or "uploaded_file" if file else "uploaded_file"
    try:
        # 尝试解码文件名（如果是从 HTTP header 来的，可能是 URL 编码的）
        if isinstance(original_filename, bytes):
            original_filename = original_filename.decode('utf-8', errors='replace')
    except:
        pass
    
    print(f"📥 收到文件: {original_filename}, 类型: {file.content_type}")
    print(f"🔑 Service ID: {service_id}")
    print(f"📝 Input Text: {input_text}")
    
    try:
        # 1. 读取上传的文件
        content = await file.read()
        file_extension = os.path.splitext(original_filename)[1].lower()
        
        df = None
        result_filename = None
        
        # 2. 根据文件类型处理
        if file_extension == '.zip':
            # 处理 ZIP 文件
            if not zipfile.is_zipfile(io.BytesIO(content)):
                raise HTTPException(status_code=400, detail="上传的不是有效的 ZIP 文件")
            
            input_zip = zipfile.ZipFile(io.BytesIO(content))
            file_list = input_zip.namelist()
            
            # 其他服务：寻找目标文件
            target_file = None
            # 查找第一个 Excel 文件
            target_file = next((f for f in file_list if f.endswith((".xlsx", ".xls"))), None)
            
            if not target_file:
                raise HTTPException(status_code=400, detail=f"压缩包里没找到 Excel 文件。文件列表: {file_list}")
            
            print(f"📂 找到目标文件: {target_file}")
            
            # 读取 Excel
            with input_zip.open(target_file) as f:
                df = pd.read_excel(f)
            
            result_filename = f"processed_{os.path.splitext(target_file)[0]}.xlsx"
            
        elif file_extension in ['.xlsx', '.xls']:
            # 直接处理 Excel 文件
            df = pd.read_excel(io.BytesIO(content))
            # ✅ 修复：安全处理文件名，避免编码问题
            base_name = os.path.splitext(original_filename)[0]
            # 如果文件名包含非 ASCII 字符，使用安全的文件名
            try:
                base_name.encode('ascii')
                result_filename = f"processed_{base_name}.xlsx"
            except UnicodeEncodeError:
                # 包含非 ASCII 字符，使用时间戳作为文件名
                result_filename = f"processed_result_{int(pd.Timestamp.now().timestamp() * 1000)}.xlsx"
        else:
            raise HTTPException(status_code=400, detail=f"不支持的文件类型: {file_extension}。支持: .xlsx, .xls, .zip")
        
        if df is None or df.empty:
            raise HTTPException(status_code=400, detail="读取的 Excel 文件为空")
        
        
        # 3. 业务逻辑处理（根据 service_id 执行不同的处理）
        result = process_dataframe(df, service_id, input_text)
        
        # 4. 检查返回类型：如果是字符串（文本报告），返回纯文本文件；否则返回 Excel
        if isinstance(result, str):
            # 返回纯文本文件（.txt）
            text_bytes = result.encode('utf-8')
            return StreamingResponse(
                io.BytesIO(text_bytes),
                media_type="text/plain; charset=utf-8",
                headers={
                    "Content-Disposition": f'attachment; filename="roi_report_{int(pd.Timestamp.now().timestamp() * 1000)}.txt"'
                }
            )
        
        # 5. 导出结果到内存（Excel 文件）
        output = io.BytesIO()
        result.to_excel(output, index=False, engine='openpyxl')
        output.seek(0)
        
        # 6. 返回文件流（直接下载，不经过 Supabase）
        # ✅ 修复：处理中文文件名编码问题
        # 使用 RFC 5987 格式支持 UTF-8 编码的文件名
        from urllib.parse import quote
        
        # 生成安全的文件名（如果包含非 ASCII 字符，使用 URL 编码）
        try:
            # 尝试使用 ASCII 编码
            result_filename.encode('ascii')
            # 文件名只包含 ASCII 字符，直接使用
            content_disposition = f'attachment; filename="{result_filename}"'
        except UnicodeEncodeError:
            # 包含非 ASCII 字符，使用 RFC 5987 格式
            # 生成一个 ASCII 安全的 fallback 文件名
            safe_ascii_filename = f"result_{int(pd.Timestamp.now().timestamp() * 1000)}.xlsx"
            # URL 编码原始文件名用于 UTF-8 版本
            encoded_filename = quote(result_filename, safe='')
            # 使用 RFC 5987 格式：filename 是 ASCII fallback，filename* 是 UTF-8 版本
            content_disposition = f'attachment; filename="{safe_ascii_filename}"; filename*=UTF-8\'\'{encoded_filename}'
        
        return StreamingResponse(
            io.BytesIO(output.getvalue()),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": content_disposition
            }
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        # ValueError 通常是业务逻辑错误（如找不到列），返回 400
        print(f"❌ 业务逻辑错误: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"❌ 错误: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"处理失败: {str(e)}")


def process_dataframe(df: pd.DataFrame, service_id: Optional[str], input_text: Optional[str]):
    """
    根据服务ID执行不同的数据处理逻辑
    
    返回:
    - 如果是文本报告服务，返回 str
    - 如果是文件处理服务，返回 pd.DataFrame
    """
    result_df = df.copy()
    
    # 根据不同的 service_id 执行不同的处理
    if service_id == "abfaf85c-9553-4d7b-9416-e3aff65e8587":  # Ex大名
        # ✅ Ex大名 处理逻辑：计算 50个评论以内的ASIN占比
        result_df = calculate_asin_ratio(df)
        
    elif service_id == "d144da99-d3e6-4b78-9cd5-70b1e4ced346":  # 筛选核心关键词
        # ✅ 筛选核心关键词逻辑
        result_df = filter_core_keywords(result_df)
        
    elif service_id == "65bb6f50-5087-488e-8f1b-350d4ed9fe00":  # 计算投产比
        # ✅ 计算投产比逻辑（返回文本报告）
        return calculate_roi(df)

    elif service_id == "b9f2b13e-2f4b-4a62-8b0e-d2f74d824230":  # 亚马逊顶级 Listing 专家 (GEO & COSMO 增强版)
        if input_text and input_text.strip():
            return f"【占位返回】已收到需求：{input_text.strip()}。请在后端接入正式生成逻辑。"
        return "【占位返回】请提供 input_text 以生成 Listing 文案。"
    
    # 注意：社媒选品法服务（7b83cf63-0ad0-4c11-8dc5-6d8c242fbfe6）已在 /process 端点开始处处理，不会到达这里
        
    else:
        # 默认处理
        result_df["处理状态"] = "已处理"
    
    return result_df


def find_column(df: pd.DataFrame, possible_names: list, column_index: Optional[int] = None) -> Optional[str]:
    """
    查找列名，支持多种可能的名称或列索引
    
    参数:
    - df: DataFrame
    - possible_names: 可能的列名列表（如 ["关键词", "A"]）
    - column_index: 列索引（如 0 表示第1列，6 表示第7列）
    
    返回:
    - 找到的列名，如果找不到则返回 None
    """
    # 先尝试按列名查找
    for name in possible_names:
        if name in df.columns:
            return name
    
    # 如果指定了列索引，尝试使用索引
    if column_index is not None and column_index < len(df.columns):
        return df.columns[column_index]
    
    return None


def parse_numeric(value) -> Optional[float]:
    """
    尝试将值解析为数值
    
    返回:
    - 如果成功解析为数值，返回 float
    - 如果无法解析，返回 None
    """
    if pd.isna(value):
        return None
    
    try:
        # 尝试直接转换为数值
        return float(value)
    except (ValueError, TypeError):
        # 尝试清理字符串后转换（移除空格、逗号等）
        try:
            cleaned = str(value).strip().replace(',', '').replace('，', '')
            return float(cleaned)
        except (ValueError, TypeError):
            return None


def filter_core_keywords(df: pd.DataFrame) -> pd.DataFrame:
    """
    筛选核心关键词
    
    逻辑：
    1. 找到关键词列、相关产品列、ABA周排名列
    2. 按"相关产品"列降序排序（数值优先，无法解析的视为最小值）
    3. 删除"ABA周排名"为空或无效的行
    4. 取前60行
    5. 只保留关键词列
    """
    # 1. 找到所需的列
    keyword_col = find_column(df, ["关键词", "A"], 0)  # 第1列（索引0）
    related_product_col = find_column(df, ["相关产品", "G"], 6)  # 第7列（索引6）
    aba_rank_col = find_column(df, ["ABA周排名", "ABA周排名", "I"], 8)  # 第9列（索引8）
    
    if not keyword_col:
        raise ValueError("未找到关键词列（关键词 或 A列）")
    if not related_product_col:
        raise ValueError("未找到相关产品列（相关产品 或 G列）")
    if not aba_rank_col:
        raise ValueError("未找到ABA周排名列（ABA周排名 或 I列）")
    
    # 2. 按"相关产品"列进行降序排序
    # 策略：分离数值和非数值，分别排序后合并
    # 创建辅助列：标识是否为数值
    df['_is_numeric'] = df[related_product_col].apply(lambda x: parse_numeric(x) is not None)
    df['_numeric_val'] = df[related_product_col].apply(lambda x: parse_numeric(x) if parse_numeric(x) is not None else float('-inf'))
    df['_str_val'] = df[related_product_col].astype(str).str.strip()
    
    # 分离数值和非数值行
    numeric_rows = df[df['_is_numeric']].copy()
    non_numeric_rows = df[~df['_is_numeric']].copy()
    
    # 对数值行按数值降序排序
    if len(numeric_rows) > 0:
        numeric_rows = numeric_rows.sort_values('_numeric_val', ascending=False)
    
    # 对非数值行按字符串降序排序
    if len(non_numeric_rows) > 0:
        # 使用字符串比较实现降序（简单方法：反转字符串后升序排序，再反转回来）
        # 或者直接使用负的 Unicode 码点值
        non_numeric_rows['_str_sort_key'] = non_numeric_rows['_str_val'].apply(
            lambda x: tuple(-ord(c) for c in x[:10]) if x else (float('inf'),)
        )
        non_numeric_rows = non_numeric_rows.sort_values('_str_sort_key', ascending=True).drop('_str_sort_key', axis=1)
    
    # 合并：数值行在前，非数值行在后
    df = pd.concat([numeric_rows, non_numeric_rows], ignore_index=True)
    
    # 清理辅助列
    df = df.drop(['_is_numeric', '_numeric_val', '_str_val'], axis=1)
    
    # 3. 删除"ABA周排名"为空或无效的行
    invalid_values = ['-', '—', 'NA', 'N/A', 'null', 'NULL', 'Null', '']
    
    def is_valid_aba_rank(value) -> bool:
        """判断ABA周排名是否有效"""
        if pd.isna(value):
            return False
        
        value_str = str(value).strip()
        if not value_str:
            return False
        
        # 检查是否为无效值（大小写不敏感）
        if value_str.upper() in [v.upper() for v in invalid_values]:
            return False
        
        return True
    
    # 过滤无效行
    mask = df[aba_rank_col].apply(is_valid_aba_rank)
    df = df[mask].copy()
    
    # 4. 取前60行
    df = df.head(60)
    
    # 5. 只保留关键词列
    result_df = df[[keyword_col]].copy()
    
    # 重命名列为"关键词"（统一输出格式）
    result_df.columns = ['关键词']
    
    return result_df


def clean_numeric_value(value) -> float:
    """
    清洗数值：去除逗号，转换为数值，无法解析的按 0 处理
    """
    if pd.isna(value):
        return 0.0
    
    try:
        # 转换为字符串，去除逗号和其他分隔符
        value_str = str(value).strip().replace(',', '').replace('，', '').replace(' ', '')
        # 尝试转换为浮点数
        return float(value_str)
    except (ValueError, TypeError):
        return 0.0


def calculate_roi(df: pd.DataFrame):
    """
    计算投产比（ROI）
    
    逻辑：
    1. 读取 Excel 数据并逐行遍历
    2. 对字段进行数值清洗（去除逗号，转换为数值，无法解析的按 0 处理）
    3. 累加计算全表数据（总点击量、总购买量）
    4. 计算加权竞价分子
    5. 读取第一个大于 0 的产品均价作为参考客单价
    6. 防止除以 0
    7. 计算核心指标（平均转化率、加权平均竞价、预估 ACOS）
    8. 整理为文本分析报告
    """
    # 1. 找到所需的列（根据 n8n 逻辑）
    click_col = find_column(df, ["周点击量", "E"], 4)  # E列（索引4，第5列）
    purchase_col = find_column(df, ["周购买量", "F"], 5)  # F列（索引5，第6列）
    bid_col = find_column(df, ["PPC竞价-最高($)", "PPC竞价-中位($)", "竞价-推荐", "竞价", "K"], 10)  # K列（索引10，第11列）
    price_col = find_column(df, ["产品均价-平均($)", "均价-平均", "产品均价", "客单价", "R"], 17)  # R列（索引17，第18列）
    
    if not click_col:
        raise ValueError("未找到周点击量列")
    if not purchase_col:
        raise ValueError("未找到周购买量列")
    if not bid_col:
        raise ValueError("未找到竞价列")
    if not price_col:
        raise ValueError("未找到产品均价列")
    
    # 2. 逐行遍历并清洗数据
    total_clicks = 0.0
    total_purchases = 0.0
    weighted_bid_sum = 0.0  # 加权竞价分子：竞价 × 点击量 的累加
    reference_price = 0.0  # 第一个大于 0 的产品均价
    
    for idx, row in df.iterrows():
        # 清洗数值
        clicks = clean_numeric_value(row[click_col])
        purchases = clean_numeric_value(row[purchase_col])
        bid = clean_numeric_value(row[bid_col])
        price = clean_numeric_value(row[price_col])
        
        # 累加总点击量和总购买量
        total_clicks += clicks
        total_purchases += purchases
        
        # 计算加权竞价分子（当点击量 > 0 且竞价 > 0 时）
        if clicks > 0 and bid > 0:
            weighted_bid_sum += bid * clicks
        
        # 读取第一个大于 0 的产品均价作为参考客单价
        if reference_price == 0.0 and price > 0:
            reference_price = price
    
    # 3. 防止除以 0
    if total_clicks == 0:
        total_clicks = 1.0
    if reference_price == 0.0:
        reference_price = 1.0
    
    # 4. 计算核心指标
    # 平均转化率 (%) = (总购买量 ÷ 总点击量) × 100
    conversion_rate = (total_purchases / total_clicks) * 100
    
    # 加权平均竞价 = (竞价 × 点击量之和) ÷ 总点击量
    weighted_avg_bid = weighted_bid_sum / total_clicks
    
    # 预估 ACOS (%) = 加权平均竞价 ÷ (客单价 × 转化率) × 100
    # 注意：转化率需要转换为小数（除以 100）
    if conversion_rate > 0:
        estimated_acos = (weighted_avg_bid / (reference_price * (conversion_rate / 100))) * 100
    else:
        estimated_acos = 0.0
    
    # 5. 整理为文本分析报告（根据 n8n 逻辑格式）
    report = f"""📊 卖家精灵关键词分析报告

🔹 数据行数: {len(df)} 行
🔹 总点击量: {total_clicks:,.0f} 次
🔹 总购买量: {total_purchases:,.0f} 单
🔹 参考客单价: ${reference_price:.2f}

📈 平均点击转化率: {conversion_rate:.2f}%
💰 加权平均建议竞价: ${weighted_avg_bid:.2f}"""
    
    if conversion_rate == 0:
        report += f"\n📉 预估总 ACOS: 无法计算 (无转化)"
    else:
        report += f"\n📉 预估总 ACOS: {estimated_acos:.2f}%"
    
    return report


def get_product_reviews_count(asin: str, max_retries: int = 2) -> int:
    """
    使用 RapidAPI 获取产品的评论数
    
    参数:
    - asin: 产品 ASIN
    - max_retries: 最大重试次数
    
    返回:
    - int: 评论数，如果失败返回 0
    """
    url = f"https://{RAPIDAPI_HOST}/top-product-reviews"
    params = {
        'asin': asin,
        'country': 'US'
    }
    headers = {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
    }
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # 从 API 响应中提取评论数
            # 根据 RapidAPI 的响应格式，可能需要调整这里的解析逻辑
            # 通常评论数可能在 data['reviews'] 的长度，或者 data['total_reviews'] 等字段
            if 'data' in data and isinstance(data['data'], list):
                # 如果返回的是评论列表，使用列表长度
                review_count = len(data['data'])
            elif 'total_reviews' in data:
                review_count = int(data['total_reviews'])
            elif 'reviews' in data and isinstance(data['reviews'], list):
                review_count = len(data['reviews'])
            elif 'rating_count' in data:
                review_count = int(data['rating_count'])
            else:
                # 尝试从响应中查找评论数字段
                review_count = 0
                # 可以添加更多解析逻辑
            
            return review_count
            
        except requests.exceptions.RequestException as e:
            print(f"  ⚠️ 获取 ASIN {asin} 评论数失败 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(0.5)  # 短暂延迟后重试
        except Exception as e:
            print(f"  ⚠️ 解析 ASIN {asin} 评论数失败 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(0.5)
    
    return 0


def search_amazon_natural_products(keyword: str, max_retries: int = 3) -> List[Dict[str, any]]:
    """
    在 Amazon 美国站搜索关键词，获取首页自然位 ASIN 及其评论数
    优先尝试 RapidAPI，如果失败则使用爬虫方式（参考 n8n 逻辑）
    
    参数:
    - keyword: 搜索关键词
    - max_retries: 最大重试次数
    
    返回:
    - List[Dict]: 每个元素包含 {'asin': 'B0XXX', 'ratingCount': 123} 或空列表（如果失败）
    """
    # 直接使用爬虫方式（参考 n8n 逻辑）
    # 注意：RapidAPI 可能没有搜索端点，所以直接使用爬虫
    url = f"https://www.amazon.com/s?k={quote(keyword)}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.amazon.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    for attempt in range(max_retries):
        try:
            # 添加延迟，避免被反爬虫
            if attempt > 0:
                time.sleep(2 ** attempt)  # 指数退避：2秒、4秒、8秒
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            # 获取 HTML 文本（参考 n8n 逻辑）
            html = response.text
            
            # Step 1️⃣：切分搜索结果块（参考 n8n 逻辑）
            # 使用正则表达式切分包含 data-component-type="s-search-result" 的 div
            blocks = re.split(r'<div[^>]+data-component-type="s-search-result"[^>]*>', html, flags=re.IGNORECASE)
            blocks = blocks[1:]  # 跳过第一个空块（切分前的部分）
            
            items = []
            
            # Step 2️⃣：循环解析 ASIN + 评论数（参考 n8n 逻辑）
            for raw in blocks:
                # 提取 ASIN（10位字母数字）
                asin_match = re.search(r'data-asin="([A-Z0-9]{10})"', raw, re.IGNORECASE)
                if not asin_match:
                    continue
                
                asin = asin_match.group(1)
                
                # 跳过广告（参考 n8n 逻辑：检测多个广告标识）
                is_sponsored = bool(re.search(
                    r'sp-sponsored-result|AdHolder|SponsoredAd|aria-label="Sponsored"|>Sponsored<',
                    raw,
                    re.IGNORECASE
                ))
                if is_sponsored:
                    continue
                
                # 提取评论数（参考 n8n 逻辑：尝试多种模式）
                rating_count = 0
                
                # 方法1：aria-label="X ratings"（最准确）
                rating_match = re.search(r'aria-label="([\d,]+)\s+ratings?"', raw, re.IGNORECASE)
                if rating_match:
                    try:
                        rating_count = int(rating_match.group(1).replace(',', ''))
                    except (ValueError, AttributeError):
                        pass
                
                # 方法2：>X ratings</a>
                if rating_count == 0:
                    rating_match = re.search(r'>\s*([\d,]+)\s+ratings?\s*</a>', raw, re.IGNORECASE)
                    if rating_match:
                        try:
                            rating_count = int(rating_match.group(1).replace(',', ''))
                        except (ValueError, AttributeError):
                            pass
                
                # 方法3：查找 "X ratings" 或 "X reviews"（更宽松）
                if rating_count == 0:
                    alt_match = re.search(r'([\d,]+)\s*(?:ratings?|reviews?)', raw, re.IGNORECASE)
                    if alt_match:
                        try:
                            rating_count = int(alt_match.group(1).replace(',', ''))
                        except (ValueError, AttributeError):
                            pass
                
                # 方法4：查找 data-rating-count 属性
                if rating_count == 0:
                    attr_match = re.search(r'data-rating-count="([\d,]+)"', raw, re.IGNORECASE)
                    if attr_match:
                        try:
                            rating_count = int(attr_match.group(1).replace(',', ''))
                        except (ValueError, AttributeError):
                            pass
                
                # 方法5：查找 span 中的数字模式（更宽松）
                if rating_count == 0:
                    # 查找类似 "1,234" 这样的数字，后面跟着 ratings/reviews
                    number_match = re.search(r'([\d]{1,3}(?:,\d{3})*)\s*(?:ratings?|reviews?)', raw, re.IGNORECASE)
                    if number_match:
                        try:
                            rating_count = int(number_match.group(1).replace(',', ''))
                        except (ValueError, AttributeError):
                            pass
                
                # 如果还是没找到，尝试查找任何包含数字和 ratings 的文本
                if rating_count == 0:
                    # 更宽松的匹配：任何数字后跟 ratings/reviews
                    loose_match = re.search(r'(\d+(?:,\d+)*)\s*(?:ratings?|reviews?)', raw, re.IGNORECASE)
                    if loose_match:
                        try:
                            rating_count = int(loose_match.group(1).replace(',', ''))
                        except (ValueError, AttributeError):
                            pass
                
                items.append({
                    'asin': asin,
                    'ratingCount': rating_count
                })
                
                # 调试：打印前几个产品的信息
                if len(items) <= 3:
                    print(f"    📌 ASIN: {asin}, 评论数: {rating_count}")
            
            # 如果找到了产品，返回结果
            if items:
                print(f"  ✅ 找到 {len(items)} 个自然位产品")
                print(f"  📊 评论数统计: 最小={min(p['ratingCount'] for p in items)}, 最大={max(p['ratingCount'] for p in items)}, 平均={sum(p['ratingCount'] for p in items) / len(items):.1f}")
                return items
            else:
                print(f"  ⚠️ 未找到任何产品")
                # 调试：检查是否是因为所有结果都是广告
                sponsored_count = 0
                for raw in blocks[:10]:  # 只检查前10个块
                    if re.search(r'sp-sponsored-result|AdHolder|SponsoredAd|aria-label="Sponsored"|>Sponsored<', raw, re.IGNORECASE):
                        sponsored_count += 1
                print(f"  🔍 调试信息: 前10个块中有 {sponsored_count} 个广告位")
                return []
            
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Amazon 搜索请求失败 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if attempt == max_retries - 1:
                print(f"❌ 无法获取关键词 '{keyword}' 的搜索结果")
                return []
        except Exception as e:
            print(f"⚠️ 解析 Amazon 搜索结果失败 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if attempt == max_retries - 1:
                print(f"❌ 无法解析关键词 '{keyword}' 的搜索结果")
                import traceback
                traceback.print_exc()
                return []
    
    return []


def calculate_asin_ratio(df: pd.DataFrame) -> pd.DataFrame:
    """
    计算 50个评论以内的ASIN占比
    
    逻辑：
    1. 找到"关键词"列（作为主键）
    2. 对每一行关键词，在 Amazon 搜索并获取首页自然位 ASIN
    3. 统计首页自然位 ASIN 总数
    4. 筛选评论数 < 50 的 ASIN
    5. 计算占比
    6. 在原表中插入新列"50个评论以内的ASIN占比"
    """
    # 1. 找到"关键词"列
    keyword_col = find_column(df, ["关键词", "关键词列", "Keyword", "A"], 0)
    
    if not keyword_col:
        raise ValueError("未找到'关键词'列，请确保 Excel 文件包含'关键词'列")
    
    # 2. 创建结果 DataFrame（复制原表）
    result_df = df.copy()
    
    # 3. 确定新列的插入位置（关键词列的右侧，即索引 +1）
    keyword_col_index = list(result_df.columns).index(keyword_col)
    new_col_name = "50个评论以内的ASIN占比"
    
    # 4. 初始化新列
    result_df[new_col_name] = "0.00%"
    
    # 5. 逐行处理关键词
    total_rows = len(result_df)
    print(f"📊 开始处理 {total_rows} 个关键词...")
    
    for idx, row in result_df.iterrows():
        keyword = str(row[keyword_col]).strip()
        
        if not keyword or keyword == 'nan' or keyword == '':
            print(f"⚠️ 第 {idx + 1} 行：关键词为空，跳过")
            continue
        
        print(f"🔍 [{idx + 1}/{total_rows}] 处理关键词: {keyword}")
        
        try:
            # 搜索 Amazon 获取首页自然位 ASIN
            products = search_amazon_natural_products(keyword)
            
            if not products:
                print(f"  ⚠️ 未找到搜索结果，使用默认值 0.00%")
                result_df.at[idx, new_col_name] = "0.00%"
                # 添加延迟，避免请求过快
                time.sleep(1)
                continue
            
            # Step 1️⃣ 过滤 Sponsored 广告块（参考 n8n 逻辑：二次过滤）
            # 注意：search_amazon_natural_products 已经过滤了大部分广告，这里保留所有
            filtered = products  # 已经过滤过了
            
            # 调试：打印产品信息
            print(f"  📊 获取到 {len(filtered)} 个自然位产品")
            if len(filtered) > 0:
                rating_counts = [p['ratingCount'] for p in filtered]
                print(f"  📊 评论数范围: 最小={min(rating_counts)}, 最大={max(rating_counts)}, 平均={sum(rating_counts)/len(rating_counts):.1f}")
                print(f"  📊 评论数详情（前5个）: {[p['ratingCount'] for p in filtered[:5]]}")
            
            # Step 2️⃣ 找出评论数低于 50 的自然位（参考 n8n 逻辑）
            low_ratings = [p for p in filtered if p['ratingCount'] < 50]
            
            print(f"  📊 评论数 < 50 的产品数: {len(low_ratings)}")
            
            # Step 3️⃣ 计算占比（参考 n8n 逻辑）
            # 分子：低评论数（<50）的自然位产品数量
            numerator = len(low_ratings)
            # 分母：去除广告后首页自然位总数
            denominator = len(filtered)
            
            # 计算占比（百分比，保留 2 位小数，参考 n8n 逻辑）
            if denominator > 0:
                ratio = (numerator / denominator) * 100
                ratio_percent = f"{ratio:.2f}%"
            else:
                ratio_percent = "0.00%"
            
            result_df.at[idx, new_col_name] = ratio_percent
            print(f"  ✅ 完成：总ASIN={denominator}, 低评论ASIN={numerator}, 占比={ratio_percent}")
            
            # 添加延迟，避免请求过快（每个关键词之间延迟 2 秒）
            time.sleep(2)
            
        except Exception as e:
            print(f"  ❌ 处理关键词 '{keyword}' 时出错: {str(e)}")
            result_df.at[idx, new_col_name] = "0.00%"
            import traceback
            traceback.print_exc()
            # 即使出错也添加延迟
            time.sleep(1)
    
    # 6. 将新列插入到关键词列的右侧
    cols = list(result_df.columns)
    cols.remove(new_col_name)
    insert_index = keyword_col_index + 1
    cols.insert(insert_index, new_col_name)
    result_df = result_df[cols]
    
    print(f"✅ 处理完成，已添加新列 '{new_col_name}'")
    return result_df


@app.post("/webhook/{webhook_path:path}")
async def webhook_handler(
    webhook_path: str,
    file: Optional[UploadFile] = File(None),
    data: Optional[str] = Form(None)
):
    """
    兼容 n8n webhook 格式的接口
    支持通过路径区分不同的服务
    """
    # 根据 webhook_path 映射到 service_id
    path_mapping = {
        "test-hook": "d144da99-d3e6-4b78-9cd5-70b1e4ced346",
        "d6898f17-a3dd-4171-9a74-24e5cbe67e16": "65bb6f50-5087-488e-8f1b-350d4ed9fe00",
    }
    
    service_id = path_mapping.get(webhook_path)
    input_text = None
    
    if data:
        try:
            data_dict = json.loads(data)
            input_text = data_dict.get("input_text")
        except:
            input_text = data
    
    if file:
        return await process_excel(file=file, service_id=service_id, input_text=input_text)
    else:
        raise HTTPException(status_code=400, detail="需要上传文件")


@app.get("/")
def read_root():
    return {
        "status": "running",
        "message": "Python Backend is Running!",
        "endpoints": {
            "/process": "处理 Excel 文件",
            "/webhook/{path}": "Webhook 接口（兼容 n8n）",
            "/docs": "API 文档"
        }
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "supabase_connected": supabase is not None}


# ============================================
# 社媒选品法服务 API 端点
# ============================================

@app.post("/api/jobs")
async def create_research_job(
    keyword: str = Form(...),
    service_id: Optional[str] = Form(None)
):
    """
    创建市场调研任务
    
    参数:
    - keyword: 调研关键词
    - service_id: 服务ID（可选）
    """
    job_id = str(uuid.uuid4())
    job_storage[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "keyword": keyword.strip(),
        "progress": 0.0,
        "sections": [{"title": f"章节{i+1}", "state": "pending"} for i in range(18)],
        "created_at": datetime.now().isoformat(),
        "artifacts": {
            "report_url": None,
            "image_url": None
        }
    }
    
    # 启动后台任务（使用 asyncio 在后台执行）
    asyncio.create_task(execute_research_job(job_id, keyword.strip()))
    
    return {"job_id": job_id, "status": "queued"}


@app.get("/api/jobs/{job_id}")
async def get_job_status(job_id: str):
    """
    查询任务进度
    """
    if job_id not in job_storage:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    job = job_storage[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "progress": job["progress"],
        "sections": job["sections"],
        "artifacts": job["artifacts"]
    }


@app.get("/api/jobs/{job_id}/report")
async def download_report(job_id: str):
    """
    下载 Word 报告
    """
    if job_id not in job_storage:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    job = job_storage[job_id]
    if "report_path" not in job.get("artifacts", {}):
        raise HTTPException(status_code=404, detail="报告尚未生成")
    
    report_path = job["artifacts"]["report_path"]
    if not os.path.exists(report_path):
        raise HTTPException(status_code=404, detail="报告文件不存在")
    
    with open(report_path, "rb") as f:
        content = f.read()
    
    return StreamingResponse(
        io.BytesIO(content),
        media_type="application/msword",
        headers={
            "Content-Disposition": 'attachment; filename="Market_Research_Report.doc"'
        }
    )


@app.get("/api/jobs/{job_id}/image")
async def get_image(job_id: str):
    """
    获取生成的图片
    """
    if job_id not in job_storage:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    job = job_storage[job_id]
    if "image_path" not in job.get("artifacts", {}):
        raise HTTPException(status_code=404, detail="图片尚未生成")
    
    image_path = job["artifacts"]["image_path"]
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="图片文件不存在")
    
    with open(image_path, "rb") as f:
        content = f.read()
    
    return StreamingResponse(
        io.BytesIO(content),
        media_type="image/png",
        headers={
            "Content-Disposition": f'inline; filename="product_image.png"'
        }
    )


# ============================================
# 社媒选品法服务核心逻辑
# ============================================

# 18 个章节任务定义（与 n8n 完全一致）
RESEARCH_TASKS = [
    {"section_title": "调研总结", "search_query_template": "{keyword} market opportunity analysis growth drivers", "writing_instruction_template": "市场容量趋势、是否值得进入（明确结论）、细分策略、差异化路径、强相关执行建议"},
    {"section_title": "市场容量", "search_query_template": "{keyword} market size CAGR seasonal trends", "writing_instruction_template": "市场规模、生命周期、季节性；无直接数据给替代方案（竞品推估/关联市场外推）"},
    {"section_title": "市场竞争", "search_query_template": "{keyword} top brands competitors market share", "writing_instruction_template": "Top5 品牌：国家、成立时间、定位、核心竞争力、尝试推算份额"},
    {"section_title": "产品认知", "search_query_template": "what is {keyword} definition types usage", "writing_instruction_template": "功能/材质/安全/场景/趋势/价格/痛点等科普"},
    {"section_title": "产品功能", "search_query_template": "{keyword} features categories cost types", "writing_instruction_template": "主流款式功能差异；平均成本结构推估"},
    {"section_title": "产品结构", "search_query_template": "{keyword} materials construction components", "writing_instruction_template": "BOM 拆解：材料、结构层次、核心部件、成本占比估算"},
    {"section_title": "趋势元素", "search_query_template": "{keyword} design trends 2024 2025", "writing_instruction_template": "颜色、外观、工艺、参数、智能化趋势"},
    {"section_title": "受众特征", "search_query_template": "{keyword} buyer persona demographics", "writing_instruction_template": "年龄、性别、职业、收入、教育、偏好、场景"},
    {"section_title": "受众需求", "search_query_template": "{keyword} customer needs buying factors wishlist", "writing_instruction_template": "Top20 购买动机 + Top20 未满足需求，做占比排序"},
    {"section_title": "受众购买产品", "search_query_template": "{keyword} frequently bought together accessories", "writing_instruction_template": "互补产品与同类客群常一起购买品类"},
    {"section_title": "受众问题", "search_query_template": "{keyword} common questions faq", "writing_instruction_template": "Top20 常见问题与关注点"},
    {"section_title": "受众反馈", "search_query_template": "{keyword} reviews complaints pain points", "writing_instruction_template": "区分正向/负向，分析解决路径"},
    {"section_title": "产品认证", "search_query_template": "{keyword} certifications regulations", "writing_instruction_template": "出口认证（FDA/CE/RoHS 等）与费用周期（若适用）"},
    {"section_title": "风险把控", "search_query_template": "{keyword} safety risks quality control", "writing_instruction_template": "材料/结构/功能/安全/供应链风险与对策"},
    {"section_title": "SWOT分析", "search_query_template": "{keyword} SWOT analysis", "writing_instruction_template": "SWOT + 进入可行性评分 0–10"},
    {"section_title": "KANO模型分析", "search_query_template": "{keyword} must have vs delighter features", "writing_instruction_template": "必备/期望/魅力/无差异/反向需求"},
    {"section_title": "细分市场", "search_query_template": "{keyword} niche markets segments", "writing_instruction_template": "推荐 5 个细分市场，选 1 个深挖"},
    {"section_title": "开发建议", "search_query_template": "{keyword} innovation ideas product improvement", "writing_instruction_template": "材料/外观/颜色/功能/细节五维差异化，并说明为什么用户买单"}
]


# ============================================
# 步骤 1: SERP API 调用和数据清理
# ============================================

async def fetch_serp_data(search_query: str, max_retries: int = 3) -> Dict:
    """
    调用 SERP API 获取搜索结果
    
    参数:
    - search_query: 搜索查询
    - max_retries: 最大重试次数
    
    返回:
    - SERP API 返回的 JSON 数据
    """
    if not SERP_API_KEY:
        error_msg = "SERP_API_KEY 未配置或为空"
        print(f"❌ 错误: {error_msg}")
        return {}
    
    if is_placeholder_key(SERP_API_KEY):
        error_msg = "SERP_API_KEY 是占位符值，不是真实的API密钥"
        print(f"❌ 错误: {error_msg}")
        return {}
    
    params = {
        "api_key": SERP_API_KEY,
        "q": search_query,
        "gl": "us",
        "hl": "en"
    }
    
    for attempt in range(max_retries):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(SERP_API_URL, params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    elif response.status == 429:
                        # Rate limit，等待后重试
                        wait_time = (2 ** attempt) * 2
                        print(f"⚠️ SERP API 限流，等待 {wait_time} 秒后重试...")
                        await asyncio.sleep(wait_time)
                    else:
                        print(f"⚠️ SERP API 返回状态码: {response.status}")
                        if attempt < max_retries - 1:
                            await asyncio.sleep(2 ** attempt)
        except Exception as e:
            print(f"⚠️ SERP API 请求失败 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
    
    return {}


def clean_serp_data(serp_data: Dict, max_results: int = 8) -> str:
    """
    清理 SERP 数据，生成 cleaned_context（参考 n8n 逻辑）
    
    参数:
    - serp_data: SERP API 返回的原始数据
    - max_results: 最大结果数
    
    返回:
    - cleaned_context 字符串
    """
    def strip_html(html):
        if not html:
            return ''
        return re.sub(r'<[^>]*>', '', str(html)).strip()
    
    cleaned_context = ''
    
    # 提取 organic 结果
    organic_results = serp_data.get('organic', []) or serp_data.get('organic_results', [])
    organic_results = organic_results[:max_results]
    
    for idx, result in enumerate(organic_results):
        title = strip_html(result.get('title', ''))
        snippet = strip_html(result.get('snippet') or result.get('description', ''))
        date = result.get('date') or result.get('published_date', 'N/A')
        link = result.get('link') or result.get('url', '')
        
        cleaned_context += f"[Source {idx + 1}]: {title}\n"
        cleaned_context += f"Content: {snippet}\n"
        cleaned_context += f"Date: {date}\n"
        cleaned_context += f"Link: {link}\n\n"
    
    # 提取 People Also Ask
    people_also_ask = serp_data.get('people_also_ask', []) or serp_data.get('related_questions', [])
    if people_also_ask:
        cleaned_context += "\n--- People Also Ask / User Concerns ---\n\n"
        for idx, item in enumerate(people_also_ask):
            question = strip_html(item.get('question') or item.get('title', ''))
            answer = strip_html(item.get('answer') or item.get('snippet', ''))
            cleaned_context += f"Q{idx + 1}: {question}\n"
            if answer:
                cleaned_context += f"A: {answer}\n\n"
    
    return cleaned_context.strip()


# ============================================
# 步骤 2: OpenRouter LLM 调用
# ============================================

async def generate_section_content(
    section_title: str,
    writing_instruction: str,
    cleaned_context: str,
    keyword: str,
    max_retries: int = 3
) -> str:
    """
    使用 OpenRouter 生成章节内容
    
    参数:
    - section_title: 章节标题
    - writing_instruction: 写作指令
    - cleaned_context: 清理后的上下文
    - keyword: 关键词
    - max_retries: 最大重试次数
    
    返回:
    - 生成的 Markdown 内容
    """
    RULE = f"""
【通用写作原则 — 必须遵守】
1. 本报告所有内容必须与关键词「{keyword}」保持直接与强关联。
2. 禁止模型根据互联网常识、搜索结果、行业习惯自动扩展到其他品类。
3. 若抓取到的网页信息偏离「{keyword}」，这些内容必须丢弃。
4. 所有结论必须从「{keyword}」的特性出发，而不是同类产品或相关行业。
5. 如无法确认某信息是否属于「{keyword}」，必须视为不相关并排除。
"""
    
    system_message = f"""You are an expert Senior Product Manager and Market Analyst with 15 years of experience in Amazon product development. Your task is to write a highly granular, strategic market research report section based ONLY on the provided context.

CURRENT SECTION: 【 {section_title} 】

SPECIFIC INSTRUCTION FOR THIS SECTION:
{RULE}
{writing_instruction}

GENERAL RULES:
1. Tone: Professional, analytical, objective, and strategic. Avoid generic AI fluff.
2. Format: Use Markdown. Use bullet points, bold text for emphasis, and structured hierarchies.
3. Data: If the Context Data contains numbers (market size, price, percentage), cite them explicitly.
4. Missing Data: If the search context is insufficient, do NOT hallucinate. Instead, provide professional advice on how to get that data (e.g., 'Check Jungle Scout', 'Analyze Competitor Reviews').
5. Language: Output in CHINESE (Simplified), but keep professional terms (like 'CAGR', 'Breastmilk Cooler') in English where appropriate for clarity."""
    
    user_message = cleaned_context
    
    if not OPENROUTER_API_KEY:
        error_msg = "OPENROUTER_API_KEY 未配置或为空"
        print(f"❌ 错误: {error_msg}")
        return f"⚠️ 错误: {error_msg}\n\n请检查：\n1. 在 Railway 环境变量中设置 OPENROUTER_API_KEY\n2. 确保不是占位符值（如 __n8n_BLANK_VALUE_）\n3. 获取密钥: https://openrouter.ai/keys"
    
    if is_placeholder_key(OPENROUTER_API_KEY):
        error_msg = "OPENROUTER_API_KEY 是占位符值，不是真实的API密钥"
        print(f"❌ 错误: {error_msg}")
        return f"⚠️ 错误: {error_msg}\n\n请检查：\n1. 在 Railway 环境变量中设置真实的 OpenRouter API 密钥\n2. 获取密钥: https://openrouter.ai/keys\n3. 当前值看起来是占位符: {OPENROUTER_API_KEY[:50]}..."
    
    payload = {
        "model": "deepseek/deepseek-chat-v3-0324",
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7
    }
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    for attempt in range(max_retries):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    OPENROUTER_API_URL,
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        content = data.get('choices', [{}])[0].get('message', {}).get('content', '')
                        return content
                    elif response.status == 429:
                        wait_time = (2 ** attempt) * 2
                        print(f"⚠️ OpenRouter API 限流，等待 {wait_time} 秒后重试...")
                        await asyncio.sleep(wait_time)
                    else:
                        error_text = await response.text()
                        print(f"⚠️ OpenRouter API 返回状态码: {response.status}, 错误: {error_text}")
                        if attempt < max_retries - 1:
                            await asyncio.sleep(2 ** attempt)
        except Exception as e:
            print(f"⚠️ OpenRouter API 请求失败 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
    
    return ""


async def execute_research_job(job_id: str, keyword: str):
    """
    执行市场调研任务（异步后台任务）
    这是一个复杂的长时间任务，需要：
    1. 18 个章节的 SERP 搜索和 LLM 生成
    2. Amazon 产品搜索和详情页解析
    3. Gemini 图片编辑
    4. Word 报告生成
    """
    try:
        job_storage[job_id]["status"] = "running"
        job_storage[job_id]["progress"] = 0.0
        
        print(f"🚀 开始执行调研任务: {job_id}, 关键词: {keyword}")
        
        # 初始化章节状态
        sections_data = []
        for i, task in enumerate(RESEARCH_TASKS):
            sections_data.append({
                "title": task["section_title"],
                "state": "pending",
                "content": None
            })
        job_storage[job_id]["sections"] = sections_data
        
        # 步骤 1: 并发执行 SERP 搜索（限流 5）
        serp_semaphore = asyncio.Semaphore(5)
        serp_results = {}
        
        async def fetch_serp_with_limit(idx, task):
            async with serp_semaphore:
                search_query = task["search_query_template"].format(keyword=keyword)
                print(f"  📊 [{idx+1}/18] SERP 搜索: {task['section_title']}, 查询: {search_query}")
                job_storage[job_id]["sections"][idx]["state"] = "serp_fetching"
                result = await fetch_serp_data(search_query)
                print(f"  📊 [{idx+1}/18] SERP 响应: {len(str(result))} 字符")
                cleaned = clean_serp_data(result)
                print(f"  📊 [{idx+1}/18] SERP 清理后: {len(cleaned)} 字符")
                serp_results[idx] = cleaned
                job_storage[job_id]["sections"][idx]["state"] = "serp_done"
                job_storage[job_id]["progress"] = (idx + 1) / 18 * 0.3  # SERP 占 30% 进度
                return cleaned
        
        # 并发执行所有 SERP 搜索
        serp_tasks = [fetch_serp_with_limit(i, task) for i, task in enumerate(RESEARCH_TASKS)]
        await asyncio.gather(*serp_tasks)
        
        print(f"✅ SERP 搜索完成，开始 LLM 生成...")
        
        # 步骤 2: 并发执行 LLM 生成（限流 3，pipeline 模式）
        llm_semaphore = asyncio.Semaphore(3)
        llm_results = {}
        
        async def generate_with_limit(idx, task, cleaned_context):
            async with llm_semaphore:
                print(f"  ✍️ [{idx+1}/18] LLM 生成: {task['section_title']}")
                print(f"  ✍️ [{idx+1}/18] 输入上下文长度: {len(cleaned_context)} 字符")
                job_storage[job_id]["sections"][idx]["state"] = "llm_writing"
                # 构建完整的写作指令（包含 RULE）
                keyword_rule = f"""
【通用写作原则 — 必须遵守】
1. 本报告所有内容必须与关键词「{keyword}」保持直接与强关联。
2. 禁止模型根据互联网常识、搜索结果、行业习惯自动扩展到其他品类。
3. 若抓取到的网页信息偏离「{keyword}」，这些内容必须丢弃。
4. 所有结论必须从「{keyword}」的特性出发，而不是同类产品或相关行业。
5. 如无法确认某信息是否属于「{keyword}」，必须视为不相关并排除。
"""
                writing_instruction = keyword_rule + "\n" + task["writing_instruction_template"]
                
                # ✅ 修复：检查 cleaned_context 是否为空
                if not cleaned_context or not cleaned_context.strip():
                    error_msg = f"SERP 数据为空，无法生成内容"
                    print(f"  ❌ [{idx+1}/18] 错误: {error_msg}")
                    job_storage[job_id]["sections"][idx]["state"] = "failed"
                    job_storage[job_id]["sections"][idx]["error"] = error_msg
                    llm_results[idx] = f"⚠️ 错误: {error_msg}"
                    return f"⚠️ 错误: {error_msg}"
                
                content = await generate_section_content(
                    task["section_title"],
                    writing_instruction,
                    cleaned_context,
                    keyword
                )
                print(f"  ✍️ [{idx+1}/18] LLM 输出: {len(content) if content else 0} 字符")
                
                # ✅ 修复：如果内容为空，标记为失败并重试一次
                if not content or not content.strip():
                    print(f"  ⚠️ [{idx+1}/18] 警告: LLM 返回空内容，尝试重试...")
                    # 重试一次
                    content = await generate_section_content(
                        task["section_title"],
                        writing_instruction,
                        cleaned_context,
                        keyword,
                        max_retries=2
                    )
                    
                    if not content or not content.strip():
                        error_msg = f"LLM API 返回空内容（可能是 API 密钥错误、网络问题或限流）"
                        print(f"  ❌ [{idx+1}/18] 错误: {error_msg}")
                        job_storage[job_id]["sections"][idx]["state"] = "failed"
                        job_storage[job_id]["sections"][idx]["error"] = error_msg
                        # 设置一个占位内容，而不是完全空
                        content = f"⚠️ 错误: {error_msg}\n\n请检查：\n1. OPENROUTER_API_KEY 是否正确配置\n2. 网络连接是否正常\n3. API 是否被限流"
                    else:
                        print(f"  ✅ [{idx+1}/18] 重试成功，生成内容: {len(content)} 字符")
                        job_storage[job_id]["sections"][idx]["state"] = "llm_done"
                else:
                    job_storage[job_id]["sections"][idx]["state"] = "llm_done"
                
                llm_results[idx] = content
                job_storage[job_id]["sections"][idx]["content"] = content
                job_storage[job_id]["progress"] = 0.3 + (idx + 1) / 18 * 0.4  # LLM 占 40% 进度
                return content
        
        # Pipeline: SERP 完成后立即开始 LLM（但限流）
        # 这里简化处理：等待所有 SERP 完成后再开始 LLM
        llm_tasks = [
            generate_with_limit(i, task, serp_results[i])
            for i, task in enumerate(RESEARCH_TASKS)
        ]
        await asyncio.gather(*llm_tasks)
        
        print(f"✅ LLM 生成完成，开始生成报告...")
        
        # 调试：检查 llm_results
        print(f"🔍 调试信息 - llm_results 键数量: {len(llm_results)}")
        empty_count = 0
        failed_count = 0
        success_count = 0
        
        for idx, content in llm_results.items():
            content_preview = content[:100] if content else "(空)"
            content_len = len(content) if content else 0
            
            if not content or not content.strip():
                empty_count += 1
                print(f"  ❌ 章节 {idx}: {content_len} 字符 (空), 预览: {content_preview}")
            elif content.strip().startswith("⚠️ 错误:"):
                failed_count += 1
                print(f"  ⚠️ 章节 {idx}: {content_len} 字符 (失败), 预览: {content_preview}")
            else:
                success_count += 1
                print(f"  ✅ 章节 {idx}: {content_len} 字符, 预览: {content_preview}")
        
        print(f"📊 章节生成统计: 成功={success_count}, 失败={failed_count}, 空={empty_count}, 总计={len(llm_results)}")
        
        # ✅ 修复：如果所有章节都失败或为空，提前终止任务
        if success_count == 0:
            error_msg = f"所有章节生成失败：成功={success_count}, 失败={failed_count}, 空={empty_count}"
            print(f"❌ {error_msg}")
            job_storage[job_id]["status"] = "failed"
            job_storage[job_id]["error"] = error_msg
            job_storage[job_id]["progress"] = 0.7
            return
        
        # 步骤 3: 生成 Word 报告
        job_storage[job_id]["progress"] = 0.7
        report_path = await generate_word_report(job_id, keyword, llm_results)
        job_storage[job_id]["artifacts"]["report_path"] = report_path
        job_storage[job_id]["progress"] = 0.8
        
        # ✅ 修复：验证报告文件是否存在且有内容
        if os.path.exists(report_path):
            file_size = os.path.getsize(report_path)
            print(f"📄 报告文件已生成: {report_path}, 大小: {file_size} 字节")
            if file_size < 1000:  # 如果文件小于1KB，可能只有标题
                print(f"⚠️ 警告: 报告文件很小，可能内容不完整")
        else:
            print(f"❌ 错误: 报告文件不存在: {report_path}")
        
        # 步骤 4: 提取开发建议并生成视觉 prompt
        dev_suggestion = extract_dev_suggestion(llm_results)
        visual_prompt = await generate_visual_prompt(dev_suggestion)
        job_storage[job_id]["artifacts"]["dev_suggestion"] = dev_suggestion
        job_storage[job_id]["artifacts"]["visual_prompt"] = visual_prompt
        
        # 步骤 5: Amazon 搜索和详情页解析
        amazon_products = await fetch_amazon_products(keyword)
        job_storage[job_id]["artifacts"]["amazon_products"] = amazon_products
        
        # 步骤 6: Gemini 图片编辑
        if visual_prompt and amazon_products:
            image_path = await generate_product_image(visual_prompt, amazon_products)
            job_storage[job_id]["artifacts"]["image_path"] = image_path
        
        job_storage[job_id]["status"] = "done"
        job_storage[job_id]["progress"] = 1.0
        print(f"✅ 调研任务完成: {job_id}")
        
    except Exception as e:
        job_storage[job_id]["status"] = "failed"
        job_storage[job_id]["error"] = str(e)
        print(f"❌ 调研任务失败: {job_id}, 错误: {str(e)}")
        import traceback
        traceback.print_exc()


# ============================================
# 步骤 3: Word 报告生成
# ============================================

def markdown_to_html(text: str) -> str:
    """简单的 Markdown 转 HTML"""
    if not text:
        return ""
    
    html = text
    # 转义 HTML 特殊字符
    html = html.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # 标题
    html = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*$)', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    # 加粗
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    # 列表
    html = re.sub(r'^- (.*$)', r'<li>\1</li>', html, flags=re.MULTILINE)
    # 换行
    html = html.replace('\n', '<br>')
    
    return html


async def generate_word_report(job_id: str, keyword: str, sections_content: Dict[int, str]) -> str:
    """
    生成 Word 报告（HTML 伪装为 .doc）
    
    返回:
    - 报告文件路径
    """
    html_content = f"""
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Market Research Report</title>
<style>
    body {{ font-family: 'Microsoft YaHei', sans-serif; line-height: 1.6; }}
    h1 {{ color: #2E75B6; border-bottom: 2px solid #2E75B6; padding-bottom: 10px; }}
    h2 {{ color: #1F4E79; margin-top: 20px; background-color: #F2F2F2; padding: 5px; }}
    h3 {{ color: #333; }}
    strong {{ color: #C00000; }}
    p {{ margin-bottom: 10px; }}
    li {{ margin-bottom: 5px; }}
    hr {{ border: 0; border-top: 1px solid #ccc; margin: 30px 0; }}
    .error {{ color: #C00000; background-color: #FFE6E6; padding: 10px; margin: 10px 0; }}
</style>
</head><body>
<h1>全网产品深度调研报告</h1>
<p>关键词: {keyword}</p>
<p>Generated by AI Agent</p>
<hr>
"""
    
    # 按顺序添加所有章节
    empty_sections = []
    failed_sections = []
    total_sections = len(RESEARCH_TASKS)
    successful_sections = 0
    
    for i, task in enumerate(RESEARCH_TASKS):
        content = sections_content.get(i, "")
        if content and content.strip():
            # ✅ 修复：检查内容是否以 "⚠️ 错误:" 开头（表示失败）
            if content.strip().startswith("⚠️ 错误:"):
                failed_sections.append({
                    "title": task['section_title'],
                    "error": content.strip()
                })
                html_content += f"<h2>{task['section_title']}</h2>"
                html_content += f"<div class='error'>{markdown_to_html(content)}</div>"
                html_content += "<hr>"
            else:
                html_content += f"<h2>{task['section_title']}</h2>"
                html_content += markdown_to_html(content)
                html_content += "<hr>"
                successful_sections += 1
        else:
            empty_sections.append(task['section_title'])
            print(f"⚠️ 警告: 章节 '{task['section_title']}' 内容为空")
    
    # ✅ 修复：如果有失败或空章节，添加详细的错误提示
    if empty_sections or failed_sections:
        html_content += f"<div class='error'><h2>⚠️ 报告生成警告</h2>"
        html_content += f"<p><strong>成功生成章节: {successful_sections}/{total_sections}</strong></p>"
        
        if failed_sections:
            html_content += f"<p><strong>失败的章节 ({len(failed_sections)} 个):</strong></p><ul>"
            for section in failed_sections:
                html_content += f"<li><strong>{section['title']}</strong>: {section['error']}</li>"
            html_content += "</ul>"
        
        if empty_sections:
            html_content += f"<p><strong>内容为空的章节 ({len(empty_sections)} 个):</strong></p><ul>"
            for section_title in empty_sections:
                html_content += f"<li>{section_title}</li>"
            html_content += "</ul>"
        
        html_content += "<p><strong>请检查：</strong></p><ul>"
        html_content += "<li>SERP_API_KEY 是否正确配置（环境变量 SERP_API_KEY）</li>"
        html_content += "<li>OPENROUTER_API_KEY 是否正确配置（环境变量 OPENROUTER_API_KEY）</li>"
        html_content += "<li>网络连接是否正常</li>"
        html_content += "<li>API 是否被限流（查看后端日志）</li>"
        html_content += "<li>API 密钥是否有足够的额度</li>"
        html_content += "</ul></div>"
    
    # ✅ 修复：如果所有章节都失败或为空，添加严重警告
    if successful_sections == 0:
        html_content += f"<div class='error' style='background-color: #FFE6E6; border: 2px solid #C00000; padding: 20px; margin: 20px 0;'>"
        html_content += f"<h2 style='color: #C00000;'>❌ 严重错误：报告生成失败</h2>"
        html_content += f"<p>所有 {total_sections} 个章节都未能成功生成内容。这通常意味着：</p>"
        html_content += "<ol>"
        html_content += "<li><strong>API 密钥未配置或错误</strong>：请检查环境变量 OPENROUTER_API_KEY 和 SERP_API_KEY</li>"
        html_content += "<li><strong>API 调用失败</strong>：请查看后端日志了解详细错误信息</li>"
        html_content += "<li><strong>网络问题</strong>：后端无法访问 OpenRouter 或 SerpAPI</li>"
        html_content += "<li><strong>API 限流</strong>：请求过于频繁，请稍后重试</li>"
        html_content += "</ol>"
        html_content += "<p><strong>建议操作：</strong></p>"
        html_content += "<ol>"
        html_content += "<li>检查后端日志（Railway/服务器日志）</li>"
        html_content += "<li>验证 API 密钥是否正确配置</li>"
        html_content += "<li>检查 API 账户余额和限制</li>"
        html_content += "<li>联系技术支持</li>"
        html_content += "</ol>"
        html_content += "</div>"
    
    html_content += "</body></html>"
    
    # 保存文件
    os.makedirs(f"/tmp/research_jobs/{job_id}", exist_ok=True)
    report_path = f"/tmp/research_jobs/{job_id}/Market_Research_Report.doc"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    return report_path


# ============================================
# 步骤 4: 开发建议提取和视觉 prompt 生成
# ============================================

def extract_dev_suggestion(sections_content: Dict[int, str]) -> str:
    """
    提取"开发建议"章节内容
    """
    # 优先查找标题包含"开发建议"的章节
    for i, task in enumerate(RESEARCH_TASKS):
        if "开发建议" in task["section_title"]:
            return sections_content.get(i, "")
    
    # 其次查找内容包含"【开发建议】"的章节
    for i, content in sections_content.items():
        if "【开发建议】" in content:
            return content
    
    # 最后取最后一章（通常是开发建议）
    if sections_content:
        last_idx = max(sections_content.keys())
        return sections_content.get(last_idx, "")
    
    return ""


async def generate_visual_prompt(dev_suggestion: str, max_retries: int = 3) -> str:
    """
    生成英文视觉 prompt（参考 n8n 逻辑）
    """
    system_message = """You are an expert AI Product Design Prompter for Stable Diffusion (Flux/SDXL). 

### Your Task:
Transform the user's "Development Suggestions" (text) into a set of **visual keywords (English)** for an AI Image Generator.

### Output Requirement:
Output **ONLY** the English Prompt string. Do not output explanations.

### Output Format (Strictly follow this structure):
(Best quality, 8k, masterpiece, product photography), [Subject: Smart Breastmilk Cooler], [Key Features: LED screen, magnetic latch, modular], [Material: Matte plastic, Cooling Gel], [Colors], [Lighting: Studio soft box], [Angle: Front view or Open view]"""
    
    payload = {
        "model": "deepseek/deepseek-chat-v3-0324",
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": dev_suggestion}
        ],
        "temperature": 0.7
    }
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    for attempt in range(max_retries):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    OPENROUTER_API_URL,
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=60)
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        prompt = data.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
                        return prompt
                    elif response.status == 429:
                        await asyncio.sleep((2 ** attempt) * 2)
                    else:
                        if attempt < max_retries - 1:
                            await asyncio.sleep(2 ** attempt)
        except Exception as e:
            print(f"⚠️ 视觉 prompt 生成失败 (尝试 {attempt + 1}/{max_retries}): {str(e)}")
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)
    
    return ""


# ============================================
# 步骤 5: Amazon 搜索和详情页解析
# ============================================

async def fetch_amazon_products(keyword: str) -> List[Dict]:
    """
    搜索 Amazon 并获取 Top3 自然位 ASIN，然后解析详情页
    """
    # Amazon 搜索
    search_url = f"https://www.amazon.com/s?k={quote(keyword)}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.amazon.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"'
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(search_url, headers=headers, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    html = await response.text()
                    # 提取 Top3 自然位 ASIN（参考 n8n 逻辑）
                    top3_asins = extract_top3_natural_asins(html)
                    
                    # 并发获取详情页
                    products = []
                    async with asyncio.Semaphore(2):  # 限流 2
                        for asin in top3_asins:
                            product = await fetch_amazon_product_detail(asin)
                            if product:
                                products.append(product)
                    
                    return products
    except Exception as e:
        print(f"⚠️ Amazon 搜索失败: {str(e)}")
    
    return []


def extract_top3_natural_asins(html: str) -> List[str]:
    """
    从 Amazon 搜索页提取 Top3 自然位 ASIN（参考 n8n 逻辑）
    """
    natural_items = []
    
    # 匹配 search-result 块
    blocks = re.finditer(r'<div[^>]+data-component-type="s-search-result"[^>]*>', html, re.IGNORECASE)
    
    for match in blocks:
        open_tag = match.group(0)
        block_start = match.start()
        block = html[block_start:block_start + 2000]
        
        # 必须是 listitem
        if not re.search(r'role="listitem"', open_tag, re.IGNORECASE):
            continue
        
        # 提取 ASIN
        asin_match = re.search(r'data-asin="(B0[A-Z0-9]{9})"', open_tag, re.IGNORECASE)
        if not asin_match:
            continue
        asin = asin_match.group(1)
        
        # 提取 index
        index_match = re.search(r'data-index="(\d+)"', open_tag, re.IGNORECASE)
        if not index_match:
            continue
        index = int(index_match.group(1))
        
        # 排除 Sponsored
        if re.search(r'Sponsored|s-sponsored-label-text|puis-sponsored-label', block, re.IGNORECASE):
            continue
        
        natural_items.append({"asin": asin, "index": index})
    
    # 排序并取 Top3
    natural_items.sort(key=lambda x: x["index"])
    return [item["asin"] for item in natural_items[:3]]


async def fetch_amazon_product_detail(asin: str) -> Optional[Dict]:
    """
    获取 Amazon 产品详情页并解析（参考 n8n Python 代码）
    """
    url = f"https://www.amazon.com/dp/{asin}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.amazon.com/',
        'Upgrade-Insecure-Requests': '1'
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    html = await response.text()
                    return parse_amazon_detail_page(html, asin)
    except Exception as e:
        print(f"⚠️ 获取 ASIN {asin} 详情失败: {str(e)}")
    
    return None


def parse_amazon_detail_page(html: str, asin: str) -> Dict:
    """
    解析 Amazon 详情页（参考 n8n Python 代码逻辑）
    """
    # 这里需要实现完整的解析逻辑（参考你提供的 Python 代码）
    # 由于代码很长，我先实现基础版本
    
    def html_unescape(text):
        if not text:
            return text
        replacements = {
            "&quot;": '"', "&#34;": '"', "&apos;": "'", "&#39;": "'",
            "&amp;": "&", "&lt;": "<", "&gt;": ">", "&nbsp;": " "
        }
        for k, v in replacements.items():
            text = text.replace(k, v)
        text = re.sub(r'&#(\d+);', lambda m: chr(int(m.group(1))), text)
        return text
    
    def clean(text):
        if not text:
            return ""
        text = html_unescape(text)
        text = re.sub(r'<(style|script)[^>]*>.*?</\1>', ' ', text, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'[\u200e\u200f]', '', text)
        text = text.replace('&nbsp;', ' ')
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def parse_dimensions_complex(text):
        if not text:
            return None
        text_lower = text.lower()
        strict_match = re.search(r'(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)\s*[xX]\s*(\d+(?:\.\d+)?)', text)
        dims = []
        if strict_match:
            dims = [float(strict_match.group(1)), float(strict_match.group(2)), float(strict_match.group(3))]
        else:
            numbers = re.findall(r'(\d+(?:\.\d+)?)', text)
            if len(numbers) >= 3:
                dims = [float(numbers[0]), float(numbers[1]), float(numbers[2])]
        
        if len(dims) == 3:
            try:
                if 'cm' in text_lower or 'centimeters' in text_lower:
                    dims = [d / 2.54 for d in dims]
                elif 'mm' in text_lower or 'millimeters' in text_lower:
                    dims = [d / 25.4 for d in dims]
                return sorted(dims, reverse=True)
            except:
                pass
        return None
    
    def extract_dimensions_and_weight_from_text(html_text):
        clean_text = clean(html_text)
        found_dims = None
        found_raw_text = ""
        found_weight = 0.0
        found_weight_unit = ""
        
        keys = ["Product Dimensions", "Package Dimensions", "Item Dimensions", "Dimensions"]
        for key in keys:
            pattern = rf'{key}\s*[:\-]?\s*(\d+(?:\.\d+)?\s*[xX]\s*\d+(?:\.\d+)?\s*[xX]\s*\d+(?:\.\d+)?\s*[a-zA-Z]*)'
            match = re.search(pattern, clean_text, re.IGNORECASE)
            if match:
                raw_val = match.group(1)
                parsed = parse_dimensions_complex(raw_val)
                if parsed:
                    found_dims = parsed
                    found_raw_text = raw_val
                    start_pos = match.end()
                    nearby_text = clean_text[start_pos:start_pos + 50]
                    w_match = re.search(r'[;,\s]\s*(\d+(?:\.\d+)?)\s*(pounds?|lbs?|ounces?|oz|grams?|g|kg|kilograms?)', nearby_text, re.IGNORECASE)
                    if w_match:
                        found_weight = float(w_match.group(1))
                        found_weight_unit = w_match.group(2).lower()
                    break
        
        return found_dims, found_raw_text, found_weight, found_weight_unit
    
    def extract_weight_standalone(html_text):
        clean_text = clean(html_text)
        keys = ["Item Weight", "Product Weight", "Shipping Weight"]
        for key in keys:
            pattern = rf'{key}\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(pounds?|lbs?|ounces?|oz|grams?|g|kg|kilograms?)'
            match = re.search(pattern, clean_text, re.IGNORECASE)
            if match:
                return float(match.group(1)), match.group(2).lower()
        return 0.0, ""
    
    # 提取尺寸和重量
    t_dims, t_raw_text, t_weight, t_w_unit = extract_dimensions_and_weight_from_text(html)
    
    if t_dims:
        L, W, H = t_dims
        raw_dim_text = t_raw_text
    else:
        L, W, H = 0.0, 0.0, 0.0
        raw_dim_text = "NOT_FOUND_IN_TEXT"
    
    if t_weight > 0:
        w_val, w_unit = t_weight, t_w_unit
    else:
        w_val, w_unit = extract_weight_standalone(html)
    
    # 提取其他信息
    asin_match = re.search(r'<input[^>]+id="ASIN"[^>]+value="([^"]+)"', html, re.IGNORECASE)
    extracted_asin = asin_match.group(1) if asin_match else asin
    
    main_image_match = re.search(r'"hiRes":"([^"]+)"', html)
    main_image = main_image_match.group(1) if main_image_match else "IMAGE_NOT_FOUND"
    
    price_match = re.search(r'class="a-price-whole">\s*([\d,]+)(?:<[^>]+>)*class="a-price-fraction">\s*(\d+)', html)
    price = 0.0
    if price_match:
        try:
            price = float(f"{price_match.group(1).replace(',', '')}.{price_match.group(2)}")
        except:
            pass
    
    clean_text = clean(html)
    bsr_match = re.search(r'#[\d,]+\s+in\s+([^(<]+?)(?:\(|$)', clean_text, re.IGNORECASE)
    bsr_category = bsr_match.group(1).strip().replace("&", "and") if bsr_match else ""
    bsr_category = re.sub(r'\s+', ' ', bsr_category)
    
    # FBA 计算
    weight_lb = w_val
    if "oz" in w_unit or "ounce" in w_unit:
        weight_lb = w_val / 16
    elif "kg" in w_unit or "kilo" in w_unit:
        weight_lb = w_val * 2.20462
    elif "g" in w_unit and "k" not in w_unit:
        weight_lb = w_val * 0.00220462
    
    dim_weight = (L * W * H) / 139
    ship_weight = max(weight_lb, dim_weight)
    girth = 2 * (W + H)
    
    fba_tier = "未分类"
    if ship_weight == 0 and L == 0:
        fba_tier = "数据缺失"
    elif weight_lb <= 1 and L <= 15 and W <= 12 and H <= 0.75:
        fba_tier = "小号标准尺寸"
    elif weight_lb <= 20 and L <= 18 and W <= 14 and H <= 8:
        fba_tier = "大号标准尺寸"
    elif weight_lb <= 50 and (L + girth) <= 130:
        fba_tier = "大号大件"
    else:
        fba_tier = "超大件"
    
    return {
        "asin": extracted_asin,
        "price": price,
        "bsr_category": bsr_category,
        "mainImage": main_image,
        "dimensions": {"length": round(L, 2), "width": round(W, 2), "height": round(H, 2)},
        "weights": {
            "actual_value": w_val,
            "actual_unit": w_unit,
            "shippingWeightLb": round(ship_weight, 2)
        },
        "fba_tier": fba_tier,
        "_debug": {
            "raw_dim_text_found": raw_dim_text
        }
    }


# ============================================
# 步骤 6: Gemini 图片编辑
# ============================================

async def generate_product_image(visual_prompt: str, amazon_products: List[Dict]) -> Optional[str]:
    """
    使用 Gemini 编辑图片
    """
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('google/gemini-3-pro-image-preview')
        
        # 下载参考图片
        async with aiohttp.ClientSession() as session:
            async with session.get(REFERENCE_IMAGE_URL) as response:
                if response.status == 200:
                    reference_image_bytes = await response.read()
                    
                    # 构建 prompt（参考 n8n 逻辑）
                    prompt = f"请你参考图中的产品，根据我们的subject中显示的名称，把key feature以图中的产品为基础进行作画 {visual_prompt}"
                    
                    # 调用 Gemini（这里需要根据实际 API 调整）
                    # 注意：Gemini Image Edit API 可能需要不同的调用方式
                    # 这里先返回占位符
                    print(f"⚠️ Gemini 图片编辑功能待实现（需要确认 API 调用方式）")
                    return None
    except Exception as e:
        print(f"⚠️ Gemini 图片编辑失败: {str(e)}")
        import traceback
        traceback.print_exc()
    
    return None


# 添加 RULE 常量（用于生成章节内容）
RULE = """
【通用写作原则 — 必须遵守】
1. 本报告所有内容必须与关键词保持直接与强关联。
2. 禁止模型根据互联网常识、搜索结果、行业习惯自动扩展到其他品类。
3. 若抓取到的网页信息偏离关键词，这些内容必须丢弃。
4. 所有结论必须从关键词的特性出发，而不是同类产品或相关行业。
5. 如无法确认某信息是否属于关键词，必须视为不相关并排除。
"""


# ============================================
# 关键词词库搭建工具 API 端点
# ============================================

from services.keyword_processor import KeywordProcessor

# 文件类型映射
KEYWORD_FILE_TYPES = [
    "h10_main", "self_asin", "competitor_aba",
    "competitor_1", "competitor_2", "competitor_3", "competitor_4", "competitor_5",
    "competitor_6", "competitor_7", "competitor_8", "competitor_9", "competitor_10",
    "keyword_base"
]


@app.post("/api/keyword-tool/process")
async def process_keyword_task(task_id: str = Form(...)):
    """
    处理关键词分类任务
    从 Supabase Storage 读取文件，处理后上传结果
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase 未配置")
    
    try:
        # 1. 更新任务状态为处理中
        supabase.table("keyword_tasks").update({
            "status": "processing",
            "progress": 5
        }).eq("id", task_id).execute()
        
        # 2. 获取任务文件列表
        files_response = supabase.table("keyword_task_files").select("*").eq("task_id", task_id).execute()
        files_data = {f["file_type"]: f for f in files_response.data}
        
        # 3. 下载所有文件
        file_contents = {}
        
        def update_progress(progress: int, message: str = ""):
            try:
                supabase.table("keyword_tasks").update({
                    "progress": progress
                }).eq("id", task_id).execute()
            except:
                pass
        
        for file_type in KEYWORD_FILE_TYPES:
            if file_type in files_data:
                file_info = files_data[file_type]
                try:
                    response = supabase.storage.from_("keyword-files").download(file_info["storage_path"])
                    file_contents[file_type] = response
                except Exception as e:
                    print(f"下载文件失败 {file_type}: {str(e)}")
        
        update_progress(30, "文件下载完成")
        
        # 4. 验证必需文件
        required_files = ["h10_main", "self_asin", "competitor_aba", "keyword_base"]
        missing = [f for f in required_files if f not in file_contents]
        if missing:
            raise ValueError(f"缺少必需文件: {', '.join(missing)}")
        
        # 5. 处理关键词
        processor = KeywordProcessor()
        processor.set_progress_callback(update_progress)
        
        # 获取竞品文件列表
        competitors = []
        for i in range(1, 11):
            comp_key = f"competitor_{i}"
            if comp_key in file_contents:
                competitors.append(file_contents[comp_key])
        
        result_content = processor.process(
            h10_main=file_contents["h10_main"],
            self_asin=file_contents["self_asin"],
            competitor_aba=file_contents["competitor_aba"],
            competitors=competitors,
            keyword_base=file_contents["keyword_base"]
        )
        
        # 6. 上传结果文件
        result_path = f"{task_id}/result_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        supabase.storage.from_("keyword-files").upload(
            result_path,
            result_content,
            {"content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
        )
        
        # 7. 更新任务状态为成功
        supabase.table("keyword_tasks").update({
            "status": "success",
            "progress": 100,
            "result_url": result_path
        }).eq("id", task_id).execute()
        
        return JSONResponse({"success": True, "result_url": result_path})
        
    except Exception as e:
        print(f"❌ 关键词处理失败: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # 更新任务状态为失败
        if supabase:
            supabase.table("keyword_tasks").update({
                "status": "failed",
                "error_msg": str(e)
            }).eq("id", task_id).execute()
        
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/keyword-tool/task/{task_id}")
async def get_keyword_task_status(task_id: str):
    """获取关键词任务状态"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase 未配置")
    
    try:
        response = supabase.table("keyword_tasks").select("*").eq("id", task_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"任务不存在: {str(e)}")
