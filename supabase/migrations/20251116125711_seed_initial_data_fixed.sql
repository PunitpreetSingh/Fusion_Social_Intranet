/*
  # Seed Initial Data

  1. Sample Users
    - Mohit Verma (admin)
    - Yasaswini (internal)
    - Reshabh (internal)
  
  2. Sample Spaces/Places
    - Daimler Truck Asia
    - HQ
    - Engineering
*/

-- Insert sample users
INSERT INTO users (name, email, department, role, profile_image_url)
VALUES
  ('Mohit Verma', 'mohit.verma@daimler.com', 'Engineering', 'admin', NULL),
  ('Yasaswini', 'yasaswini@daimler.com', 'Product Management', 'internal', NULL),
  ('Reshabh', 'reshabh@daimler.com', 'Design', 'internal', NULL),
  ('Sarah Johnson', 'sarah.johnson@daimler.com', 'Marketing', 'internal', NULL),
  ('Michael Chen', 'michael.chen@daimler.com', 'Operations', 'internal', NULL)
ON CONFLICT (email) DO NOTHING;

-- Insert sample spaces
INSERT INTO spaces (name, parent_place, user_id)
SELECT 
  'Daimler Truck Asia',
  '',
  (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM spaces WHERE name = 'Daimler Truck Asia');

INSERT INTO spaces (name, parent_place, user_id)
SELECT 
  'HQ',
  '',
  (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM spaces WHERE name = 'HQ');

INSERT INTO spaces (name, parent_place, user_id)
SELECT 
  'Engineering',
  'HQ',
  (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM spaces WHERE name = 'Engineering');

INSERT INTO spaces (name, parent_place, user_id)
SELECT 
  'Product Management',
  'HQ',
  (SELECT id FROM users WHERE email = 'yasaswini@daimler.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM spaces WHERE name = 'Product Management');

INSERT INTO spaces (name, parent_place, user_id)
SELECT 
  'Design Team',
  'Engineering',
  (SELECT id FROM users WHERE email = 'reshabh@daimler.com' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM spaces WHERE name = 'Design Team');