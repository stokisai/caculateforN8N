-- 创建 H10竞品分析服务
-- Service ID: a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f

INSERT INTO public.services (id, title, description, image_url, webhook_url, input_type)
VALUES (
  'a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f',
  'H10竞品分析',
  '上传H10数据文件（支持ZIP压缩包或多个Excel文件），AI将自动分析竞品数据并生成分析报告。',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'https://caculateforn8n-production.up.railway.app/process',
  'file'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  webhook_url = EXCLUDED.webhook_url,
  input_type = EXCLUDED.input_type;

-- 验证插入
SELECT id, title, description, input_type, webhook_url 
FROM public.services 
WHERE id = 'a8f3c2d1-4e5b-6c7d-8e9f-0a1b2c3d4e5f';







