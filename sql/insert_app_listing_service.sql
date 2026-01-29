-- Insert APP listing service card
insert into public.services (id, title, description, image_url, webhook_url, input_type)
values (
  'd2e62616-44ff-4623-90e2-33ce28d0b9ba',
  'APP版本亚马逊listing打造',
  '站内打开 APP 版本页面，适合移动端/桌面端使用。',
  '/images/app-listing.svg',
  '/app-listing',
  'text'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  webhook_url = excluded.webhook_url,
  input_type = excluded.input_type;
