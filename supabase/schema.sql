-- =====================================================================
-- canerdogru.com — Supabase şeması
-- SQL Editor'a yapıştırıp çalıştırın (tek seferlik kurulum).
-- =====================================================================

-- ---------------------------------------------------------------------
-- basvurular — /rontgen başvuru formu (7 alan)
-- ---------------------------------------------------------------------
create table if not exists public.basvurular (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  ad_soyad       text not null,
  isletme_adi    text,
  telefon        text not null,
  eposta         text not null,
  web_sitesi     text,
  instagram      text,
  reklam_butcesi text not null,
  kaynak         text not null default 'rontgen'
);

create index if not exists basvurular_created_at_idx on public.basvurular (created_at desc);

alter table public.basvurular enable row level security;
drop policy if exists "anon can insert basvurular" on public.basvurular;
create policy "anon can insert basvurular"
  on public.basvurular
  for insert
  to anon
  with check (true);

-- ---------------------------------------------------------------------
-- checklist_subscribers — /checklist lead magnet (2 alan)
-- ---------------------------------------------------------------------
create table if not exists public.checklist_subscribers (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  isim       text not null,
  eposta     text not null,
  kaynak     text not null default 'checklist'
);

create index if not exists checklist_created_at_idx
  on public.checklist_subscribers (created_at desc);

alter table public.checklist_subscribers enable row level security;
drop policy if exists "anon can insert checklist" on public.checklist_subscribers;
create policy "anon can insert checklist"
  on public.checklist_subscribers
  for insert
  to anon
  with check (true);

-- NOT: select/update/delete policy verilmiyor → anon için kapalı.
-- Kayıtları yalnızca Dashboard (service_role) ile görürsünüz.
