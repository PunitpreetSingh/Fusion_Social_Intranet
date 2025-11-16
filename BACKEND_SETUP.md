# Backend Setup Guide

This Social Intranet application uses **Supabase** as the backend, providing PostgreSQL database, authentication, storage, and auto-generated REST APIs.

## Architecture Overview

```
Frontend (React + Vite + TypeScript)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
Supabase Backend
    ├── PostgreSQL Database (with RLS)
    ├── Storage (for file uploads)
    ├── Auto-generated REST API
    └── Real-time subscriptions
```

---

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)

---

## Setup Instructions

### 1. Environment Configuration

The `.env` file already contains your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are automatically configured and ready to use.

### 2. Database Schema

The database schema is already set up through Supabase migrations located in:

```
supabase/migrations/
├── 20251116114524_create_intranet_schema.sql
├── 20251116123120_create_content_tables.sql
├── 20251116125606_add_admin_and_storage_setup.sql
├── 20251116125646_update_user_roles_add_admin.sql
└── 20251116125711_seed_initial_data_fixed.sql
```

**Tables Created:**
- `users` - User profiles and roles
- `status_updates` - Status posts
- `documents` - Document content
- `blog_posts` - Blog entries
- `spaces` - Organizational spaces
- `attachments` - File attachments
- `mentions` - User mentions
- `app_configuration` - App settings

### 3. Sample Data

The following sample data is pre-seeded:

**Users:**
- Mohit Verma (admin) - mohit.verma@daimler.com
- Yasaswini (internal) - yasaswini@daimler.com
- Reshabh (internal) - reshabh@daimler.com
- Sarah Johnson (internal) - sarah.johnson@daimler.com
- Michael Chen (internal) - michael.chen@daimler.com

**Spaces:**
- Daimler Truck Asia
- HQ
- Engineering (parent: HQ)
- Product Management (parent: HQ)
- Design Team (parent: Engineering)

### 4. Storage Buckets

The application uses Supabase Storage for file uploads:

**Bucket: `attachments`**
- Used for document, blog, and status attachments
- Public access enabled
- Accepts all file types

---

## How to Use the Backend

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will connect to Supabase automatically using the credentials in `.env`.

### Build for Production
```bash
npm run build
```

---

## API Usage Examples

All API calls use the Supabase client. Import it in your components:

```typescript
import { supabase } from '../lib/supabase';
```

### Example 1: Create Status Update

```typescript
const createStatusUpdate = async () => {
  const { data, error } = await supabase
    .from('status_updates')
    .insert({
      user_id: user.id,
      content: '<p>Just completed the new feature!</p>',
      post_in: 'Engineering'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating status:', error);
    return null;
  }

  console.log('Created status:', data);
  return data;
};
```

**cURL Equivalent:**
```bash
curl -X POST 'https://your-project.supabase.co/rest/v1/status_updates' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "content": "<p>Just completed the new feature!</p>",
    "post_in": "Engineering"
  }'
```

### Example 2: Create Document

```typescript
const createDocument = async () => {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      user_id: user.id,
      title: 'Technical Specification',
      content: 'Document content here...',
      visibility_type: 'place',
      place_name: 'Engineering',
      tags: ['technical', 'documentation'],
      status: 'published',
      restrict_comments: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating document:', error);
    return null;
  }

  console.log('Created document:', data);
  return data;
};
```

**cURL Equivalent:**
```bash
curl -X POST 'https://your-project.supabase.co/rest/v1/documents' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "title": "Technical Specification",
    "content": "Document content here...",
    "visibility_type": "place",
    "place_name": "Engineering",
    "tags": ["technical", "documentation"],
    "status": "published",
    "restrict_comments": false
  }'
```

### Example 3: Create Blog Post

```typescript
const createBlogPost = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      user_id: user.id,
      title: 'My First Blog Post',
      content: '<p>Blog content here...</p>',
      visibility_type: 'personal_blog',
      place_name: '',
      blog_name: "John's Blog",
      tags: ['technology', 'updates'],
      status: 'published',
      restrict_comments: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating blog:', error);
    return null;
  }

  console.log('Created blog post:', data);
  return data;
};
```

**cURL Equivalent:**
```bash
curl -X POST 'https://your-project.supabase.co/rest/v1/blog_posts' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "title": "My First Blog Post",
    "content": "<p>Blog content here...</p>",
    "visibility_type": "personal_blog",
    "place_name": "",
    "blog_name": "John'\''s Blog",
    "tags": ["technology", "updates"],
    "status": "published",
    "restrict_comments": false
  }'
```

### Example 4: Create Space

```typescript
const createSpace = async () => {
  const { data, error } = await supabase
    .from('spaces')
    .insert({
      user_id: user.id,
      name: 'New Team Space',
      parent_place: 'HQ'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating space:', error);
    return null;
  }

  console.log('Created space:', data);
  return data;
};
```

