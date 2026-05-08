create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  kind text not null default 'general',
  created_at timestamptz not null default now()
);

create table if not exists public.product_tags (
  product_id uuid not null references public.products(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, tag_id)
);

create table if not exists public.service_tags (
  service_id uuid not null references public.services(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (service_id, tag_id)
);

create table if not exists public.professional_tags (
  professional_id uuid not null references public.professionals(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (professional_id, tag_id)
);

create index if not exists tags_slug_idx on public.tags(slug);
create index if not exists product_tags_tag_id_idx on public.product_tags(tag_id);
create index if not exists service_tags_tag_id_idx on public.service_tags(tag_id);
create index if not exists professional_tags_tag_id_idx on public.professional_tags(tag_id);

alter table public.tags enable row level security;
alter table public.product_tags enable row level security;
alter table public.service_tags enable row level security;
alter table public.professional_tags enable row level security;

drop policy if exists "Anyone can read tags" on public.tags;
create policy "Anyone can read tags"
on public.tags
for select
using (true);

drop policy if exists "Anyone can read product tags" on public.product_tags;
create policy "Anyone can read product tags"
on public.product_tags
for select
using (true);

drop policy if exists "Anyone can read service tags" on public.service_tags;
create policy "Anyone can read service tags"
on public.service_tags
for select
using (true);

drop policy if exists "Anyone can read professional tags" on public.professional_tags;
create policy "Anyone can read professional tags"
on public.professional_tags
for select
using (true);
