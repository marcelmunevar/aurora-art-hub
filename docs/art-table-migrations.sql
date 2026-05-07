-- Add instagram_url column to the art table.
alter table art add column instagram_url text;

-- Add etsy_url column to the art table.
alter table art add column etsy_url text;

-- Add image_path column to store private object paths for signed URL generation.
alter table public.art
add column if not exists image_path text;

-- Store uploaded image dimensions so next/image can use the real aspect ratio.
alter table public.art
add column if not exists image_width integer;

alter table public.art
add column if not exists image_height integer;