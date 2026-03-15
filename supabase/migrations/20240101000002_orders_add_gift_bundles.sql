-- Ajout de la colonne gift_bundles à la table orders
-- Stocke les cadeaux composés (groupe de produits + message + persona)

alter table public.orders
    add column if not exists gift_bundles jsonb not null default '[]';
