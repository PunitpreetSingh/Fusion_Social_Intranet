-- Insert Sample Users
INSERT INTO users (name, email, department, role) VALUES
('Mohit Verma', 'mohit.verma@daimler.com', 'Engineering', 'admin'),
('Yasaswini', 'yasaswini@daimler.com', 'Product Management', 'internal'),
('Reshabh', 'reshabh@daimler.com', 'Design', 'internal'),
('Sarah Johnson', 'sarah.johnson@daimler.com', 'Marketing', 'internal'),
('Michael Chen', 'michael.chen@daimler.com', 'Operations', 'internal')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Spaces
INSERT INTO spaces (name, created_by) VALUES
('Daimler Truck Asia', (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com' LIMIT 1)),
('HQ', (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com' LIMIT 1)),
('Engineering', (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com' LIMIT 1)),
('Product Management', (SELECT id FROM users WHERE email = 'yasaswini@daimler.com' LIMIT 1)),
('Design Team', (SELECT id FROM users WHERE email = 'reshabh@daimler.com' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert Sample Tags
INSERT INTO tags (name) VALUES
('daimler_service'),
('mobile_ready'),
('training'),
('mftbc'),
('innovation'),
('Daimler busses'),
('social intranet')
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Status Updates
INSERT INTO status_updates (author_id, body, post_in) VALUES
((SELECT id FROM users WHERE email = 'mohit.verma@daimler.com' LIMIT 1), 'Welcome to our new Social Intranet!', 'HQ'),
((SELECT id FROM users WHERE email = 'yasaswini@daimler.com' LIMIT 1), 'Excited to share our new product roadmap with the team.', 'Product Management');

-- Insert Sample Documents
INSERT INTO documents (title, body, visibility) VALUES
('Engineering Best Practices', '<p>This document outlines our engineering best practices...</p>', '{"type": "place", "placeName": "Engineering"}'),
('Q1 2024 Product Roadmap', '<p>Our product roadmap for Q1 2024 includes...</p>', '{"type": "community"}');

-- Insert Sample Blog Posts
INSERT INTO blogs (title, body, blog_for) VALUES
('My First Post', '<p>Welcome to my personal blog on the Social Intranet!</p>', 'Mohit Verma''s Blog'),
('Product Updates', '<p>Latest updates from the product team...</p>', 'Product Blog');
