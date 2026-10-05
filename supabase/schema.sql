-- Dehra Cakes — proposed Supabase schema (not yet applied).
-- Mirrors the TypeScript types in lib/types.ts so the static demo data in
-- lib/data/* can be swapped for queries in lib/services/* without UI changes.

create table categories (
  slug        text primary key,            -- 'birthday', 'wedding', ...
  name        text not null,
  blurb       text,
  image_url   text,
  sort_order  int default 0
);

create table products (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  tagline        text,
  description    text,
  story          text,
  flavour_notes  text[] default '{}',
  image_url      text not null,
  gallery_urls   text[] default '{}',
  eggless        boolean default true,
  has_3d         boolean default false,
  badge          text,
  is_active      boolean default true,
  created_at     timestamptz default now()
);

create table product_sizes (
  id          text not null,                -- '0.5kg', '1kg', ...
  product_id  uuid references products(id) on delete cascade,
  label       text not null,
  weight_kg   numeric(4,2) not null,
  serves      text,
  price_inr   int not null,
  primary key (product_id, id)
);

create table product_categories (
  product_id    uuid references products(id) on delete cascade,
  category_slug text references categories(slug) on delete cascade,
  primary key (product_id, category_slug)
);

create table customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  created_at  timestamptz default now()
);

create type fulfilment as enum ('delivery', 'pickup');
create type order_status as enum ('pending', 'confirmed', 'baking', 'ready', 'completed', 'cancelled');

-- A pre-order is the order record before payment exists.
create table orders (
  id            uuid primary key default gen_random_uuid(),
  reference     text unique not null,
  customer_id   uuid references customers(id),
  fulfilment    fulfilment not null,
  date          date not null,
  time_slot     text not null,
  address       text,
  instructions  text,
  subtotal_inr  int not null,
  delivery_inr  int not null default 0,
  status        order_status not null default 'pending',
  created_at    timestamptz default now()
);

create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id) on delete cascade,
  product_id  uuid references products(id),
  size_id     text not null,
  quantity    int not null check (quantity > 0),
  unit_price_inr int not null,
  message     text
);

create table enquiries (
  id                 uuid primary key default gen_random_uuid(),
  reference          text unique not null,
  name               text not null,
  phone              text not null,
  flavour            text,
  size               text,
  date               date,
  message            text,
  inspiration_path   text,                  -- Supabase Storage object path
  status             text default 'new',
  created_at         timestamptz default now()
);

-- Public read for the catalogue; writes only via server actions (service role).
alter table products enable row level security;
alter table product_sizes enable row level security;
alter table categories enable row level security;
create policy "catalogue is public" on products for select using (is_active);
create policy "sizes are public" on product_sizes for select using (true);
create policy "categories are public" on categories for select using (true);

alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table enquiries enable row level security;
