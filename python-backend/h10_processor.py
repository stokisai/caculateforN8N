"""
H10 竞品分析处理模块
处理多个 Excel 工作表的数据分析和标记
"""

import pandas as pd
import io
import re
from typing import Dict, Optional, List, Tuple
from fastapi import UploadFile, HTTPException


def extract_keywords_from_column(df: pd.DataFrame, column_name: str) -> set:
    """从指定列提取关键词（去重）"""
    if column_name not in df.columns:
        return set()
    
    keywords = set()
    for value in df[column_name].dropna():
        if pd.notna(value):
            keywords.add(str(value).strip())
    return keywords


def word_boundary_match(text: str, pattern: str) -> bool:
    """
    单词级匹配：确保匹配值作为独立词出现（不被其它字母数字连在一起）
    
    参数:
    - text: 要搜索的文本
    - pattern: 要匹配的模式
    
    返回:
    - bool: 是否匹配
    """
    if not text or not pattern:
        return False
    
    # 转小写进行匹配
    text_lower = str(text).lower()
    pattern_lower = str(pattern).lower()
    
    # 使用单词边界正则表达式
    # \b 表示单词边界，确保匹配的是完整单词
    pattern_regex = r'\b' + re.escape(pattern_lower) + r'\b'
    
    return bool(re.search(pattern_regex, text_lower))


def contains_all_words(text: str, words: List[str]) -> bool:
    """
    检查文本是否包含所有指定的词（单词级匹配）
    
    参数:
    - text: 要检查的文本
    - words: 要匹配的词列表
    
    返回:
    - bool: 是否包含所有词
    """
    if not text or not words:
        return False
    
    for word in words:
        if not word_boundary_match(text, word):
            return False
    return True


