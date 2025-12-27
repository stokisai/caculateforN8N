-- 更新 services 表的 webhook_url 为 FastAPI endpoint
-- FastAPI URL: https://caculateforn8n-production.up.railway.app

-- 注意：请根据实际的 FastAPI endpoint 路径修改以下 SQL

-- 1. Ex大名) - 需要确认 endpoint 路径
UPDATE public.services 
SET webhook_url = 'https://caculateforn8n-production.up.railway.app/api/ex-daming'
WHERE id = 'abfaf85c-9553-4d7b-9416-e3aff65e8587';

-- 2. 计算投产比 - 需要确认 endpoint 路径
UPDATE public.services 
SET webhook_url = 'https://caculateforn8n-production.up.railway.app/api/calculate-roi'
WHERE id = '65bb6f50-5087-488e-8f1b-350d4ed9fe00';

-- 3. 筛选核心关键词 - 需要确认 endpoint 路径
UPDATE public.services 
SET webhook_url = 'https://caculateforn8n-production.up.railway.app/api/filter-keywords'
WHERE id = 'd144da99-d3e6-4b78-9cd5-70b1e4ced346';

-- 验证更新结果
SELECT id, title, webhook_url FROM public.services ORDER BY created_at DESC;









