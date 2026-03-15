-- ============================================================
--  Table: orders
--  Stocke les commandes passées par les clients.
-- ============================================================

create table if not exists public.orders (
    id              text primary key,
    user_id         uuid references auth.users(id) on delete cascade not null,
    items           jsonb not null default '[]',
    delivery_info   jsonb not null default '{}',
    gift_message    text not null default '',
    total           numeric(10, 2) not null,
    status          text not null default 'confirmed'
                    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    payment_method  text,
    created_at      timestamptz not null default now()
);

-- Index pour récupérer rapidement les commandes d'un utilisateur
create index if not exists orders_user_id_idx on public.orders (user_id, created_at desc);

-- ── Row Level Security ──────────────────────────────────────
alter table public.orders enable row level security;

-- Un client peut voir uniquement ses propres commandes
create policy "client_select_own_orders"
    on public.orders for select
    using (auth.uid() = user_id);

-- Un client peut insérer uniquement ses propres commandes
create policy "client_insert_own_orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

-- L'admin peut tout voir (optionnel)
create policy "admin_select_all_orders"
    on public.orders for select
    using (
        exists (
            select 1 from auth.users u
            where u.id = auth.uid()
            and u.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- L'admin peut mettre à jour le statut des commandes
create policy "admin_update_order_status"
    on public.orders for update
    using (
        exists (
            select 1 from auth.users u
            where u.id = auth.uid()
            and u.raw_user_meta_data->>'role' = 'admin'
        )
    );
