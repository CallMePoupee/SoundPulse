/*
# Create Music Chart Archive Schema

## Overview
This migration creates the complete database schema for a music chart archive application.
The app tracks alternative/modern rock chart history with performers, albums, songs,
weekly chart entries, chart events, and honors. It includes an admin area (Supabase auth)
for managing data via CSV import.

## Tables Created

### 1. performers
Music performers/bands tracked in the chart archive.
- id (uuid PK)
- name (text, unique, not null) — performer/band name
- slug (text, unique, not null) — URL-safe slug derived from name
- genres (text[], default '{}') — array of genre tags
- origin (text, nullable) — city/country of origin
- active_years (text, nullable) — e.g. "1976–1996"
- active_since (int, nullable) — year first active
- debut_date (date, nullable) — first chart appearance date
- decade (text, nullable) — decade of debut (e.g. "1990s")
- cover_path (text, nullable) — path to cover image in storage
- banner_path (text, nullable) — path to banner image in storage
- created_at (timestamptz, default now())

### 2. albums
Albums released by performers, tracked on the chart.
- id (uuid PK)
- performer_id (uuid FK → performers.id, ON DELETE CASCADE)
- title (text, not null)
- slug (text, not null) — URL-safe slug
- release_year (int, nullable)
- release_type (text, nullable) — e.g. "Studio Album"
- record_label (text, nullable)
- genre (text, nullable)
- debut_date (date, nullable)
- cover_path (text, nullable) — cover image path in storage
- banner_path (text, nullable) — banner image path in storage
- created_at (timestamptz, default now())
- UNIQUE (performer_id, slug)

### 3. songs
Individual songs tracked on the chart, belonging to an album.
- id (uuid PK)
- album_id (uuid FK → albums.id, ON DELETE CASCADE)
- performer_id (uuid FK → performers.id, ON DELETE CASCADE) — denormalized for easy querying
- title (text, not null)
- slug (text, not null) — URL-safe slug
- single_order (text, nullable) — e.g. "Lead Single"
- genre (text, nullable)
- release_year (int, nullable)
- cover_path (text, nullable) — single art image path
- banner_path (text, nullable) — single banner image path
- created_at (timestamptz, default now())
- UNIQUE (album_id, slug)

### 4. chart_eras
Defines the different chart eras (e.g. Modern Rock Tracks, Alternative Songs, Alternative Airplay).
- id (uuid PK)
- slug (text, unique, not null) — e.g. "modern-rock-tracks"
- label (text, not null) — display name
- banner_path (text, nullable)
- created_at (timestamptz, default now())

### 5. chart_weeks
Individual weekly chart publications.
- id (uuid PK)
- era_id (uuid FK → chart_eras.id, ON DELETE CASCADE)
- week_date (date, not null) — the Saturday/date of that chart week
- week_label (text, nullable) — display label e.g. "Week of September 14, 1999"
- created_at (timestamptz, default now())
- UNIQUE (era_id, week_date)

### 6. chart_entries
Song positions on a given chart week. One row per song per week.
- id (uuid PK)
- chart_week_id (uuid FK → chart_weeks.id, ON DELETE CASCADE)
- song_id (uuid FK → songs.id, ON DELETE CASCADE)
- rank (int, not null) — position on chart that week (1-40)
- previous_rank (int, nullable) — position the prior week (null = was not on chart)
- move_direction (text, nullable) — 'up' | 'down' | 'new' | 're' | null
- move_display (text, nullable) — display string e.g. "↑ 2", "NEW", "RE", "—"
- peak (int, not null) — all-time peak position as of this week
- weeks_on_chart (int, not null) — cumulative weeks on chart as of this week
- status (text, nullable) — 'no1' | 'newpeak' | 'new' | 're' | null
- event_class (text, nullable) — 'chart-leader' | 'prime-contender' | 'biggest-climb' | etc.
- event_label (text, nullable) — display label for event
- state_note (text, nullable) — e.g. "NO. 1", "NEW PEAK"
- note (text, nullable) — e.g. "Single from"
- suffix (text, nullable) — e.g. "reaches #1 on week 14 on the chart"
- created_at (timestamptz, default now())
- UNIQUE (chart_week_id, song_id)
- UNIQUE (chart_week_id, rank)

### 7. album_chart_entries
Album positions on a given chart week (separate album chart).
- id (uuid PK)
- chart_week_id (uuid FK → chart_weeks.id, ON DELETE CASCADE)
- album_id (uuid FK → albums.id, ON DELETE CASCADE)
- rank (int, not null)
- previous_rank (int, nullable)
- move_direction (text, nullable)
- move_display (text, nullable)
- peak (int, not null)
- weeks_on_chart (int, not null)
- status (text, nullable)
- created_at (timestamptz, default now())
- UNIQUE (chart_week_id, album_id)
- UNIQUE (chart_week_id, rank)

### 8. chart_events
Notable events highlighted for a chart week (e.g. "Chart leader", "Biggest climb").
- id (uuid PK)
- chart_week_id (uuid FK → chart_weeks.id, ON DELETE CASCADE)
- event_class (text, not null) — 'chart-leader' | 'prime-contender' | etc.
- badge_value (text, nullable)
- badge_arrow (text, nullable) — 'up' | 'down'
- badge_superscript (text, nullable)
- badge_label (text, nullable)
- label (text, not null) — display title
- copy (text, nullable) — description/body text
- sort_order (int, default 0)
- created_at (timestamptz, default now())

### 9. honors
Award/achievement badges assigned to songs, albums, or performers.
- id (uuid PK)
- entity_type (text, not null) — 'song' | 'album' | 'performer'
- entity_id (uuid, not null) — FK to the relevant table (not enforced with a single FK due to polymorphic nature)
- honor_slug (text, not null) — e.g. "gold", "silver", "fifth"
- badge_alt (text, nullable) — alt text for the badge image
- title (text, not null) — honor title
- description (text, nullable)
- sort_order (int, default 0)
- created_at (timestamptz, default now())

### 10. genres
Master list of musical genres for filtering and organization.
- id (uuid PK)
- name (text, unique, not null)
- slug (text, unique, not null)
- created_at (timestamptz, default now())

## Security (RLS)

All tables have RLS enabled.

**Public read access**: The app is a public chart archive. All visitors (anon + authenticated)
can SELECT from all tables. This uses `TO anon, authenticated USING (true)` for SELECT.

**Admin write access**: Only authenticated users (admins) can INSERT, UPDATE, DELETE.
These policies use `TO authenticated WITH CHECK (true)` / `USING (true)` since any
signed-in user is an admin in this app.

## Indexes
- performers.slug (unique)
- albums (performer_id, slug) unique
- songs (album_id, slug) unique
- chart_weeks (era_id, week_date) unique
- chart_entries (chart_week_id, song_id) unique
- chart_entries (chart_week_id, rank) unique
- album_chart_entries (chart_week_id, album_id) unique
- honors (entity_type, entity_id)
- chart_entries song_id, chart_week_id for cross-queries
- songs performer_id for performer queries
*/

