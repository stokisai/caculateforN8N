"""
配置管理

所有配置项从环境变量读取，禁止硬编码。
"""

import os
from typing import Optional


class Config:
    """应用配置"""
    
    # Supabase 配置
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_KEY")
    
    # API 密钥
    SERP_API_KEY: Optional[str] = os.getenv("SERP_API_KEY")
    OPENROUTER_API_KEY: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    RAPIDAPI_KEY: Optional[str] = os.getenv("RAPIDAPI_KEY")
    
    # API 端点
    SERP_API_URL: str = "https://serpapi.com/search"
    OPENROUTER_API_URL: str = "https://openrouter.ai/api/v1/chat/completions"
    RAPIDAPI_HOST: str = "realtime-amazon-data.p.rapidapi.com"
    
    # 应用配置
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    REQUEST_TIMEOUT: int = int(os.getenv("REQUEST_TIMEOUT", "60"))
    
    @classmethod
    def validate(cls) -> list:
        """
        验证必需的配置项
        
        返回:
        - 缺失的配置项列表
        """
        missing = []
        
        # 检查必需的配置
        required = [
            ("SERP_API_KEY", cls.SERP_API_KEY),
            ("OPENROUTER_API_KEY", cls.OPENROUTER_API_KEY),
        ]
        
        for name, value in required:
            if not value or cls._is_placeholder(value):
                missing.append(name)
        
        return missing
    
    @staticmethod
    def _is_placeholder(value: str) -> bool:
        """检查是否是占位符值"""
        if not value:
            return False
        placeholders = [
            "__n8n_BLANK_VALUE_",
            "__BLANK_VALUE__",
            "your-",
            "placeholder",
            "REPLACE_ME"
        ]
        return any(p.lower() in value.lower() for p in placeholders)


# 全局配置实例
config = Config()

# 启动时验证配置
missing = config.validate()
if missing:
    print(f"⚠️ 警告: 以下配置项未设置: {', '.join(missing)}")

