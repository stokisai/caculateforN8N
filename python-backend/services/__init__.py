"""
服务注册表

所有服务必须在此注册才能被 main.py 调用。

使用方法：
1. 在 services/ 目录创建新服务文件
2. 在此文件导入并注册服务
"""

# 服务注册表：service_id -> 处理函数
# 注意：当前服务仍在 main.py 中，重构后将移至此处

SERVICE_REGISTRY = {
    # "abfaf85c-9553-4d7b-9416-e3aff65e8587": ExDamingService,      # Ex大名
    # "d144da99-d3e6-4b78-9cd5-70b1e4ced346": FilterKeywordsService, # 筛选核心关键词
    # "65bb6f50-5087-488e-8f1b-350d4ed9fe00": CalculateROIService,   # 计算投产比
    # "7b83cf63-0ad0-4c11-8dc5-6d8c242fbfe6": SocialResearchService, # 社媒选品法
}

def get_service(service_id: str):
    """
    根据 service_id 获取服务类
    
    返回:
    - 服务类（如果找到）
    - None（如果未找到）
    """
    return SERVICE_REGISTRY.get(service_id)

