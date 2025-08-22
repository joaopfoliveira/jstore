-- CORRECTED Supabase Storage Setup for Custom Order Images
-- Run this in your Supabase SQL Editor AFTER creating the bucket

-- 1. First, make sure the image_urls column exists
ALTER TABLE orders ADD COLUMN IF NOT EXISTS image_urls TEXT;
COMMENT ON COLUMN orders.image_urls IS 'JSON array of image URLs for custom orders';

-- 2. Drop existing policies (if any) to start fresh
DROP POLICY IF EXISTS "Public read access for custom order images" ON storage.objects;
DROP POLICY IF EXISTS "Allow custom order image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete custom order images" ON storage.objects;

-- 3. Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Create permissive policies for custom-order-images bucket

-- Allow public read access to custom order images
CREATE POLICY "Public read custom order images" ON storage.objects
FOR SELECT USING (bucket_id = 'custom-order-images');

-- Allow anyone to upload to custom-orders folder (more permissive for public forms)
CREATE POLICY "Allow public upload custom order images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'custom-order-images' 
  AND (storage.foldername(name))[1] = 'custom-orders'
);

-- Allow public to update/replace their own uploads (optional)
CREATE POLICY "Allow public update custom order images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'custom-order-images' 
  AND (storage.foldername(name))[1] = 'custom-orders'
);

-- Allow public to delete (optional, for replacing images)
CREATE POLICY "Allow public delete custom order images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'custom-order-images' 
  AND (storage.foldername(name))[1] = 'custom-orders'
);

-- 5. Verify policies were created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND policyname LIKE '%custom order%';

-- 6. Verify the orders table column
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name = 'image_urls';

-- Expected results:
-- - 4 policies for custom order images
-- - image_urls column exists as TEXT
