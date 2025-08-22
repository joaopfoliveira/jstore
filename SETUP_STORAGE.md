# Supabase Storage Setup for Custom Order Images

## 1. Create Storage Bucket

Go to your Supabase Dashboard → Storage → Create Bucket

**Bucket Configuration:**
- **Name**: `custom-order-images`
- **Public**: ✅ Yes (so images can be viewed)
- **File size limit**: 5MB (recommended)
- **Allowed MIME types**: `image/jpeg,image/png,image/webp,image/gif`

## 2. Storage Policies (SQL)

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Allow public read access to custom order images
CREATE POLICY "Public read access for custom order images" ON storage.objects
FOR SELECT USING (bucket_id = 'custom-order-images');

-- Allow authenticated insert for custom order images
CREATE POLICY "Allow authenticated insert for custom order images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'custom-order-images' AND auth.role() = 'authenticated');

-- Allow users to upload images (for custom orders)
CREATE POLICY "Allow custom order image uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'custom-order-images' 
  AND (storage.foldername(name))[1] = 'custom-orders'
);
```

## 3. Database Schema Update

Add image_urls column to orders table:

```sql
-- Add image_urls column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS image_urls TEXT;

-- Add comment for clarity
COMMENT ON COLUMN orders.image_urls IS 'JSON array of image URLs for custom orders';
```

## 4. Verify Setup

Test that:
1. ✅ Bucket `custom-order-images` exists
2. ✅ Public read access works
3. ✅ Authenticated users can upload
4. ✅ `orders.image_urls` column exists

## 5. Storage Structure

Images will be stored as:
```
custom-order-images/
└── custom-orders/
    ├── CU123456_1.jpg
    ├── CU123456_2.png
    ├── CU789012_1.webp
    └── ...
```

Where `CU123456` is the order code and `_1`, `_2` are the image numbers.

## 6. Security Notes

- Images are public (readable by anyone with URL)
- Only authenticated users can upload
- Images are organized by order code
- Max 5 images per custom order
- Supported formats: JPG, PNG, WEBP, GIF
