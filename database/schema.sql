create table products (
  id bigint generated always as identity primary key,
  title text not null,
  price int not null,
  image text,
  created_at timestamptz default now()
);
alter table products enable row level security;

create table impact_log (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  user_code text not null,
  consent text,
  quote text,
  allow_quote boolean default false
);
alter table impact_log enable row level security;
create policy "ทุกคนอ่านได้อย่างเดียว"
  on impact_log for select
  using (true);