**cURL Equivalent:**
```bash
curl -X POST 'https://your-project.supabase.co/rest/v1/spaces' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here",
    "name": "New Team Space",
    "parent_place": "HQ"
  }'
```

### Example 5: Upload File Attachment

```typescript
const uploadAttachment = async (file: File, contentId: string, contentType: string) => {
  // 1. Upload to storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `attachments/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return null;
  }

  // 2. Get public URL
  const { data: urlData } = supabase.storage
    .from('attachments')
    .getPublicUrl(filePath);

  // 3. Save attachment record
  const { data, error } = await supabase
    .from('attachments')
    .insert({
      content_type: contentType,
      content_id: contentId,
      file_url: urlData.publicUrl,
      file_name: file.name
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving attachment:', error);
    return null;
  }

  console.log('Attachment saved:', data);
  return data;
};
```

### Example 6: Get All Status Updates

```typescript
const getStatusUpdates = async () => {
  const { data, error } = await supabase
    .from('status_updates')
    .select(`
      *,
      users (
        name,
        profile_image_url,
        department
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching statuses:', error);
    return [];
  }

  return data;
};
```

**cURL Equivalent:**
```bash
curl -X GET 'https://your-project.supabase.co/rest/v1/status_updates?select=*,users(name,profile_image_url,department)&order=created_at.desc&limit=50' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_USER_JWT"
```

### Example 7: Search Documents

```typescript
const searchDocuments = async (query: string) => {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      users (name, department)
    `)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching documents:', error);
    return [];
  }

  return data;
};
```

### Example 8: Get User's Mentions

```typescript
const getUserMentions = async (userId: string) => {
  const { data, error } = await supabase
    .from('mentions')
    .select(`
      *,
      users!mentioned_user_id (name, email)
    `)
    .eq('mentioned_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching mentions:', error);
    return [];
  }

  return data;
};
```

---

## Testing the Backend

### 1. Test Database Connection

```typescript
const testConnection = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('count');

  if (error) {
    console.error('Connection failed:', error);
    return false;
  }

  console.log('✅ Database connected successfully');
  return true;
};
```

### 2. Test with Postman/Insomnia

**Base URL:** `https://your-project.supabase.co/rest/v1`

**Headers:**
```
apikey: your_supabase_anon_key
Authorization: Bearer your_user_jwt_token
Content-Type: application/json
```

**GET All Users:**
```
GET /users
```

**GET All Spaces:**
```
GET /spaces
```

**POST Create Status:**
```
POST /status_updates
Body: {
  "user_id": "uuid-here",
  "content": "Test status",
  "post_in": "Engineering"
}
```

---

## Common Operations

### Filter by User
```typescript
const { data } = await supabase
  .from('documents')
  .select('*')
  .eq('user_id', userId);
```

### Filter by Status
```typescript
const { data } = await supabase
  .from('documents')
  .select('*')
  .eq('status', 'published');
```

### Full Text Search
```typescript
const { data } = await supabase
  .from('documents')
  .select('*')
  .textSearch('title', searchQuery);
```

### Pagination
```typescript
const { data } = await supabase
  .from('status_updates')
  .select('*')
  .range(0, 9) // First 10 items
  .order('created_at', { ascending: false });
```

### Count Records
```typescript
const { count } = await supabase
  .from('documents')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'published');
```

---

## Security Notes

1. **Row Level Security (RLS)** is enabled on all tables
2. Users can only modify their own content
3. Internal users have special permissions for status updates
4. All queries are automatically filtered by RLS policies
5. Anon key is safe to expose (it's rate-limited and protected by RLS)

---

## Troubleshooting

### Error: "Failed to fetch"
- Check if Supabase URL and Anon Key are correct in `.env`
- Verify network connection
- Check Supabase project status at https://supabase.com

### Error: "JWT expired"
- User session has expired
- Re-authenticate the user
- Check token expiration settings in Supabase dashboard

### Error: "Row Level Security Policy Violation"
- User doesn't have permission for this operation
- Check RLS policies in database
- Verify user role and permissions

### Error: "Column does not exist"
- Database schema may not be up to date
- Check migrations have been applied
- Verify table structure matches your query

---

## Production Deployment

### 1. Update Environment Variables

Set production Supabase URL and keys:
```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
```

### 2. Build Application
```bash
npm run build
```

### 3. Deploy to Hosting

The `dist/` folder can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### 4. Configure CORS

In Supabase Dashboard → Project Settings → API:
- Add your production domain to allowed origins

---

## Additional Resources

- **API Documentation:** See `API_DOCUMENTATION.md`
- **Supabase Docs:** https://supabase.com/docs
- **Supabase Dashboard:** https://supabase.com/dashboard
- **REST API Reference:** https://supabase.com/docs/guides/api

---

## Support

For issues or questions:
1. Check Supabase Dashboard → Logs
2. Review browser console for errors
3. Verify RLS policies in Database → Policies
4. Check table structure matches schema
