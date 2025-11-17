-- USERS
INSERT INTO users (name, email, department, role) VALUES
('Mohit Verma', 'mohit.verma@daimler.com', 'Engineering', 'admin'),
('Yasaswini', 'yasaswini@daimler.com', 'Product Management', 'internal'),
('Reshabh', 'reshabh@daimler.com', 'Design', 'internal'),
('Sarah Johnson', 'sarah.johnson@daimler.com', 'Marketing', 'internal'),
('Michael Chen', 'michael.chen@daimler.com', 'Operations', 'internal')
ON CONFLICT (email) DO NOTHING;

-- SPACES
INSERT INTO spaces (name, created_by) VALUES
('Daimler Truck Asia', (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com')),
('HQ', (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com')),
('Engineering', (SELECT id FROM users WHERE email = 'mohit.verma@daimler.com')),
('Product Management', (SELECT id FROM users WHERE email = 'yasaswini@daimler.com')),
('Design Team', (SELECT id FROM users WHERE email = 'reshabh@daimler.com'))
ON CONFLICT DO NOTHING;

-- TAGS
INSERT INTO tags (name) VALUES
('daimler_service'),
('mobile_ready'),
('training'),
('mftbc'),
('innovation'),
('Daimler busses'),
('social intranet')
ON CONFLICT DO NOTHING;

-- STATUS UPDATES
INSERT INTO status_updates (user_id, content, post_in) VALUES
((SELECT id FROM users WHERE email = 'mohit.verma@daimler.com'), 'Welcome to our new Social Intranet!', 'HQ'),
((SELECT id FROM users WHERE email = 'yasaswini@daimler.com'), 'Excited to share our product roadmap with the team.', 'Product Management');

-- DOCUMENTS
INSERT INTO documents (user_id, title, content, visibility_type, place_name, tags) VALUES
((SELECT id FROM users WHERE email = 'mohit.verma@daimler.com'),
 'Engineering Best Practices',
 '<p>This document outlines our engineering best practices...</p>',
 'place', 'Engineering', '{"training"}'),

((SELECT id FROM users WHERE email = 'yasaswini@daimler.com'),
 'Q1 2024 Product Roadmap',
 '<p>Our product roadmap for Q1 2024 includes...</p>',
 'community', '', '{"innovation"}');

-- BLOG POSTS
INSERT INTO blog_posts (user_id, title, content, blog_name, tags) VALUES
((SELECT id FROM users WHERE email = 'mohit.verma@daimler.com'),
 'My First Post',
 '<p>Welcome to my personal blog on the Social Intranet!</p>',
 'Mohit Verma''s Blog',
 '{"mftbc"}'),

((SELECT id FROM users WHERE email = 'yasaswini@daimler.com'),
 'Product Updates',
 '<p>Latest updates from the product team...</p>',
 'Product Blog',
 '{"training"}');
