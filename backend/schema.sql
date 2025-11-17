-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255),
    role VARCHAR(50) DEFAULT 'internal',
    created_at TIMESTAMP DEFAULT NOW()
);

-- SPACES TABLE
CREATE TABLE spaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    parent_place VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- STATUS UPDATES
CREATE TABLE status_updates (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    post_in VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- DOCUMENTS
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    visibility_type VARCHAR(50),
    place_name VARCHAR(255),
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT NOW()
);

-- BLOG POSTS
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    visibility_type VARCHAR(50),
    place_name VARCHAR(255),
    blog_name VARCHAR(255),
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT NOW()
);

-- TAGS TABLE
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