async def process_h10_analysis(
    file_H10反查总表: Optional[UploadFile] = None,
    file_竞品1: Optional[UploadFile] = None,
    file_竞品2: Optional[UploadFile] = None,
    file_竞品3: Optional[UploadFile] = None,
    file_竞品4: Optional[UploadFile] = None,
    file_竞品5: Optional[UploadFile] = None,
    file_竞品6: Optional[UploadFile] = None,
    file_竞品7: Optional[UploadFile] = None,
    file_竞品8: Optional[UploadFile] = None,
    file_竞品9: Optional[UploadFile] = None,
    file_竞品10: Optional[UploadFile] = None,
    file_自身ASIN反查: Optional[UploadFile] = None,
    file_竞对ABA热搜词反查: Optional[UploadFile] = None,
    file_拓词基础表: Optional[UploadFile] = None,
    folder_files: Optional[List[UploadFile]] = None
):
    """
    H10 竞品分析主处理函数
    
    处理逻辑：
    1. 读取所有上传的文件
    2. 执行三个部分的标记逻辑
    3. 输出处理后的 H10反查总表
    """
    print("🔍 开始 H10 竞品分析处理...")
    
    # 步骤 1: 收集所有文件
    files_dict = {}
    file_mapping = {
        "H10反查总表": file_H10反查总表,
        "竞品1": file_竞品1,
        "竞品2": file_竞品2,
        "竞品3": file_竞品3,
        "竞品4": file_竞品4,
        "竞品5": file_竞品5,
        "竞品6": file_竞品6,
        "竞品7": file_竞品7,
        "竞品8": file_竞品8,
        "竞品9": file_竞品9,
        "竞品10": file_竞品10,
        "自身ASIN反查": file_自身ASIN反查,
        "竞对ABA热搜词反查": file_竞对ABA热搜词反查,
        "拓词基础表": file_拓词基础表,
    }
    
    # 处理单独上传的文件
    for key, file in file_mapping.items():
        if file:
            files_dict[key] = file
    
    # 处理文件夹中的文件
    if folder_files:
        print(f"📁 处理文件夹，包含 {len(folder_files)} 个文件")
        # 创建文件名匹配映射
        name_patterns = {
            "H10反查总表": ["h10", "反查总表", "h10反查"],
            "竞品1": ["竞品1", "竞品 1", "competitor1", "comp1"],
            "竞品2": ["竞品2", "竞品 2", "competitor2", "comp2"],
            "竞品3": ["竞品3", "竞品 3", "competitor3", "comp3"],
            "竞品4": ["竞品4", "竞品 4", "competitor4", "comp4"],
            "竞品5": ["竞品5", "竞品 5", "competitor5", "comp5"],
            "竞品6": ["竞品6", "竞品 6", "competitor6", "comp6"],
            "竞品7": ["竞品7", "竞品 7", "competitor7", "comp7"],
            "竞品8": ["竞品8", "竞品 8", "competitor8", "comp8"],
            "竞品9": ["竞品9", "竞品 9", "competitor9", "comp9"],
            "竞品10": ["竞品10", "竞品 10", "competitor10", "comp10"],
            "自身ASIN反查": ["自身", "asin反查", "自身asin"],
            "竞对ABA热搜词反查": ["竞对", "aba", "热搜词", "多asin"],
            "拓词基础表": ["拓词", "基础表"],
        }
        
        for file in folder_files:
            if not file.filename:
                continue
            filename_lower = file.filename.lower()
            # 自动匹配文件名
            matched = False
            for key, patterns in name_patterns.items():
                if any(pattern in filename_lower for pattern in patterns):
                    if key not in files_dict:  # 如果还没被单独上传覆盖
                        files_dict[key] = file
                        print(f"  ✅ 匹配文件: {file.filename} -> {key}")
                        matched = True
                        break
            if not matched:
                print(f"  ⚠️ 未匹配文件: {file.filename}")
    
    # 验证必需文件
    if "H10反查总表" not in files_dict:
        raise HTTPException(status_code=400, detail="缺少必需文件：H10反查总表")
    
    print(f"📊 已收集 {len(files_dict)} 个文件: {list(files_dict.keys())}")
    
    # 步骤 2: 读取所有 Excel 文件
    dataframes = {}
    for key, file in files_dict.items():
        try:
            content = await file.read()
            # 尝试读取 Excel 文件
            excel_file = pd.ExcelFile(io.BytesIO(content))
            
            # 如果有多个工作表，读取第一个（或根据名称匹配）
            if key == "竞对ABA热搜词反查":
                # ✅ 严格按照需求：查找"多asin反查流量"工作表（精确匹配）
                sheet_name = None
                for sheet in excel_file.sheet_names:
                    if sheet == "多asin反查流量" or sheet == "多ASIN反查流量":
                        sheet_name = sheet
                        break
                if not sheet_name:
                    # 如果找不到精确匹配，尝试模糊匹配
                    for sheet in excel_file.sheet_names:
                        if "多asin" in sheet or "多ASIN" in sheet:
                            sheet_name = sheet
                            break
                if not sheet_name:
                    print(f"  ⚠️ 警告: 未找到'多asin反查流量'工作表，使用第一个工作表")
                    sheet_name = excel_file.sheet_names[0]
                dataframes[key] = pd.read_excel(excel_file, sheet_name=sheet_name)
                print(f"  ✅ {key}: 读取工作表 '{sheet_name}'")
            else:
                # 其他文件读取第一个工作表
                dataframes[key] = pd.read_excel(excel_file, sheet_name=0)
                print(f"  ✅ {key}: 读取第一个工作表")
        except Exception as e:
            print(f"  ❌ 读取 {key} 失败: {str(e)}")
            raise HTTPException(status_code=400, detail=f"读取文件 {key} 失败: {str(e)}")
    
    # 步骤 3: 执行处理逻辑
    h10_df = dataframes["H10反查总表"].copy()
    
    # 第一部分：AN 列标记（A-F 优先级）
    h10_df = process_part1_an_column(h10_df, dataframes)
    
    # 第二部分：AO 列标记（词类型分类）
    h10_df = process_part2_ao_column(h10_df, dataframes)
    
    # 第三部分：AP 列标记（流量等级）
    h10_df = process_part3_ap_column(h10_df)
    
    # 步骤 4: 输出结果
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        h10_df.to_excel(writer, sheet_name='H10反查总表', index=False)
    output.seek(0)
    
    print("✅ H10 处理完成，准备返回文件")
    return output


