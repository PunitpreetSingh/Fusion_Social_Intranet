/*
  # Social Intranet Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `department` (text)
      - `profile_image_url` (text)
      - `role` (text) - 'internal' or 'external'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `app_configuration`
      - `id` (uuid, primary key)
      - `config_key` (text, unique)
      - `config_value` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `status_updates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `content` (text)
      - `post_in` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read their own data
    - Add policies for internal users to create status updates
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  department text DEFAULT '',
  profile_image_url text DEFAULT '',
  role text NOT NULL DEFAULT 'external' CHECK (role IN ('internal', 'external')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- App configuration table
CREATE TABLE IF NOT EXISTS app_configuration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text UNIQUE NOT NULL,
  config_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_configuration ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read configuration"
  ON app_configuration FOR SELECT
  TO authenticated
  USING (true);

-- Status updates table
CREATE TABLE IF NOT EXISTS status_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  post_in text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE status_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all status updates"
  ON status_updates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Internal users can create status updates"
  ON status_updates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'internal'
    )
  );

CREATE POLICY "Users can update own status updates"
  ON status_updates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own status updates"
  ON status_updates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default configuration
INSERT INTO app_configuration (config_key, config_value)
VALUES 
  ('header_config', '{
    "logo": "FUSO",
    "centerText": "FUSO"
  }'::jsonb),
  ('profile_modal_config', '{
    "section1": {
      "items": ["Edit Profile", "View Profile", "Preferences", "Support"],
      "button": "Sign Out"
    },
    "section2": {
      "items": [
        {"label": "Directory", "type": "button"},
        {"label": "Your Page", "type": "link"},
        {"label": "Your Places", "type": "link"},
        {"label": "Your Bookmarks", "type": "link"},
        {"label": "Your Content", "type": "link"},
        {"label": "Report Abuse", "type": "link"},
        {"label": "Calendar", "type": "link"},
        {"label": "Terms of Use", "type": "link"},
        {"label": "My Contacts", "type": "link"}
      ]
    }
  }'::jsonb),
  ('app_search_config', '{
    "title": "App Station - My Apps:",
    "searchPlaceholder": "Search for Apps",
    "checkboxLabel": "Include Unsubscribed Apps",
    "note": "The Social Intranet is not responsible for the availability of the apps. If you experience any issues, please contact the respective app owner - support information can be found in the info link of the app tile.",
    "emptyMessage": "This list is empty, because you didnt add any Apps yet. Click on the link below and add Apps to your list.",
    "footerButton": "Go to App Station"
  }'::jsonb),
  ('create_content_config', '{
    "title": "Create:",
    "items": [
      {
        "id": "status_update",
        "label": "Status Update",
        "description": "Share what you''re up to",
        "icon": "MessageSquare",
        "restrictedTo": "internal"
      },
      {
        "id": "document",
        "label": "Document",
        "description": "Collaborate on a document",
        "icon": "FileText"
      },
      {
        "id": "blog_post",
        "label": "Blog Post",
        "description": "Share your thoughts",
        "icon": "BookOpen"
      }
    ],
    "statusUpdateModal": {
      "title": "Post a Status Update",
      "postInPlaceholder": "Select a location",
      "postButton": "Post",
      "cancelButton": "Cancel",
      "restrictionMessage": "Internal Users Only"
    }
  }'::jsonb)
ON CONFLICT (config_key) DO NOTHING;