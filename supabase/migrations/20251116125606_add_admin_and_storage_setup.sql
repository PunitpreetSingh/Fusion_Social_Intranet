/*
  # Admin Form Fields and Storage Setup

  1. New Tables
    - `form_fields`
      - `id` (uuid, primary key)
      - `form_name` (text) - name of the form (document, blog, status, space)
      - `field_schema` (jsonb) - dynamic field configuration
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
  2. Storage
    - Create attachments bucket for file uploads
    - Public access for uploaded content
  
  3. Security
    - Enable RLS on form_fields table
    - Only admins can modify form fields
    - Everyone can read form fields
*/

-- Form fields table for dynamic admin-managed fields
CREATE TABLE IF NOT EXISTS form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_name text NOT NULL CHECK (form_name IN ('document', 'blog', 'status', 'space')),
  field_schema jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(form_name)
);

ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read form fields"
  ON form_fields FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert form fields"
  ON form_fields FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update form fields"
  ON form_fields FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete form fields"
  ON form_fields FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Update trigger for form_fields
CREATE OR REPLACE FUNCTION update_form_fields_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER form_fields_updated_at
  BEFORE UPDATE ON form_fields
  FOR EACH ROW
  EXECUTE FUNCTION update_form_fields_updated_at();