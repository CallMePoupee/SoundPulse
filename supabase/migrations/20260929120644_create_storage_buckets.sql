/*
# Create Storage Buckets for Image Assets

## Overview
This migration creates Supabase Storage buckets for all image assets used in the music chart archive app.
The app uses images for: song covers, album covers, performer covers, song banners, album banners,
performer banners, chart banners, page banners, honor badges, header navigation icons, backgrounds,
popups, and the admin CSV interface image.

## Buckets Created
1. covers — Song, album, and performer cover art (public read, authenticated write)
2. banners — Song, album, performer, chart, and page banner images (public read, authenticated write)
3. honors — Honor badge images (public read, authenticated write)
4. site-assets — Header navigation icons, backgrounds, popups, interface images (public read, authenticated write)

## Security
- All buckets are PUBLIC for reads (anyone can view images).
- Only authenticated users (admins) can upload, update, or delete files.
- File size limit: 10MB per file (reasonable for web images).
- Allowed MIME types: image/png, image/jpeg, image/webp, image/gif, image/svg+xml.
*/

-- ============================================================
-- 1. covers bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'covers',
  'covers',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. banners bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. honors bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'honors',
  'honors',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. site-assets bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Storage Policies
-- For each bucket:
--   SELECT: public (anon, authenticated) — anyone can view images
--   INSERT: authenticated only — only admins can upload
--   UPDATE: authenticated only — only admins can modify
--   DELETE: authenticated only — only admins can delete
-- ============================================================

-- covers policies
DROP POLICY IF EXISTS "covers_public_read" ON storage.objects;
CREATE POLICY "covers_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'covers');

DROP POLICY IF EXISTS "covers_admin_insert" ON storage.objects;
CREATE POLICY "covers_admin_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'covers');

DROP POLICY IF EXISTS "covers_admin_update" ON storage.objects;
CREATE POLICY "covers_admin_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'covers') WITH CHECK (bucket_id = 'covers');

DROP POLICY IF EXISTS "covers_admin_delete" ON storage.objects;
CREATE POLICY "covers_admin_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'covers');

-- banners policies
DROP POLICY IF EXISTS "banners_public_read" ON storage.objects;
CREATE POLICY "banners_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "banners_admin_insert" ON storage.objects;
CREATE POLICY "banners_admin_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'banners');

DROP POLICY IF EXISTS "banners_admin_update" ON storage.objects;
CREATE POLICY "banners_admin_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'banners') WITH CHECK (bucket_id = 'banners');

DROP POLICY IF EXISTS "banners_admin_delete" ON storage.objects;
CREATE POLICY "banners_admin_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'banners');

-- honors policies
DROP POLICY IF EXISTS "honors_public_read" ON storage.objects;
CREATE POLICY "honors_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'honors');

DROP POLICY IF EXISTS "honors_admin_insert" ON storage.objects;
CREATE POLICY "honors_admin_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'honors');

DROP POLICY IF EXISTS "honors_admin_update" ON storage.objects;
CREATE POLICY "honors_admin_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'honors') WITH CHECK (bucket_id = 'honors');

DROP POLICY IF EXISTS "honors_admin_delete" ON storage.objects;
CREATE POLICY "honors_admin_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'honors');

-- site-assets policies
DROP POLICY IF EXISTS "site_assets_public_read" ON storage.objects;
CREATE POLICY "site_assets_public_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "site_assets_admin_insert" ON storage.objects;
CREATE POLICY "site_assets_admin_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "site_assets_admin_update" ON storage.objects;
CREATE POLICY "site_assets_admin_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'site-assets') WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "site_assets_admin_delete" ON storage.objects;
CREATE POLICY "site_assets_admin_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'site-assets');