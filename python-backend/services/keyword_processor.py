"""
关键词词库处理服务
实现 AN、AO、AP 三列分类逻辑
"""

import pandas as pd
import numpy as np
import re
from typing import Dict, List, Optional, Tuple, Set, Any
from io import BytesIO


class KeywordProcessor:
    """关键词处理器"""
    
    # 可能的列名映射
    KEYWORD_COLUMNS = ["关键词", "keyword", "关键词词组", "搜索词", "search term", "词", "词组"]
    AD_RANK_COLUMNS = ["广告排名", "广告位", "ad_rank", "ad rank", "广告", "ad"]
    NATURAL_RANK_COLUMNS = ["自然排名", "自然位", "natural_rank", "natural rank", "自然", "organic"]
    SEARCH_VOLUME_COLUMNS = ["搜索量", "search volume", "月搜索量", "周搜索量", "搜索频率"]
    
    def __init__(self):
        self.progress_callback = None
        
    def set_progress_callback(self, callback):
        """设置进度回调函数"""
        self.progress_callback = callback
        
    def update_progress(self, progress: int, message: str = ""):
        """更新进度"""
        if self.progress_callback:
            self.progress_callback(progress, message)
    
    def find_column(self, df: pd.DataFrame, possible_names: List[str]) -> Optional[str]:
        """查找匹配的列名"""
        df_columns_lower = {col.lower().strip(): col for col in df.columns}
        for name in possible_names:
            name_lower = name.lower().strip()
            if name_lower in df_columns_lower:
                return df_columns_lower[name_lower]
        return None
    
    def read_excel_file(self, file_content: bytes, sheet_name: Optional[str] = None, 
                        sheet_index: Optional[int] = None) -> pd.DataFrame:
        """读取 Excel 文件"""
        try:
            if sheet_name:
                return pd.read_excel(BytesIO(file_content), sheet_name=sheet_name)
            elif sheet_index is not None:
                return pd.read_excel(BytesIO(file_content), sheet_name=sheet_index)
            else:
                return pd.read_excel(BytesIO(file_content))
        except Exception as e:
            raise ValueError(f"读取 Excel 文件失败: {str(e)}")
    
    def get_keywords_set(self, df: pd.DataFrame) -> Set[str]:
        """从 DataFrame 中提取关键词集合（保持原始大小写）"""
        keyword_col = self.find_column(df, self.KEYWORD_COLUMNS)
        if not keyword_col:
            # 尝试使用第一列
            keyword_col = df.columns[0]
        
        # 不转换小写，保持原始大小写
        keywords = df[keyword_col].dropna().astype(str).str.strip()
        return set(k for k in keywords if k and k != 'nan')
    
    def get_competitor_aba_keywords(self, file_content: bytes) -> Set[str]:
        """
        从竞对ABA热搜词反查文件中提取关键词
        需要读取第二个工作表 "多asin反查流量"
        """
        try:
            # 获取所有工作表名称
            xlsx = pd.ExcelFile(BytesIO(file_content))
            sheet_names = xlsx.sheet_names
            
            target_sheet = None
            
            # 查找包含 "多asin反查流量" 或 "多asin" 的工作表
            for i, name in enumerate(sheet_names):
                if "多asin反查流量" in name or "多asin" in name.lower():
                    target_sheet = name
                    break
            
            # 如果没找到，尝试使用第二个工作表
            if target_sheet is None and len(sheet_names) >= 2:
                target_sheet = sheet_names[1]
            elif target_sheet is None:
                target_sheet = sheet_names[0]
            
            df = pd.read_excel(BytesIO(file_content), sheet_name=target_sheet)
            return self.get_keywords_set(df)
            
        except Exception as e:
            raise ValueError(f"读取竞对ABA热搜词反查文件失败: {str(e)}")
    
    def get_competitor_data(self, file_content: bytes) -> pd.DataFrame:
        """
        从竞品文件中提取关键词和排名数据
        返回包含 关键词、广告排名、自然排名 的 DataFrame
        """
        df = self.read_excel_file(file_content)
        
        keyword_col = self.find_column(df, self.KEYWORD_COLUMNS)
        ad_rank_col = self.find_column(df, self.AD_RANK_COLUMNS)
        natural_rank_col = self.find_column(df, self.NATURAL_RANK_COLUMNS)
        
        if not keyword_col:
            keyword_col = df.columns[0]
        
        result = pd.DataFrame()
        # 保持原始大小写，不转换为小写
        result['keyword'] = df[keyword_col].astype(str).str.strip()
        
        if ad_rank_col:
            result['ad_rank'] = pd.to_numeric(df[ad_rank_col], errors='coerce')
        else:
            result['ad_rank'] = np.nan
            
        if natural_rank_col:
            result['natural_rank'] = pd.to_numeric(df[natural_rank_col], errors='coerce')
        else:
            result['natural_rank'] = np.nan
        
        # 过滤无效关键词
        result = result[result['keyword'].notna() & (result['keyword'] != 'nan') & (result['keyword'] != '')]
        return result
    
    def process_an_column(
        self,
        main_df: pd.DataFrame,
        keyword_col: str,
        self_asin_keywords: Set[str],
        competitor_aba_keywords: Set[str],
        competitor_data_list: List[pd.DataFrame]
    ) -> pd.Series:
        """
        处理 AN 列（关键词类别）
        优先级: F > E > D > C > B > A
        
        完全按照本地版本的逻辑实现
        """
        results = []
        
        # 构建竞品关键词数据字典：{keyword: {comp_num: {ad_rank, natural_rank}}}
        competitor_keyword_data: Dict[str, Dict[int, Dict[str, Optional[float]]]] = {}
        
        for comp_num, comp_df in enumerate(competitor_data_list, start=1):
            if comp_df is None or comp_df.empty:
                continue
            
            for _, row in comp_df.iterrows():
                keyword = str(row['keyword']).strip()
                if not keyword or keyword == 'nan':
                    continue
                
                if keyword not in competitor_keyword_data:
                    competitor_keyword_data[keyword] = {}
                
                ad_rank = row.get('ad_rank', None)
                natural_rank = row.get('natural_rank', None)
                
                # 转换为 float 或 None
                if pd.notna(ad_rank):
                    try:
                        ad_rank = float(ad_rank)
                    except:
                        ad_rank = None
                else:
                    ad_rank = None
                    
                if pd.notna(natural_rank):
                    try:
                        natural_rank = float(natural_rank)
                    except:
                        natural_rank = None
                else:
                    natural_rank = None
                
                if comp_num not in competitor_keyword_data[keyword]:
                    competitor_keyword_data[keyword][comp_num] = {'ad_rank': ad_rank, 'natural_rank': natural_rank}
                else:
                    # 如果已存在，保留更小的排名值
                    existing = competitor_keyword_data[keyword][comp_num]
                    if ad_rank is not None and (existing['ad_rank'] is None or ad_rank < existing['ad_rank']):
                        existing['ad_rank'] = ad_rank
                    if natural_rank is not None and (existing['natural_rank'] is None or natural_rank < existing['natural_rank']):
                        existing['natural_rank'] = natural_rank
        
        # 遍历主表的每个关键词进行分类
        for idx, row in main_df.iterrows():
            keyword = str(row[keyword_col]).strip()
            if pd.isna(row[keyword_col]) or keyword == 'nan' or keyword == '':
                results.append(None)
                continue
            
            mark = self._classify_an_local_logic(
                keyword,
                self_asin_keywords,
                competitor_aba_keywords,
                competitor_keyword_data
            )
            results.append(mark)
        
        return pd.Series(results)
    
    def _classify_an_local_logic(
        self,
        keyword: str,
        self_asin_keywords: Set[str],
        competitor_aba_keywords: Set[str],
        competitor_keyword_data: Dict[str, Dict[int, Dict[str, Optional[float]]]]
    ) -> str:
        """
        单个关键词的 AN 分类（完全按照本地版本逻辑）
        优先级: F > E > D > C > B > A
        """
        mark = None
        
        # 检查F：在自身ASIN反查中出现过
        if keyword in self_asin_keywords:
            mark = 'F'
        # 检查E：在竞对ABA热搜词反查中出现过
        elif keyword in competitor_aba_keywords:
            mark = 'E'
        # 检查竞品数据
        elif keyword in competitor_keyword_data:
            comp_data = competitor_keyword_data[keyword]
            
            has_d_condition = False
            has_c_condition = False
            has_b_condition = False
            has_a_condition = False
            
            # D条件：广告排名和自然排名都<=20（任意一个竞品满足即可）
            for comp_num, ranks in comp_data.items():
                ad_rank = ranks['ad_rank']
                natural_rank = ranks['natural_rank']
                if ad_rank is not None and ad_rank <= 20 and natural_rank is not None and natural_rank <= 20:
                    has_d_condition = True
                    break  # D优先级最高，找到就停止
            
            if not has_d_condition:
                # C条件：仅自然排名<=20（广告排名需大于20或无值，任意一个竞品满足即可）
                for comp_num, ranks in comp_data.items():
                    ad_rank = ranks['ad_rank']
                    natural_rank = ranks['natural_rank']
                    if natural_rank is not None and natural_rank <= 20 and (ad_rank is None or ad_rank > 20):
                        has_c_condition = True
                        break  # C优先级高于B和A
                
                if not has_c_condition:
                    # B条件：仅广告排名<=20（自然排名需大于20或无值，任意一个竞品满足即可）
                    for comp_num, ranks in comp_data.items():
                        ad_rank = ranks['ad_rank']
                        natural_rank = ranks['natural_rank']
                        if ad_rank is not None and ad_rank <= 20 and (natural_rank is None or natural_rank > 20):
                            has_b_condition = True
                            break  # B优先级高于A
                    
                    if not has_b_condition:
                        # A条件：所有竞品的广告排名和自然排名都大于20或无值（所有竞品都要满足）
                        all_a_condition = True
                        for comp_num, ranks in comp_data.items():
                            ad_rank = ranks['ad_rank']
                            natural_rank = ranks['natural_rank']
                            if not ((ad_rank is None or ad_rank > 20) and (natural_rank is None or natural_rank > 20)):
                                all_a_condition = False
                                break
                        if all_a_condition:
                            has_a_condition = True
            
            if has_d_condition:
                mark = 'D'
            elif has_c_condition:
                mark = 'C'
            elif has_b_condition:
                mark = 'B'
            elif has_a_condition:
                mark = 'A'
        else:
            # 如果关键词在竞品1-10中未出现过，标记为A
            mark = 'A'
        
        return mark if mark else 'A'
    
    def process_ao_column(
        self,
        main_df: pd.DataFrame,
        keyword_col: str,
        keyword_base_content: bytes
    ) -> pd.Series:
        """
        处理 AO 列（相关性分类）
        使用整词匹配（正则 \b 边界）
        """
        # 读取拓词基础表
        base_df = self.read_excel_file(keyword_base_content)
        
        # 获取各列的词集合
        col_a = self._get_column_values(base_df, 0)  # A列：核心词
        col_b = self._get_column_values(base_df, 1)  # B列：精准属性词
        col_c = self._get_column_values(base_df, 2)  # C列：泛属性词
        col_d = self._get_column_values(base_df, 3)  # D列：不相关词
        col_e = self._get_column_values(base_df, 4)  # E列：品牌词
        
        results = []
        keywords = main_df[keyword_col].astype(str).str.strip()
        
        for keyword in keywords:
            label = self._classify_ao(keyword, col_a, col_b, col_c, col_d, col_e)
            results.append(label)
        
        return pd.Series(results)
    
    def _get_column_values(self, df: pd.DataFrame, col_index: int) -> Set[str]:
        """获取指定列的值集合"""
        if col_index >= len(df.columns):
            return set()
        col_name = df.columns[col_index]
        values = df[col_name].dropna().astype(str).str.strip()
        # 过滤空值
        return set(v for v in values if v and v.lower() != 'nan')
    
    def _contains_word(self, text: str, word: str) -> bool:
        """检查文本是否包含完整单词（整词匹配）"""
        if not word:
            return False
        # 使用正则表达式进行整词匹配
        pattern = r'\b' + re.escape(word.lower()) + r'\b'
        return bool(re.search(pattern, text.lower()))
    
    def _contains_any_word(self, text: str, words: Set[str]) -> bool:
        """检查文本是否包含集合中的任意一个完整单词"""
        for word in words:
            if self._contains_word(text, word):
                return True
        return False
    
    def _classify_ao(
        self,
        keyword: str,
        col_a: Set[str],
        col_b: Set[str],
        col_c: Set[str],
        col_d: Set[str],
        col_e: Set[str]
    ) -> str:
        """单个关键词的 AO 分类"""
        
        contains_a = self._contains_any_word(keyword, col_a)
        contains_b = self._contains_any_word(keyword, col_b)
        contains_c = self._contains_any_word(keyword, col_c)
        contains_d = self._contains_any_word(keyword, col_d)
        contains_e = self._contains_any_word(keyword, col_e)
        
        # 1. 不相关词（最高优先级）
        if contains_d:
            return "不相关词"
        
        # 2. 品牌词
        if contains_e:
            return "品牌词"
        
        # 3. a精准属性精准词：包含A+B，不含D/E
        if contains_a and contains_b and not contains_d and not contains_e:
            return "a精准属性精准词"
        
        # 4. b泛属性精准词：包含A+C，不含B/D/E
        if contains_a and contains_c and not contains_b and not contains_d and not contains_e:
            return "b泛属性精准词"
        
        # 5. 大词或泛词：仅含A，不含B/C/D/E
        if contains_a and not contains_b and not contains_c and not contains_d and not contains_e:
            return "大词或泛词"
        
        # 6. 相关词
        # 条件1: 包含B或C，不含A/D/E
        if (contains_b or contains_c) and not contains_a and not contains_d and not contains_e:
            return "相关词"
        
        # 条件2: 不包含A/B/C/D/E任何一个
        if not contains_a and not contains_b and not contains_c and not contains_d and not contains_e:
            return "相关词"
        
        # 默认返回相关词
        return "相关词"
    
    def process_ap_column(
        self,
        main_df: pd.DataFrame,
        search_volume_col: str
    ) -> pd.Series:
        """
        处理 AP 列（流量大小分类）
        基于搜索量的累计百分比
        """
        # 获取搜索量数据
        volumes = pd.to_numeric(main_df[search_volume_col], errors='coerce').fillna(0)
        
        # 创建临时 DataFrame 用于排序和计算
        temp_df = pd.DataFrame({
            'original_index': range(len(volumes)),
            'volume': volumes
        })
        
        # 按搜索量从高到低排序
        temp_df = temp_df.sort_values('volume', ascending=False).reset_index(drop=True)
        
        # 计算总搜索量
        total_volume = temp_df['volume'].sum()
        
        if total_volume == 0:
            # 如果总搜索量为0，全部标记为低流量词4
            return pd.Series(['低流量词4'] * len(volumes))
        
        # 计算累计百分比
        temp_df['cumsum'] = temp_df['volume'].cumsum()
        temp_df['cum_percent'] = temp_df['cumsum'] / total_volume * 100
        
        # 根据累计百分比分类
        def classify_traffic(cum_percent):
            if cum_percent <= 40:
                return '高流量词1'
            elif cum_percent <= 70:
                return '中高流量词2'
            elif cum_percent <= 90:
                return '中低流量词3'
            else:
                return '低流量词4'
        
        temp_df['label'] = temp_df['cum_percent'].apply(classify_traffic)
        
        # 恢复原始顺序
        temp_df = temp_df.sort_values('original_index').reset_index(drop=True)
        
        return temp_df['label']
    
    def process(
        self,
        h10_main: bytes,
        self_asin: bytes,
        competitor_aba: bytes,
        competitors: List[bytes],
        keyword_base: bytes
    ) -> bytes:
        """
        主处理函数
        返回处理后的 Excel 文件内容
        """
        self.update_progress(35, "读取主表...")
        
        # 1. 读取 H10 主表
        main_df = self.read_excel_file(h10_main)
        
        # 查找关键词列
        keyword_col = self.find_column(main_df, self.KEYWORD_COLUMNS)
        if not keyword_col:
            keyword_col = main_df.columns[0]
        
        # 查找搜索量列（D列或匹配的列名）
        search_volume_col = self.find_column(main_df, self.SEARCH_VOLUME_COLUMNS)
        if not search_volume_col and len(main_df.columns) >= 4:
            search_volume_col = main_df.columns[3]  # D列（索引3）
        
        self.update_progress(40, "读取自身ASIN反查...")
        
        # 2. 读取自身ASIN反查
        self_asin_df = self.read_excel_file(self_asin)
        self_asin_keywords = self.get_keywords_set(self_asin_df)
        
        self.update_progress(45, "读取竞对ABA热搜词反查...")
        
        # 3. 读取竞对ABA热搜词反查（第二工作表）
        competitor_aba_keywords = self.get_competitor_aba_keywords(competitor_aba)
        
        self.update_progress(50, "读取竞品数据...")
        
        # 4. 读取竞品数据
        competitor_data_list = []
        for i, comp_content in enumerate(competitors):
            if comp_content:
                try:
                    comp_df = self.get_competitor_data(comp_content)
                    competitor_data_list.append(comp_df)
                except Exception as e:
                    print(f"读取竞品{i+1}失败: {str(e)}")
        
        self.update_progress(60, "处理 AN 列（关键词类别）...")
        
        # 5. 处理 AN 列
        an_series = self.process_an_column(
            main_df, 
            keyword_col,
            self_asin_keywords,
            competitor_aba_keywords,
            competitor_data_list
        )
        main_df['关键词类别'] = an_series
        
        self.update_progress(75, "处理 AO 列（相关性分类）...")
        
        # 6. 处理 AO 列
        ao_series = self.process_ao_column(main_df, keyword_col, keyword_base)
        main_df['相关性分类'] = ao_series
        
        self.update_progress(85, "处理 AP 列（流量大小分类）...")
        
        # 7. 处理 AP 列
        if search_volume_col:
            ap_series = self.process_ap_column(main_df, search_volume_col)
            main_df['流量大小分类'] = ap_series
        else:
            main_df['流量大小分类'] = '未知'
        
        self.update_progress(95, "生成结果文件...")
        
        # 8. 输出结果
        output = BytesIO()
        main_df.to_excel(output, index=False, engine='openpyxl')
        output.seek(0)
        
        return output.getvalue()

