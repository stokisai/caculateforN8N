from fastapi import FastAPI, UploadFile, File, HTTPException, Form
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
    if service_id == "h10" or service_id == "abfaf85c-9553-4d7b-9416-e3aff65e8587":  # Ex大名)
        # ✅ Ex大名 处理逻辑：计算 50个评论以内的ASIN占比
        result_df = calculate_asin_ratio(df)
        
    elif service_id == "d144da99-d3e6-4b78-9cd5-70b1e4ced346":  # 筛选核心关键词
        # ✅ 筛选核心关键词逻辑
        result_df = filter_core_keywords(result_df)
        
    elif service_id == "65bb6f50-5087-488e-8f1b-350d4ed9fe00":  # 计算投产比
        # ✅ 计算投产比逻辑（返回文本报告）
        return calculate_roi(df)
        
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


def search_amazon_natural_products(keyword: str, max_retries: int = 3) -> List[Dict[str, any]]:
    """
    在 Amazon 美国站搜索关键词，获取首页自然位 ASIN 及其评论数
    参考 n8n 逻辑：使用正则表达式切分 HTML 块并解析
    
    参数:
    - keyword: 搜索关键词
    - max_retries: 最大重试次数
    
    返回:
    - List[Dict]: 每个元素包含 {'asin': 'B0XXX', 'ratingCount': 123} 或空列表（如果失败）
    """
    url = f"https://www.amazon.com/s?k={quote(keyword)}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    for attempt in range(max_retries):
        try:
            # 添加延迟，避免被反爬虫
            if attempt > 0:
                time.sleep(2 ** attempt)  # 指数退避：2秒、4秒、8秒
            
            response = requests.get(url, headers=headers, timeout=10)
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
                
                # 提取评论数（参考 n8n 逻辑：优先使用 aria-label，其次使用 >数字 ratings</a>）
                rating_match = (
                    re.search(r'aria-label="([\d,]+)\s+ratings?"', raw, re.IGNORECASE) or
                    re.search(r'>\s*([\d,]+)\s+ratings?\s*</a>', raw, re.IGNORECASE)
                )
                
                rating_count = 0
                if rating_match:
                    try:
                        rating_count = int(rating_match.group(1).replace(',', ''))
                    except (ValueError, AttributeError):
                        rating_count = 0
                
                items.append({
                    'asin': asin,
                    'ratingCount': rating_count
                })
            
            # 如果找到了产品，返回结果
            if items:
                print(f"  ✅ 找到 {len(items)} 个自然位产品")
                return items
            else:
                print(f"  ⚠️ 未找到任何产品")
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
            
            # Step 2️⃣ 找出评论数低于 50 的自然位（参考 n8n 逻辑）
            low_ratings = [p for p in filtered if p['ratingCount'] < 50]
            
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

