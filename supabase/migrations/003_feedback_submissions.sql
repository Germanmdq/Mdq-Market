create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  feedback_type text not null default 'Mejora',
  message text not null,
  contact text null,
  page_url text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists feedback_submissions_created_at_idx
on public.feedback_submissions(created_at desc);

create index if not exists feedback_submissions_user_id_idx
on public.feedback_submissions(user_id);

alter table public.feedback_submissions enable row level security;

drop policy if exists "Anyone can submit feedback" on public.feedback_submissions;
create policy "Anyone can submit feedback"
on public.feedback_submissions
for insert
with check (true);

drop policy if exists "Users can read own feedback" on public.feedback_submissions;
create policy "Users can read own feedback"
on public.feedback_submissions
for select
using (auth.uid() = user_id);
