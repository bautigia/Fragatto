-- Fragatto — contador de visitas para /admin.
-- Pegar en el SQL Editor de Supabase (solo esto, es un agregado al schema.sql
-- que ya corriste antes — no hace falta volver a correr ese).

create table if not exists page_views (
  id bigserial primary key,
  tipo text not null,
  producto_id text,
  created_at timestamptz not null default now()
);

alter table page_views enable row level security;

-- Cualquiera puede registrar una visita (lo hace el propio sitio, sin login).
create policy "insert publico visitas" on page_views
  for insert with check (tipo in ('home', 'catalogo', 'producto', 'nosotros', 'contacto'));

-- Pero solo el admin logueado puede leer los números.
create policy "lectura admin visitas" on page_views
  for select using (auth.role() = 'authenticated');
