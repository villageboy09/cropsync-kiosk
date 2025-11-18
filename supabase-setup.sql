-- CropSync Kiosk - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create crops table
create table if not exists crops (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  
  -- Basic information
  name text not null,
  name_te text,
  category text,
  category_te text,
  description text,
  description_te text,
  
  -- Seasonal information
  season text,
  season_te text,
  status text default 'active',
  status_te text,
  
  -- Location and yield
  location text,
  yield_estimate text,
  image_url text,
  harvest_date date,
  
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table crops enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own crops" on crops;
drop policy if exists "Users can insert their own crops" on crops;
drop policy if exists "Users can update their own crops" on crops;
drop policy if exists "Users can delete their own crops" on crops;

-- Create RLS policies
create policy "Users can view their own crops"
  on crops for select
  using (auth.uid() = user_id);

create policy "Users can insert their own crops"
  on crops for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own crops"
  on crops for update
  using (auth.uid() = user_id);

create policy "Users can delete their own crops"
  on crops for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists update_crops_updated_at on crops;
create trigger update_crops_updated_at
  before update on crops
  for each row
  execute function update_updated_at_column();

-- Create indexes for better performance
create index if not exists crops_user_id_idx on crops(user_id);
create index if not exists crops_created_at_idx on crops(created_at desc);
create index if not exists crops_status_idx on crops(status);

-- Insert sample data (optional - for testing)
-- Replace 'your-user-id' with an actual user ID from auth.users
/*
insert into crops (user_id, name, name_te, category, category_te, description, description_te, season, season_te, status, location, yield_estimate) values
  ('your-user-id', 'Rice', 'వరి', 'Grain', 'ధాన్యం', 'High-yield rice variety', 'అధిక దిగుబడి వరి రకం', 'Kharif', 'ఖరీఫ్', 'active', 'Field A1', '5 tons/hectare'),
  ('your-user-id', 'Cotton', 'పత్తి', 'Cash Crop', 'నగదు పంట', 'Long staple cotton', 'పొడవైన పత్తి', 'Rabi', 'రబీ', 'active', 'Field B2', '3 tons/hectare'),
  ('your-user-id', 'Tomato', 'టమాటా', 'Vegetable', 'కూరగాయ', 'Hybrid tomato variety', 'హైబ్రిడ్ టమాటా రకం', 'Summer', 'వేసవి', 'active', 'Greenhouse 1', '20 tons/hectare');
*/

-- Create storage bucket for crop images (run this in Supabase Storage)
/*
insert into storage.buckets (id, name, public)
values ('crop-images', 'crop-images', true);

-- Storage policy for crop images
create policy "Users can upload crop images"
  on storage.objects for insert
  with check (bucket_id = 'crop-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view crop images"
  on storage.objects for select
  using (bucket_id = 'crop-images');

create policy "Users can update their crop images"
  on storage.objects for update
  using (bucket_id = 'crop-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their crop images"
  on storage.objects for delete
  using (bucket_id = 'crop-images' and auth.uid()::text = (storage.foldername(name))[1]);
*/
