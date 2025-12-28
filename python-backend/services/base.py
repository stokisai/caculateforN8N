"""
基础服务类

所有新服务必须继承此类。
"""

from abc import ABC, abstractmethod
from typing import Optional, Union
import pandas as pd


class BaseService(ABC):
    """
    服务基类
    
    所有服务必须继承此类并实现 process 方法。
    
    属性:
    - SERVICE_ID: 服务 ID（与 Supabase 中的 id 对应）
    - SERVICE_NAME: 服务名称
    - INPUT_TYPE: 输入类型 ('file', 'text', 'both')
    - OUTPUT_TYPE: 输出类型 ('excel', 'json', 'text')
    """
    
    SERVICE_ID: str = ""
    SERVICE_NAME: str = ""
    INPUT_TYPE: str = "file"  # 'file', 'text', 'both'
    OUTPUT_TYPE: str = "excel"  # 'excel', 'json', 'text'
    
    @abstractmethod
    def process(
        self, 
        df: Optional[pd.DataFrame] = None, 
        input_text: Optional[str] = None
    ) -> Union[pd.DataFrame, str, dict]:
        """
        处理输入数据
        
        参数:
        - df: 输入的 DataFrame（文件上传时）
        - input_text: 输入的文本（文本输入时）
        
        返回:
        - pd.DataFrame: Excel 输出
        - str: 文本输出
        - dict: JSON 输出
        """
        pass
    
    async def handle(self, file=None, input_text: str = None):
        """
        处理请求的入口方法
        
        子类通常不需要重写此方法。
        """
        df = None
        if file:
            import io
            content = await file.read()
            df = pd.read_excel(io.BytesIO(content))
        
        return self.process(df, input_text)
    
    def validate_input(self, df=None, input_text=None) -> bool:
        """
        验证输入是否有效
        
        返回:
        - True: 输入有效
        - False: 输入无效
        """
        if self.INPUT_TYPE == "file":
            return df is not None and not df.empty
        elif self.INPUT_TYPE == "text":
            return input_text is not None and input_text.strip() != ""
        elif self.INPUT_TYPE == "both":
            return (df is not None and not df.empty) or (input_text is not None and input_text.strip() != "")
        return False