def process_part1_an_column(h10_df: pd.DataFrame, dataframes: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """
    第一部分：AN 列标记（A-F 优先级）
    
    优先级从高到低：F > E > D > C > B > A
    """
    print("📝 第一部分：处理 AN 列标记...")
    
    # 查找关键词词组列（通常是第一列或包含"关键词"的列）
    keyword_col = None
    for col in h10_df.columns:
        if "关键词" in str(col) or "词组" in str(col):
            keyword_col = col
            break
    if not keyword_col:
        keyword_col = h10_df.columns[0]  # 默认第一列
    
    # 初始化 AN 列（如果不存在，添加到末尾）
    if "AN" not in h10_df.columns:
        h10_df["AN"] = ""
    else:
        # 如果已存在，清空或保持
        h10_df["AN"] = h10_df["AN"].fillna("")
    
    # 收集各工作表的关键词
    # 1. 自身ASIN反查
    self_asin_keywords = set()
    if "自身ASIN反查" in dataframes:
        df = dataframes["自身ASIN反查"]
        # 查找关键词列
        for col in df.columns:
            if "关键词" in str(col) or "词组" in str(col):
                self_asin_keywords = extract_keywords_from_column(df, col)
                break
    
    # 2. 竞对ABA热搜词反查 - 多asin反查流量工作表
    aba_keywords = set()
    if "竞对ABA热搜词反查" in dataframes:
        df = dataframes["竞对ABA热搜词反查"]
        for col in df.columns:
            if "关键词" in str(col) or "词组" in str(col):
                aba_keywords = extract_keywords_from_column(df, col)
                break
    
    # 3. 竞品1-10
    competitor_keywords_data = {}  # {keyword: {竞品: {广告排名, 自然排名}}}
    for i in range(1, 11):
        key = f"竞品{i}"
        if key in dataframes:
            df = dataframes[key]
            # 查找关键词列、广告排名列、自然排名列
            keyword_col_comp = None
            ad_rank_col = None
            natural_rank_col = None
            
            for col in df.columns:
                col_str = str(col).lower()
                if "关键词" in col_str or "词组" in col_str:
                    keyword_col_comp = col
                elif "广告" in col_str and ("排名" in col_str or "rank" in col_str):
                    ad_rank_col = col
                elif ("自然" in col_str or "organic" in col_str) and ("排名" in col_str or "rank" in col_str):
                    natural_rank_col = col
            
            if keyword_col_comp:
                for idx, row in df.iterrows():
                    keyword = str(row[keyword_col_comp]).strip() if pd.notna(row[keyword_col_comp]) else ""
                    if keyword:
                        if keyword not in competitor_keywords_data:
                            competitor_keywords_data[keyword] = {}
                        
                        ad_rank = None
                        natural_rank = None
                        
                        if ad_rank_col and pd.notna(row[ad_rank_col]):
                            try:
                                ad_rank = float(row[ad_rank_col])
                            except:
                                pass
                        
                        if natural_rank_col and pd.notna(row[natural_rank_col]):
                            try:
                                natural_rank = float(row[natural_rank_col])
                            except:
                                pass
                        
                        competitor_keywords_data[keyword][key] = {
                            "ad_rank": ad_rank,
                            "natural_rank": natural_rank
                        }
    
    # 标记 AN 列（严格按照用户需求，优先级：F > E > D > C > B > A）
    print(f"  收集到的关键词数量: 自身ASIN={len(self_asin_keywords)}, ABA={len(aba_keywords)}, 竞品={len(competitor_keywords_data)}")
    
    for idx, row in h10_df.iterrows():
        keyword = str(row[keyword_col]).strip() if pd.notna(row[keyword_col]) else ""
        if not keyword:
            h10_df.at[idx, "AN"] = "A"
            continue
        
        # ✅ 严格按照用户需求的优先级顺序检查
        
        # 规则 1: 如果关键词在自身ASIN反查中出现 -> F（最高优先级）
        if keyword in self_asin_keywords:
            h10_df.at[idx, "AN"] = "F"
            continue
        
        # 规则 2: 如果关键词在竞对ABA热搜词反查中出现 -> E
        if keyword in aba_keywords:
            h10_df.at[idx, "AN"] = "E"
            continue
        
        # 规则 3-6: 检查竞品数据
        if keyword in competitor_keywords_data:
            comp_data = competitor_keywords_data[keyword]
            
            # ✅ 修复：收集所有满足的条件，然后选择最高优先级（D > C > B）
            has_d = False  # 规则 3: 广告排名<=20 且 自然排名<=20（任意一个竞品满足）
            has_c = False  # 规则 4: 仅自然排名<=20（广告排名>20或无值，任意一个竞品满足）
            has_b = False  # 规则 5: 仅广告排名<=20（自然排名>20或无值，任意一个竞品满足）
            
            # 遍历所有竞品，检查是否满足D/C/B条件（任意一个竞品满足即可）
            # ✅ 修复：需要检查所有竞品，分别判断每个竞品是否满足D/C/B条件
            for comp_name, ranks in comp_data.items():
                ad_rank = ranks.get("ad_rank")
                natural_rank = ranks.get("natural_rank")
                
                # 规则 3: 广告排名<=20 且 自然排名<=20（任意一个竞品满足即可）
                if (ad_rank is not None and ad_rank <= 20) and (natural_rank is not None and natural_rank <= 20):
                    has_d = True
                
                # 规则 4: 仅自然排名<=20（广告排名>20或无值，任意一个竞品满足即可）
                # 注意：使用独立的if，因为需要检查所有竞品，看是否有任意一个满足C条件
                if (natural_rank is not None and natural_rank <= 20) and (ad_rank is None or ad_rank > 20):
                    has_c = True
                
                # 规则 5: 仅广告排名<=20（自然排名>20或无值，任意一个竞品满足即可）
                # 注意：使用独立的if，因为需要检查所有竞品，看是否有任意一个满足B条件
                if (ad_rank is not None and ad_rank <= 20) and (natural_rank is None or natural_rank > 20):
                    has_b = True
            
            # 按优先级选择最高标记（D > C > B）
            if has_d:
                h10_df.at[idx, "AN"] = "D"
            elif has_c:
                h10_df.at[idx, "AN"] = "C"
            elif has_b:
                h10_df.at[idx, "AN"] = "B"
            else:
                # 规则 6: 如果所有竞品的广告排名和自然排名都>20或无值（所有竞品都要满足这个条件）-> A
                all_comp_high = True
                for comp_name, ranks in comp_data.items():
                    ad_rank = ranks.get("ad_rank")
                    natural_rank = ranks.get("natural_rank")
                    # 对于每个竞品，广告排名和自然排名都必须>20或无值
                    if (ad_rank is not None and ad_rank <= 20) or (natural_rank is not None and natural_rank <= 20):
                        all_comp_high = False
                        break
                
                if all_comp_high:
                    h10_df.at[idx, "AN"] = "A"
                else:
                    # 如果所有竞品都>20的条件不满足，但D/C/B都不满足，说明数据有问题
                    # 按照需求，这种情况不应该出现，但为了保险标记为A
                    h10_df.at[idx, "AN"] = "A"
        else:
            # 规则 6: 如果关键词在竞品1-10中未出现 -> A
            h10_df.at[idx, "AN"] = "A"
    
    # 统计标记结果
    mark_counts = h10_df["AN"].value_counts().to_dict()
    print(f"  ✅ AN 列标记完成，共处理 {len(h10_df)} 行，统计: {mark_counts}")
    print(f"  📊 AN列详细统计: F={mark_counts.get('F', 0)}, E={mark_counts.get('E', 0)}, D={mark_counts.get('D', 0)}, C={mark_counts.get('C', 0)}, B={mark_counts.get('B', 0)}, A={mark_counts.get('A', 0)}")
    return h10_df


def process_part2_ao_column(h10_df: pd.DataFrame, dataframes: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    """
    第二部分：AO 列标记（词类型分类）
    """
    print("📝 第二部分：处理 AO 列标记...")
    
    # 初始化 AO 列
    if "AO" not in h10_df.columns:
        h10_df.insert(len(h10_df.columns), "AO", "")
    
    # 查找关键词列
    keyword_col = None
    for col in h10_df.columns:
        if "关键词" in str(col) or "词组" in str(col):
            keyword_col = col
            break
    if not keyword_col:
        keyword_col = h10_df.columns[0]
    
    # 读取拓词基础表
    if "拓词基础表" not in dataframes:
        print("  ⚠️ 警告: 未找到拓词基础表，跳过 AO 列标记")
        return h10_df
    
    tuoci_df = dataframes["拓词基础表"]
    
    # 提取各列的值（作为完整词匹配）
    col_a_values = []  # A列
    col_b_values = []  # B列
    col_c_values = []  # C列
    col_d_values = []  # D列
    col_e_values = []  # E列
    
    # 假设列按顺序：A, B, C, D, E
    if len(tuoci_df.columns) >= 1:
        col_a_values = [str(v).strip() for v in tuoci_df.iloc[:, 0].dropna() if str(v).strip()]
    if len(tuoci_df.columns) >= 2:
        col_b_values = [str(v).strip() for v in tuoci_df.iloc[:, 1].dropna() if str(v).strip()]
    if len(tuoci_df.columns) >= 3:
        col_c_values = [str(v).strip() for v in tuoci_df.iloc[:, 2].dropna() if str(v).strip()]
    if len(tuoci_df.columns) >= 4:
        col_d_values = [str(v).strip() for v in tuoci_df.iloc[:, 3].dropna() if str(v).strip()]
    if len(tuoci_df.columns) >= 5:
        col_e_values = [str(v).strip() for v in tuoci_df.iloc[:, 4].dropna() if str(v).strip()]
    
    print(f"  拓词基础表: A列={len(col_a_values)}, B列={len(col_b_values)}, C列={len(col_c_values)}, D列={len(col_d_values)}, E列={len(col_e_values)}")
    
    # 标记 AO 列
    for idx, row in h10_df.iterrows():
        keyword = str(row[keyword_col]).strip() if pd.notna(row[keyword_col]) else ""
        if not keyword:
            h10_df.at[idx, "AO"] = "相关词"
            continue
        
        mark = None
        
        # ✅ 严格按照用户需求的规则顺序检查
        
        # 规则 1: 包含 D 列中的任意单元格中的全部值 -> 不相关词（最高优先级）
        if any(word_boundary_match(keyword, val) for val in col_d_values):
            mark = "不相关词"
        # 规则 2: 包含 A 列，不包含 B/C/D/E 列 -> 大词或泛词
        elif (any(word_boundary_match(keyword, val) for val in col_a_values) and
              not any(word_boundary_match(keyword, val) for val in col_b_values) and
              not any(word_boundary_match(keyword, val) for val in col_c_values) and
              not any(word_boundary_match(keyword, val) for val in col_d_values) and
              not any(word_boundary_match(keyword, val) for val in col_e_values)):
            mark = "大词或泛词"
        # 规则 3: 包含 A 列和 B 列，不包含 D/E 列 -> a精准属性精准词
        elif (any(word_boundary_match(keyword, val) for val in col_a_values) and
              any(word_boundary_match(keyword, val) for val in col_b_values) and
              not any(word_boundary_match(keyword, val) for val in col_d_values) and
              not any(word_boundary_match(keyword, val) for val in col_e_values)):
            mark = "a精准属性精准词"
        # 规则 4: 包含 A 列和 C 列，不包含 B/D/E 列 -> b泛属性精准词
        elif (any(word_boundary_match(keyword, val) for val in col_a_values) and
              any(word_boundary_match(keyword, val) for val in col_c_values) and
              not any(word_boundary_match(keyword, val) for val in col_b_values) and
              not any(word_boundary_match(keyword, val) for val in col_d_values) and
              not any(word_boundary_match(keyword, val) for val in col_e_values)):
            mark = "b泛属性精准词"
        # 规则 5: 包含 B 列或 C 列，不包含 A/D/E 列 -> 相关词
        elif ((any(word_boundary_match(keyword, val) for val in col_b_values) or
               any(word_boundary_match(keyword, val) for val in col_c_values)) and
              not any(word_boundary_match(keyword, val) for val in col_a_values) and
              not any(word_boundary_match(keyword, val) for val in col_d_values) and
              not any(word_boundary_match(keyword, val) for val in col_e_values)):
            mark = "相关词"
        # 规则 6: 不包含 A/B/C/D/E 列 -> 相关词
        elif (not any(word_boundary_match(keyword, val) for val in col_a_values) and
              not any(word_boundary_match(keyword, val) for val in col_b_values) and
              not any(word_boundary_match(keyword, val) for val in col_c_values) and
              not any(word_boundary_match(keyword, val) for val in col_d_values) and
              not any(word_boundary_match(keyword, val) for val in col_e_values)):
            mark = "相关词"
        # 规则 7: 包含 E 列 -> 品牌词（最后检查，但会覆盖其他标记）
        elif any(word_boundary_match(keyword, val) for val in col_e_values):
            mark = "品牌词"
        else:
            mark = "相关词"  # 默认
        
        h10_df.at[idx, "AO"] = mark
    
    # 统计标记结果
    mark_counts = h10_df["AO"].value_counts().to_dict()
    print(f"  ✅ AO 列标记完成，统计: {mark_counts}")
    return h10_df


def process_part3_ap_column(h10_df: pd.DataFrame) -> pd.DataFrame:
    """
    第三部分：AP 列标记（流量等级）
    
    根据搜索量累计百分比标记：
    - 高流量词1: 0-40%
    - 中高流量词2: 40-70%
    - 中低流量词3: 70-90%
    - 低流量词4: 90-100%
    """
    print("📝 第三部分：处理 AP 列标记...")
    
    # 初始化 AP 列（如果不存在，添加到末尾）
    if "AP" not in h10_df.columns:
        h10_df["AP"] = ""
    else:
        # 如果已存在，清空或保持
        h10_df["AP"] = h10_df["AP"].fillna("")
    
    # 查找搜索量列（D列，索引3）
    search_volume_col = None
    if len(h10_df.columns) > 3:
        search_volume_col = h10_df.columns[3]  # D列
    else:
        # 尝试查找包含"搜索量"的列
        for col in h10_df.columns:
            if "搜索量" in str(col) or "search" in str(col).lower():
                search_volume_col = col
                break
    
    if not search_volume_col:
        print("  ⚠️ 警告: 未找到搜索量列（D列），跳过 AP 列标记")
        return h10_df
    
    # 提取搜索量并转换为数值
    search_volumes = []
    for idx, row in h10_df.iterrows():
        value = row[search_volume_col]
        if pd.notna(value):
            try:
                vol = float(value)
                search_volumes.append((idx, vol))
            except:
                search_volumes.append((idx, 0))
        else:
            search_volumes.append((idx, 0))
    
    # 按搜索量降序排序
    search_volumes.sort(key=lambda x: x[1], reverse=True)
    
    # 计算总搜索量
    total_volume = sum(vol for _, vol in search_volumes)
    
    if total_volume == 0:
        print("  ⚠️ 警告: 总搜索量为0，跳过 AP 列标记")
        return h10_df
    
    # 计算累计百分比并标记
    cumulative_volume = 0
    current_threshold = 0.4  # 40%
    current_mark = "高流量词1"
    
    for idx, vol in search_volumes:
        cumulative_volume += vol
        percentage = cumulative_volume / total_volume
        
        if percentage <= 0.4:
            mark = "高流量词1"
        elif percentage <= 0.7:
            mark = "中高流量词2"
        elif percentage <= 0.9:
            mark = "中低流量词3"
        else:
            mark = "低流量词4"
        
        h10_df.at[idx, "AP"] = mark
    
    print(f"  ✅ AP 列标记完成，总搜索量: {total_volume:,.0f}")
    return h10_df

