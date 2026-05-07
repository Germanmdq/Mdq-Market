create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete cascade,
  anonymous_id text null,

  event_type text not null,
  entity_type text not null,
  entity_id uuid null,

  title text null,
  slug text null,
  category_id uuid null references public.categories(id) on delete set null,
  subcategory_id uuid null references public.categories(id) on delete set null,

  search_query text null,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists user_activity_user_id_idx
on public.user_activity(user_id);

create index if not exists user_activity_anonymous_id_idx
on public.user_activity(anonymous_id);

create index if not exists user_activity_event_type_idx
on public.user_activity(event_type);

create index if not exists user_activity_created_at_idx
on public.user_activity(created_at desc);

alter table public.user_activity enable row level security;

drop policy if exists "Users can read own activity" on public.user_activity;
create policy "Users can read own activity"
on public.user_activity
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own activity" on public.user_activity;
create policy "Users can insert own activity"
on public.user_activity
for insert
with check (
  auth.uid() = user_id
  or user_id is null
);

drop policy if exists "Users can delete own activity" on public.user_activity;
create policy "Users can delete own activity"
on public.user_activity
for delete
using (auth.uid() = user_id);
