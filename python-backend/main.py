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
    print(f"📥 收到文件: {file.filename}, 类型: {file.content_type}")
    
    try:
        # 1. 读取上传的文件
        content = await file.read()
        file_extension = os.path.splitext(file.filename)[1].lower()
        
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
            if service_id == "h10" or "h10" in file.filename.lower():
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
            result_filename = f"processed_{os.path.splitext(file.filename)[0]}.xlsx"
        else:
            raise HTTPException(status_code=400, detail=f"不支持的文件类型: {file_extension}。支持: .xlsx, .xls, .zip")
        
        if df is None or df.empty:
            raise HTTPException(status_code=400, detail="读取的 Excel 文件为空")
        
        print(f"📊 数据行数: {len(df)}, 列数: {len(df.columns)}")
        
        # 3. 业务逻辑处理（根据 service_id 执行不同的处理）
        result_df = process_dataframe(df, service_id, input_text)
        
        # 4. 导出结果到内存
        output = io.BytesIO()
        result_df.to_excel(output, index=False, engine='openpyxl')
        output.seek(0)
        
        # 5. 返回文件流（直接下载，不经过 Supabase）
        return StreamingResponse(
            io.BytesIO(output.getvalue()),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f'attachment; filename="{result_filename}"'
            }
        )
        
    except HTTPException:
        raise
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
        # 关键词筛选逻辑
        if input_text:
            # 可以根据 input_text 进行筛选
            keywords = input_text.split(",")
            # 示例筛选逻辑
            mask = result_df.iloc[:, 0].astype(str).str.contains("|".join(keywords), case=False, na=False)
            result_df = result_df[mask]
        result_df["筛选状态"] = "已筛选"
        
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

