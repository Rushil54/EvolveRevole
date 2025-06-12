create table users (
  id uuid primary key default gen_random_uuid()
);
create table products (
  id uuid primary key default gen_random_uuid()
);
create table cart_items (
  id uuid primary key default gen_random_uuid()
);
create table orders (
  id uuid primary key default gen_random_uuid()
);
create table order_items (
  id uuid primary key default gen_random_uuid()
);
