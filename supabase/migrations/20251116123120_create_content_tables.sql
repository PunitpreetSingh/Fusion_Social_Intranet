/*
  # Create Content Tables for Social Intranet

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `visibility_type` (text) - 'place', 'hidden', 'specific_people', 'community'
      - `place_name` (text)
      - `tags` (text[])
      - `status` (text) - 'draft', 'published'
      - `restrict_comments` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `visibility_type` (text) - 'place', 'personal_blog'
      - `place_name` (text)
      - `blog_name` (text)
      - `tags` (text[])
      - `restrict_comments` (boolean)
      - `scheduled_publish_at` (timestamptz)
      - `status` (text) - 'draft', 'published'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `spaces`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `parent_place` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `attachments`
      - `id` (uuid, primary key)
      - `content_type` (text) - 'document', 'blog', 'status'
      - `content_id` (uuid)
      - `file_url` (text)
      - `file_name` (text)
      - `created_at` (timestamptz)
    
    - `mentions`
      - `id` (uuid, primary key)
      - `content_type` (text) - 'document', 'blog', 'status'
      - `content_id` (uuid)
      - `mentioned_user_id` (uuid)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  visibility_type text NOT NULL CHECK (visibility_type IN ('place', 'hidden', 'specific_people', 'community')),
  place_name text DEFAULT '',
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  restrict_comments boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all published documents"
  ON documents FOR SELECT
  TO authenticated
  USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "Users can create own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  visibility_type text NOT NULL CHECK (visibility_type IN ('place', 'personal_blog')),
  place_name text DEFAULT '',
  blog_name text DEFAULT '',
  tags text[] DEFAULT '{}',
  restrict_comments boolean DEFAULT false,
  scheduled_publish_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all published blogs"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (status = 'published' OR user_id = auth.uid());

CREATE POLICY "Users can create own blogs"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own blogs"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own blogs"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Spaces table
CREATE TABLE IF NOT EXISTS spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  parent_place text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all spaces"
  ON spaces FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create spaces"
  ON spaces FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own spaces"
  ON spaces FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own spaces"
  ON spaces FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('document', 'blog', 'status')),
  content_id uuid NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all attachments"
  ON attachments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create attachments"
  ON attachments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Mentions table
CREATE TABLE IF NOT EXISTS mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('document', 'blog', 'status')),
  content_id uuid NOT NULL,
  mentioned_user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all mentions"
  ON mentions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create mentions"
  ON mentions FOR INSERT
  TO authenticated
  WITH CHECK (true);