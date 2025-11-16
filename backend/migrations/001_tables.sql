-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255) DEFAULT '',
    avatar_url TEXT DEFAULT '',
    role VARCHAR(50) DEFAULT 'external' CHECK (role IN ('internal', 'external', 'admin')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Spaces Table
CREATE TABLE IF NOT EXISTS spaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Status Updates Table
CREATE TABLE IF NOT EXISTS status_updates (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    body TEXT NOT NULL,
    post_in TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    visibility JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    blog_for VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Create Document Tags Junction Table
CREATE TABLE IF NOT EXISTS document_tags (
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (document_id, tag_id)
);

-- Create Blog Tags Junction Table
CREATE TABLE IF NOT EXISTS blog_tags (
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, tag_id)
);

-- Create Attachments Table
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Mentions Table
CREATE TABLE IF NOT EXISTS mentions (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('status', 'document', 'blog')),
    content_id INTEGER NOT NULL,
    mentioned_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Form Fields Table
CREATE TABLE IF NOT EXISTS form_fields (
    id SERIAL PRIMARY KEY,
    form_name VARCHAR(100) NOT NULL UNIQUE,
    field_schema JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_status_updates_author ON status_updates(author_id);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_created ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mentions_user ON mentions(mentioned_user_id);
CREATE INDEX IF NOT EXISTS idx_spaces_name ON spaces(name);
