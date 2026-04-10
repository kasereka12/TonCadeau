-- Table publique des profils utilisateurs (synchronisée avec auth.users)
create table if not exists public.profiles (
    id          uuid        references auth.users(id) on delete cascade primary key,
    email       text,
    full_name   text,²
    role        text        not null default 'client',
    created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Chaque utilisateur peut lire son propre profil
create policy "profiles_self_read"
    on public.profiles for select
    using (auth.uid() = id);

-- L'admin peut tout lire
create policy "profiles_admin_read"
    on public.profiles for select
    using (
        exists (
            select 1 from auth.users u
            where u.id = auth.uid()
              and (u.raw_user_meta_data->>'role') = 'admin'
        )
    );

-- Trigger : crée automatiquement un profil à chaque inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, email, full_name, role)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        coalesce(nullif(new.raw_user_meta_data->>'role', ''), 'client')
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
