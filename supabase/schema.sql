-- Fragatto — overrides de precio y stock editables desde /admin.
-- Pegar una sola vez en el SQL Editor de Supabase (Project > SQL Editor > New query).
-- El resto del catálogo (nombre, marca, descripción, notas, imagen) sigue viviendo
-- en data/perfumes.json / data/combos.json, estas tablas solo pisan precio y stock.

create table if not exists formato_precio_stock (
  producto_id text not null,
  ml integer not null,
  tipo text not null,
  precio numeric,
  stock integer,
  updated_at timestamptz not null default now(),
  primary key (producto_id, ml, tipo)
);

create table if not exists combo_precio_stock (
  combo_id text primary key,
  precio numeric,
  disponible boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table formato_precio_stock enable row level security;
alter table combo_precio_stock enable row level security;

-- Lectura pública: el sitio necesita leer precio/stock sin que el visitante esté logueado.
create policy "lectura publica formatos" on formato_precio_stock
  for select using (true);

create policy "lectura publica combos" on combo_precio_stock
  for select using (true);

-- Escritura solo para el usuario admin logueado (creado a mano en Authentication > Users).
create policy "escritura admin formatos" on formato_precio_stock
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "escritura admin combos" on combo_precio_stock
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Contador de visitas (ver migration_page_views.sql si ya corriste lo de arriba
-- antes y solo te falta esto).
create table if not exists page_views (
  id bigserial primary key,
  tipo text not null,
  producto_id text,
  created_at timestamptz not null default now()
);

alter table page_views enable row level security;

create policy "insert publico visitas" on page_views
  for insert with check (tipo in ('home', 'catalogo', 'producto', 'nosotros', 'contacto'));

create policy "lectura admin visitas" on page_views
  for select using (auth.role() = 'authenticated');
