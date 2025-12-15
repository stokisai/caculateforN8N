from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import pandas as pd
import io
import zipfile
import os
from typing import Optional
from supabase import create_client, Client
import json
import locale
import re

# --- 配置部分 ---
app = FastAPI(title="Excel Processing API", version="1.0.0")

# 允许跨域请求（这样你的前端才能调这个接口）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议把 * 换成你前端的域名，如 ["https://yourdomain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 连接 Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # 建议使用 service_role key

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase 连接成功")
    except Exception as e:
        print(f"⚠️ Supabase 连接失败: {e}")
else:
    print("⚠️ 警告: 环境变量 SUPABASE_URL 或 SUPABASE_KEY 未设置")

# --- 核心逻辑 ---
@app.post("/process")
async def process_excel(
    file: UploadFile = File(...),
    service_id: Optional[str] = Form(None),
    input_text: Optional[str] = Form(None)
):
    """
    处理上传的 Excel/ZIP 文件
    
    参数:
    - file: 上传的文件（支持 .xlsx, .xls, .zip）
    - service_id: 可选的服务ID（用于记录）
    - input_text: 可选的文本输入
    """
    # ✅ 修复：安全处理文件名（可能包含非 ASCII 字符）
    original_filename = file.filename or "uploaded_file"
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
            
            # 寻找目标文件（可以根据 service_id 或文件名模式匹配）
            target_file = None
            if service_id == "h10" or "h10" in original_filename.lower():
                # 查找包含 H10 的 Excel 文件
                target_file = next((f for f in file_list if "H10" in f.upper() and (f.endswith(".xlsx") or f.endswith(".xls"))), None)
            else:
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
        
        print(f"📊 数据行数: {len(df)}, 列数: {len(df.columns)}")
        print(f"📊 列名: {list(df.columns)}")
        
        # 3. 业务逻辑处理（根据 service_id 执行不同的处理）
        print(f"🔄 开始处理，Service ID: {service_id}")
        result_df = process_dataframe(df, service_id, input_text)
        print(f"✅ 处理完成，结果行数: {len(result_df)}")
        
        # 4. 导出结果到内存
        output = io.BytesIO()
        result_df.to_excel(output, index=False, engine='openpyxl')
        output.seek(0)
        
        # 5. 返回文件流（直接下载，不经过 Supabase）
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


def process_dataframe(df: pd.DataFrame, service_id: Optional[str], input_text: Optional[str]) -> pd.DataFrame:
    """
    根据服务ID执行不同的数据处理逻辑
    """
    result_df = df.copy()
    
    # 根据不同的 service_id 执行不同的处理
    if service_id == "h10" or service_id == "abfaf85c-9553-4d7b-9416-e3aff65e8587":  # Ex大名)
        # H10 处理逻辑
        # 示例：添加处理状态列
        result_df["处理状态"] = "已通过 Python 后端处理"
        result_df["处理时间"] = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
        # 这里可以添加你的具体业务逻辑
        
    elif service_id == "d144da99-d3e6-4b78-9cd5-70b1e4ced346":  # 筛选核心关键词
        # ✅ 筛选核心关键词逻辑
        result_df = filter_core_keywords(result_df)
        
    elif service_id == "65bb6f50-5087-488e-8f1b-350d4ed9fe00":  # 计算投产比
        # 投产比计算逻辑
        # 示例：假设有"投入"和"产出"两列
        if "投入" in result_df.columns and "产出" in result_df.columns:
            result_df["投产比"] = result_df["产出"] / result_df["投入"]
        result_df["计算状态"] = "已完成"
        
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
    print("🔍 开始筛选核心关键词...")
    
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
    
    print(f"✅ 找到列: 关键词={keyword_col}, 相关产品={related_product_col}, ABA周排名={aba_rank_col}")
    
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
    
    print(f"📊 排序后数据行数: {len(df)}")
    
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
    
    print(f"📊 过滤后数据行数: {len(df)}")
    
    # 4. 取前60行
    df = df.head(60)
    
    print(f"📊 取前60行后数据行数: {len(df)}")
    
    # 5. 只保留关键词列
    result_df = df[[keyword_col]].copy()
    
    # 重命名列为"关键词"（统一输出格式）
    result_df.columns = ['关键词']
    
    print(f"✅ 筛选完成，最终输出 {len(result_df)} 行")
    
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
        "h10": "abfaf85c-9553-4d7b-9416-e3aff65e8587",
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

