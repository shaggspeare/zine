-- Landing page storage (spec sections 14.1 and 14.2). The go/no-go gate is 200
-- organic sign-ups in four weeks, so source and utm have to survive on the row:
-- paid traffic is excluded from that count and cannot be separated later.

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  locale text not null check (locale in ('en', 'uk')),
  source text,
  utm jsonb not null default '{}'::jsonb,
  -- Double opt-in is not wired up yet; the column is here so confirmed sign-ups
  -- can be counted separately once it is.
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index waitlist_created_at_idx on waitlist (created_at);

-- Landing page events, including the fake-door price click. Kept here rather than
-- only in an analytics product so the launch decision does not depend on one.
create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name in (
    'page_view', 'waitlist_signup', 'sample_download', 'print_photo_submitted', 'price_click'
  )),
  locale text check (locale in ('en', 'uk')),
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index events_name_created_at_idx on events (name, created_at);

-- Writes go through the server, which uses the service role, so no anon policies.
alter table waitlist enable row level security;
alter table events enable row level security;