-- ============================================================
-- 1. performers
-- ============================================================
CREATE TABLE IF NOT EXISTS performers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  genres text[] DEFAULT '{}',
  origin text,
  active_years text,
  active_since int,
  debut_date date,
  decade text,
  cover_path text,
  banner_path text,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_performers_slug ON performers (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_performers_name ON performers (name);

ALTER TABLE performers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "performers_select" ON performers;
CREATE POLICY "performers_select" ON performers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "performers_insert" ON performers;
CREATE POLICY "performers_insert" ON performers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "performers_update" ON performers;
CREATE POLICY "performers_update" ON performers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "performers_delete" ON performers;
CREATE POLICY "performers_delete" ON performers FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. albums
-- ============================================================
CREATE TABLE IF NOT EXISTS albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id uuid NOT NULL REFERENCES performers(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  release_year int,
  release_type text,
  record_label text,
  genre text,
  debut_date date,
  cover_path text,
  banner_path text,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_albums_performer_slug ON albums (performer_id, slug);
CREATE INDEX IF NOT EXISTS idx_albums_performer_id ON albums (performer_id);

ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "albums_select" ON albums;
CREATE POLICY "albums_select" ON albums FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "albums_insert" ON albums;
CREATE POLICY "albums_insert" ON albums FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "albums_update" ON albums;
CREATE POLICY "albums_update" ON albums FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "albums_delete" ON albums;
CREATE POLICY "albums_delete" ON albums FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. songs
-- ============================================================
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  performer_id uuid NOT NULL REFERENCES performers(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  single_order text,
  genre text,
  release_year int,
  cover_path text,
  banner_path text,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_songs_album_slug ON songs (album_id, slug);
CREATE INDEX IF NOT EXISTS idx_songs_performer_id ON songs (performer_id);
CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs (album_id);

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "songs_select" ON songs;
CREATE POLICY "songs_select" ON songs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "songs_insert" ON songs;
CREATE POLICY "songs_insert" ON songs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "songs_update" ON songs;
CREATE POLICY "songs_update" ON songs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "songs_delete" ON songs;
CREATE POLICY "songs_delete" ON songs FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. chart_eras
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_eras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  label text NOT NULL,
  banner_path text,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_chart_eras_slug ON chart_eras (slug);

ALTER TABLE chart_eras ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chart_eras_select" ON chart_eras;
CREATE POLICY "chart_eras_select" ON chart_eras FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "chart_eras_insert" ON chart_eras;
CREATE POLICY "chart_eras_insert" ON chart_eras FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "chart_eras_update" ON chart_eras;
CREATE POLICY "chart_eras_update" ON chart_eras FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "chart_eras_delete" ON chart_eras;
CREATE POLICY "chart_eras_delete" ON chart_eras FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 5. chart_weeks
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_weeks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  era_id uuid NOT NULL REFERENCES chart_eras(id) ON DELETE CASCADE,
  week_date date NOT NULL,
  week_label text,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_chart_weeks_era_date ON chart_weeks (era_id, week_date);
CREATE INDEX IF NOT EXISTS idx_chart_weeks_era_id ON chart_weeks (era_id);

ALTER TABLE chart_weeks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chart_weeks_select" ON chart_weeks;
CREATE POLICY "chart_weeks_select" ON chart_weeks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "chart_weeks_insert" ON chart_weeks;
CREATE POLICY "chart_weeks_insert" ON chart_weeks FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "chart_weeks_update" ON chart_weeks;
CREATE POLICY "chart_weeks_update" ON chart_weeks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "chart_weeks_delete" ON chart_weeks;
CREATE POLICY "chart_weeks_delete" ON chart_weeks FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 6. chart_entries
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_week_id uuid NOT NULL REFERENCES chart_weeks(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  rank int NOT NULL,
  previous_rank int,
  move_direction text,
  move_display text,
  peak int NOT NULL,
  weeks_on_chart int NOT NULL,
  status text,
  event_class text,
  event_label text,
  state_note text,
  note text,
  suffix text,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_chart_entries_week_song ON chart_entries (chart_week_id, song_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_chart_entries_week_rank ON chart_entries (chart_week_id, rank);
CREATE INDEX IF NOT EXISTS idx_chart_entries_song_id ON chart_entries (song_id);
CREATE INDEX IF NOT EXISTS idx_chart_entries_week_id ON chart_entries (chart_week_id);

ALTER TABLE chart_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chart_entries_select" ON chart_entries;
CREATE POLICY "chart_entries_select" ON chart_entries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "chart_entries_insert" ON chart_entries;
CREATE POLICY "chart_entries_insert" ON chart_entries FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "chart_entries_update" ON chart_entries;
CREATE POLICY "chart_entries_update" ON chart_entries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "chart_entries_delete" ON chart_entries;
CREATE POLICY "chart_entries_delete" ON chart_entries FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 7. album_chart_entries
-- ============================================================
CREATE TABLE IF NOT EXISTS album_chart_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_week_id uuid NOT NULL REFERENCES chart_weeks(id) ON DELETE CASCADE,
  album_id uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  rank int NOT NULL,
  previous_rank int,
  move_direction text,
  move_display text,
  peak int NOT NULL,
  weeks_on_chart int NOT NULL,
  status text,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_album_chart_entries_week_album ON album_chart_entries (chart_week_id, album_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_album_chart_entries_week_rank ON album_chart_entries (chart_week_id, rank);
CREATE INDEX IF NOT EXISTS idx_album_chart_entries_album_id ON album_chart_entries (album_id);
CREATE INDEX IF NOT EXISTS idx_album_chart_entries_week_id ON album_chart_entries (chart_week_id);

ALTER TABLE album_chart_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "album_chart_entries_select" ON album_chart_entries;
CREATE POLICY "album_chart_entries_select" ON album_chart_entries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "album_chart_entries_insert" ON album_chart_entries;
CREATE POLICY "album_chart_entries_insert" ON album_chart_entries FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "album_chart_entries_update" ON album_chart_entries;
CREATE POLICY "album_chart_entries_update" ON album_chart_entries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "album_chart_entries_delete" ON album_chart_entries;
CREATE POLICY "album_chart_entries_delete" ON album_chart_entries FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 8. chart_events
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_week_id uuid NOT NULL REFERENCES chart_weeks(id) ON DELETE CASCADE,
  event_class text NOT NULL,
  badge_value text,
  badge_arrow text,
  badge_superscript text,
  badge_label text,
  label text NOT NULL,
  copy text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chart_events_week_id ON chart_events (chart_week_id);

ALTER TABLE chart_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chart_events_select" ON chart_events;
CREATE POLICY "chart_events_select" ON chart_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "chart_events_insert" ON chart_events;
CREATE POLICY "chart_events_insert" ON chart_events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "chart_events_update" ON chart_events;
CREATE POLICY "chart_events_update" ON chart_events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "chart_events_delete" ON chart_events;
CREATE POLICY "chart_events_delete" ON chart_events FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 9. honors
-- ============================================================
CREATE TABLE IF NOT EXISTS honors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  honor_slug text NOT NULL,
  badge_alt text,
  title text NOT NULL,
  description text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_honors_entity ON honors (entity_type, entity_id);

ALTER TABLE honors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "honors_select" ON honors;
CREATE POLICY "honors_select" ON honors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "honors_insert" ON honors;
CREATE POLICY "honors_insert" ON honors FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "honors_update" ON honors;
CREATE POLICY "honors_update" ON honors FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "honors_delete" ON honors;
CREATE POLICY "honors_delete" ON honors FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 10. genres
-- ============================================================
CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_genres_slug ON genres (slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_genres_name ON genres (name);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "genres_select" ON genres;
CREATE POLICY "genres_select" ON genres FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "genres_insert" ON genres;
CREATE POLICY "genres_insert" ON genres FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "genres_update" ON genres;
CREATE POLICY "genres_update" ON genres FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "genres_delete" ON genres;
CREATE POLICY "genres_delete" ON genres FOR DELETE
  TO authenticated USING (true);