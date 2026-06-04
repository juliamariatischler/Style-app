-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- WARDROBE ITEMS
-- =====================
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('tops','bottoms','outerwear','shoes','accessories','dress','suit')),
  subcategory   TEXT NOT NULL DEFAULT '',
  colors        JSONB NOT NULL DEFAULT '[]',
  formality     TEXT NOT NULL CHECK (formality IN ('casual','smart-casual','formal')) DEFAULT 'casual',
  fit           TEXT NOT NULL CHECK (fit IN ('slim','regular','oversized','fitted')) DEFAULT 'regular',
  style_tags    TEXT[] NOT NULL DEFAULT '{}',
  suitable_styles TEXT[] NOT NULL DEFAULT '{}',
  user_notes    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wardrobe_user ON wardrobe_items(user_id);
CREATE INDEX idx_wardrobe_category ON wardrobe_items(user_id, category);

-- =====================
-- OUTFITS
-- =====================
CREATE TABLE IF NOT EXISTS outfits (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  style         TEXT NOT NULL,
  occasion      TEXT,
  season        TEXT,
  outfit_name   TEXT NOT NULL DEFAULT '',
  items         JSONB NOT NULL DEFAULT '[]',
  style_score   INTEGER NOT NULL DEFAULT 0 CHECK (style_score BETWEEN 0 AND 100),
  overall_tip   TEXT NOT NULL DEFAULT '',
  missing_items JSONB NOT NULL DEFAULT '[]',
  is_favorite   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outfits_user ON outfits(user_id);
CREATE INDEX idx_outfits_favorites ON outfits(user_id, is_favorite);
CREATE INDEX idx_outfits_style ON outfits(user_id, style);

-- =====================
-- SHOPPING SUGGESTIONS
-- =====================
CREATE TABLE IF NOT EXISTS shopping_suggestions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outfit_id           UUID REFERENCES outfits(id) ON DELETE SET NULL,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  missing_category    TEXT NOT NULL DEFAULT '',
  missing_description TEXT NOT NULL DEFAULT '',
  product_title       TEXT NOT NULL,
  price               TEXT NOT NULL DEFAULT '',
  price_tier          TEXT NOT NULL CHECK (price_tier IN ('€','€€','€€€')) DEFAULT '€€',
  shop_name           TEXT NOT NULL DEFAULT '',
  product_url         TEXT NOT NULL DEFAULT '',
  image_url           TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shopping_user ON shopping_suggestions(user_id);
CREATE INDEX idx_shopping_outfit ON shopping_suggestions(outfit_id);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_suggestions ENABLE ROW LEVEL SECURITY;

-- Wardrobe items policies
CREATE POLICY "Users can view own wardrobe"
  ON wardrobe_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wardrobe"
  ON wardrobe_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wardrobe"
  ON wardrobe_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wardrobe"
  ON wardrobe_items FOR DELETE USING (auth.uid() = user_id);

-- Outfits policies
CREATE POLICY "Users can view own outfits"
  ON outfits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own outfits"
  ON outfits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own outfits"
  ON outfits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own outfits"
  ON outfits FOR DELETE USING (auth.uid() = user_id);

-- Shopping suggestions policies
CREATE POLICY "Users can view own suggestions"
  ON shopping_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own suggestions"
  ON shopping_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own suggestions"
  ON shopping_suggestions FOR DELETE USING (auth.uid() = user_id);

-- =====================
-- STORAGE BUCKET
-- =====================
INSERT INTO storage.buckets (id, name, public)
VALUES ('wardrobe', 'wardrobe', TRUE)
ON CONFLICT DO NOTHING;

CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wardrobe' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read wardrobe images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wardrobe');

CREATE POLICY "Users can delete own wardrobe images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'wardrobe' AND auth.uid()::text = (storage.foldername(name))[1]);
