create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  champion_id integer not null,
  opponent_id integer not null,
  relation_type text not null check (relation_type in ('counter', 'synergy')),
  score_diff integer not null default 0,
  created_at timestamptz not null default now(),
  unique (champion_id, opponent_id, relation_type)
);
