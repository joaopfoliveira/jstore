-- Supabase Storage Setup for Custom Order Images
-- Run this in your Supabase SQL Editor

-- 1. Add image_urls column to orders table (if not exists)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS image_urls TEXT;

-- Add comment for clarity
COMMENT ON COLUMN orders.image_urls IS 'JSON array of image URLs for custom orders';

-- 2. Storage bucket policies (run after creating the bucket in UI)
-- Note: Create bucket 'custom-order-images' in Supabase Dashboard first!

-- Allow public read access to custom order images
CREATE POLICY "Public read access for custom order images" ON storage.objects
FOR SELECT USING (bucket_id = 'custom-order-images');

-- Allow authenticated users to upload custom order images
CREATE POLICY "Allow custom order image uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'custom-order-images' 
  AND (storage.foldername(name))[1] = 'custom-orders'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own uploaded images (optional)
CREATE POLICY "Allow delete custom order images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'custom-order-images' 
  AND (storage.foldername(name))[1] = 'custom-orders'
  AND auth.role() = 'authenticated'
);

-- Verify the setup
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name = 'image_urls';

-- Expected result: image_urls | text | YES
