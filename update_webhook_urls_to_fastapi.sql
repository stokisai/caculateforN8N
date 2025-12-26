-- 更新所有服务的 webhook_url 为统一的 FastAPI 端点
-- FastAPI URL: https://caculateforn8n-production.up.railway.app/process

UPDATE public.services
SET webhook_url = 'https://caculateforn8n-production.up.railway.app/process'
WHERE id IN (
  'd144da99-d3e6-4b78-9cd5-70b1e4ced346',  -- 筛选核心关键词
  'abfaf85c-9553-4d7b-9416-e3aff65e8587',  -- Ex大名)
  '65bb6f50-5087-488e-8f1b-350d4ed9fe00'   -- 计算投产比
);

-- 验证更新结果
SELECT id, title, webhook_url, input_type
FROM public.services
ORDER BY created_at DESC;





