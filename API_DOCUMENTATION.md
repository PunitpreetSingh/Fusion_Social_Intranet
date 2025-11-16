# Social Intranet API Documentation

This document describes the complete API structure for the Social Intranet application. The backend uses **Supabase** (PostgreSQL + REST API) for data persistence.

## Database Schema Overview

### Tables
1. **users** - User profiles and authentication
2. **status_updates** - Status posts from users
3. **documents** - Document content with visibility controls
4. **blog_posts** - Blog entries with tags and scheduling
5. **spaces** - Organizational spaces/places
6. **attachments** - File attachments for content
7. **mentions** - User mentions in content
8. **app_configuration** - Application configuration

---

## 1. Users API

### User Schema
```typescript
interface User {
  id: uuid;
  email: string;
  name: string;
  department: string;
  profile_image_url: string;
  role: 'internal' | 'external' | 'admin';
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Get Current User
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

### Get All Users
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .order('name');
```

### Update User Profile
```typescript
const { data, error } = await supabase
  .from('users')
  .update({
    name: 'Updated Name',
    department: 'New Department',
    profile_image_url: 'https://...'
  })
  .eq('id', userId);
```

---

## 2. Status Updates API

### Status Update Schema
```typescript
interface StatusUpdate {
  id: uuid;
  user_id: uuid;
  content: string;           // Rich text HTML from Quill editor
  post_in: string;           // Space/place name
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Create Status Update
```typescript
const { data, error } = await supabase
  .from('status_updates')
  .insert({
    user_id: user.id,
    content: '<p>Status content here</p>',
    post_in: 'Engineering'
  });
```

**Form Fields (from StatusUpdateModal):**
- `content` (required) - Rich text from Quill editor
- `post_in` (optional) - Space name where to post
- User must have `role: 'internal'` to create

### Get Status Updates
```typescript
const { data, error } = await supabase
  .from('status_updates')
  .select(`
    *,
    users (name, profile_image_url, department)
  `)
  .order('created_at', { ascending: false })
  .limit(50);
```

### Update Status Update
```typescript
const { data, error } = await supabase
  .from('status_updates')
  .update({
    content: '<p>Updated content</p>',
    post_in: 'New Space'
  })
  .eq('id', statusId)
  .eq('user_id', userId);
```

### Delete Status Update
```typescript
const { data, error } = await supabase
  .from('status_updates')
  .delete()
  .eq('id', statusId)
  .eq('user_id', userId);
```

---

## 3. Documents API

### Document Schema
```typescript
interface Document {
  id: uuid;
  user_id: uuid;
  title: string;
  content: string;
  visibility_type: 'place' | 'hidden' | 'specific_people' | 'community';
  place_name: string;
  tags: string[];
  status: 'draft' | 'published';
  restrict_comments: boolean;
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Create Document
```typescript
const { data, error } = await supabase
  .from('documents')
  .insert({
    user_id: user.id,
    title: 'Document Title',
    content: 'Document body text',
    visibility_type: 'place',
    place_name: 'Engineering',
    tags: ['technical', 'documentation'],
    status: 'published',
    restrict_comments: false
  });
```

**Form Fields (from DocumentForm):**
- `title` (required) - Document title
- `content` (required) - Document body
- `visibility_type` (required) - One of:
  - `'place'` - Visible to specific place (requires `place_name`)
  - `'hidden'` - Private/hidden
  - `'specific_people'` - Visible to selected people
  - `'community'` - Visible to all
- `place_name` (conditional) - Required if visibility_type = 'place'
- `tags` (optional) - Array of tag strings
- `status` (required) - `'draft'` or `'published'`
- `restrict_comments` (optional) - Boolean

### Get Documents
```typescript
// Get all published documents
const { data, error } = await supabase
  .from('documents')
  .select(`
    *,
    users (name, profile_image_url, department)
  `)
  .eq('status', 'published')
  .order('created_at', { ascending: false });

// Get user's drafts
const { data, error } = await supabase
  .from('documents')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'draft');
```

### Update Document
```typescript
const { data, error } = await supabase
  .from('documents')
  .update({
    title: 'Updated Title',
    content: 'Updated content',
    status: 'published',
    tags: ['updated', 'tags']
  })
  .eq('id', documentId)
  .eq('user_id', userId);
```

### Delete Document
```typescript
const { data, error } = await supabase
  .from('documents')
  .delete()
  .eq('id', documentId)
  .eq('user_id', userId);
```

---

## 4. Blog Posts API

### Blog Post Schema
```typescript
interface BlogPost {
  id: uuid;
  user_id: uuid;
  title: string;
  content: string;
  visibility_type: 'place' | 'personal_blog';
  place_name: string;
  blog_name: string;
  tags: string[];
  restrict_comments: boolean;
  scheduled_publish_at: timestamp | null;
  status: 'draft' | 'published';
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Create Blog Post
```typescript
const { data, error } = await supabase
  .from('blog_posts')
  .insert({
    user_id: user.id,
    title: 'Blog Post Title',
    content: 'Blog content here',
    visibility_type: 'personal_blog',
    place_name: '',
    blog_name: user.name + "'s Blog",
    tags: ['technology', 'updates'],
    status: 'published',
    restrict_comments: false,
    scheduled_publish_at: null
  });
```

**Form Fields (from BlogPostForm):**
- `title` (required) - Blog post title
- `content` (required) - Blog post body
- `visibility_type` (required) - One of:
  - `'personal_blog'` - Posted to user's personal blog (requires `blog_name`)
  - `'place'` - Posted to specific place (requires `place_name`)
- `place_name` (conditional) - Required if visibility_type = 'place'
- `blog_name` (conditional) - Required if visibility_type = 'personal_blog'
- `tags` (optional) - Array of tag strings
- `status` (required) - `'draft'` or `'published'`
- `restrict_comments` (optional) - Boolean
- `scheduled_publish_at` (optional) - Future timestamp for scheduled publishing

### Get Blog Posts
```typescript
const { data, error } = await supabase
  .from('blog_posts')
  .select(`
    *,
    users (name, profile_image_url, department)
  `)
  .eq('status', 'published')
  .order('created_at', { ascending: false });
```

### Update Blog Post
```typescript
const { data, error } = await supabase
  .from('blog_posts')
  .update({
    title: 'Updated Title',
    content: 'Updated content',
    status: 'published'
  })
  .eq('id', blogId)
  .eq('user_id', userId);
```

### Delete Blog Post
```typescript
const { data, error } = await supabase
  .from('blog_posts')
  .delete()
  .eq('id', blogId)
  .eq('user_id', userId);
```

---

## 5. Spaces API

### Space Schema
```typescript
interface Space {
  id: uuid;
  user_id: uuid;
  name: string;
  parent_place: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Create Space
```typescript
const { data, error } = await supabase
  .from('spaces')
  .insert({
    user_id: user.id,
    name: 'New Space Name',
    parent_place: 'HQ'
  });
```

**Form Fields (from CreateSpaceForm):**
- `name` (required) - Space name (currently hardcoded as 'New Space')
- `parent_place` (required) - Parent space/place name

### Get All Spaces
```typescript
const { data, error } = await supabase
  .from('spaces')
  .select(`
    *,
    users (name, department)
  `)
  .order('name');
```

### Get Spaces Hierarchy
```typescript
// Get root spaces (no parent)
const { data: rootSpaces } = await supabase
  .from('spaces')
  .select('*')
  .eq('parent_place', '');

// Get child spaces
const { data: childSpaces } = await supabase
  .from('spaces')
  .select('*')
  .eq('parent_place', parentSpaceName);
```

### Update Space
```typescript
const { data, error } = await supabase
  .from('spaces')
  .update({
    name: 'Updated Name',
    parent_place: 'New Parent'
  })
  .eq('id', spaceId)
  .eq('user_id', userId);
```

### Delete Space
```typescript
const { data, error } = await supabase
  .from('spaces')
  .delete()
  .eq('id', spaceId)
  .eq('user_id', userId);
```

---

## 6. Attachments API

### Attachment Schema
```typescript
interface Attachment {
  id: uuid;
  content_type: 'document' | 'blog' | 'status';
  content_id: uuid;
  file_url: string;
  file_name: string;
  created_at: timestamp;
}
```

### Upload File to Storage
```typescript
// 1. Upload file to Supabase Storage
const fileExt = file.name.split('.').pop();
const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
const filePath = `attachments/${fileName}`;

const { error: uploadError } = await supabase.storage
  .from('attachments')
  .upload(filePath, file);

// 2. Get public URL
const { data: urlData } = supabase.storage
  .from('attachments')
  .getPublicUrl(filePath);

// 3. Save attachment record
const { data, error } = await supabase
  .from('attachments')
  .insert({
    content_type: 'document',
    content_id: documentId,
    file_url: urlData.publicUrl,
    file_name: file.name
  });
```

### Get Attachments for Content
```typescript
const { data, error } = await supabase
  .from('attachments')
  .select('*')
  .eq('content_type', 'document')
  .eq('content_id', documentId);
```

---

## 7. Mentions API

### Mention Schema
```typescript
interface Mention {
  id: uuid;
  content_type: 'document' | 'blog' | 'status';
  content_id: uuid;
  mentioned_user_id: uuid;
  created_at: timestamp;
}
```

### Create Mention
```typescript
const { data, error } = await supabase
  .from('mentions')
  .insert({
    content_type: 'status',
    content_id: statusId,
    mentioned_user_id: mentionedUserId
  });
```

### Get Mentions for User
```typescript
const { data, error } = await supabase
  .from('mentions')
  .select(`
    *,
    users!mentioned_user_id (name, email)
  `)
  .eq('mentioned_user_id', userId)
  .order('created_at', { ascending: false });
```

---

## 8. App Configuration API

### Get Configuration
```typescript
const { data, error } = await supabase
  .from('app_configuration')
  .select('config_value')
  .eq('config_key', 'header_config')
  .single();
```

### Available Configurations
- `header_config` - Header logo and text
- `profile_modal_config` - Profile modal menu items
- `app_search_config` - App search modal settings
- `create_content_config` - Content creation menu

---

## Example API Calls

### Complete Status Update Flow
```typescript
// 1. Create status update
const { data: status, error } = await supabase
  .from('status_updates')
  .insert({
    user_id: user.id,
    content: '<p>Working on the new feature!</p>',
    post_in: 'Engineering'
  })
  .select()
  .single();

// 2. Add mentions (if any)
if (mentionedUsers.length > 0) {
  await supabase
    .from('mentions')
    .insert(
      mentionedUsers.map(userId => ({
        content_type: 'status',
        content_id: status.id,
        mentioned_user_id: userId
      }))
    );
}
```

### Complete Document Creation Flow
```typescript
// 1. Create document
const { data: doc, error } = await supabase
  .from('documents')
  .insert({
    user_id: user.id,
    title: 'Technical Specification',
    content: '<p>Document content...</p>',
    visibility_type: 'place',
    place_name: 'Engineering',
    tags: ['technical', 'spec'],
    status: 'published',
    restrict_comments: false
  })
  .select()
  .single();

// 2. Upload attachments (if any)
for (const file of files) {
  // Upload to storage
  const filePath = `attachments/${Date.now()}_${file.name}`;
  await supabase.storage.from('attachments').upload(filePath, file);

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('attachments')
    .getPublicUrl(filePath);

  // Save attachment record
  await supabase
    .from('attachments')
    .insert({
      content_type: 'document',
      content_id: doc.id,
      file_url: urlData.publicUrl,
      file_name: file.name
    });
}
```

---

## Security & Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Users
- ✅ Users can read their own profile
- ✅ Users can update their own profile

### Status Updates
- ✅ All authenticated users can read status updates
- ✅ Only internal users can create status updates
- ✅ Users can update/delete their own status updates

### Documents
- ✅ All users can read published documents
- ✅ Users can read their own drafts
- ✅ Users can create/update/delete their own documents

### Blog Posts
- ✅ All users can read published blog posts
- ✅ Users can read their own drafts
- ✅ Users can create/update/delete their own blog posts

### Spaces
- ✅ All authenticated users can read all spaces
- ✅ Users can create spaces
- ✅ Users can update/delete their own spaces

### Attachments & Mentions
- ✅ All authenticated users can read
- ✅ All authenticated users can create

---

## Environment Variables

Required in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Error Handling

All Supabase queries return:
```typescript
{
  data: T | null,
  error: PostgrestError | null
}
```

Always check for errors:
```typescript
const { data, error } = await supabase.from('users').select('*');

if (error) {
  console.error('Error:', error.message);
  // Handle error
  return;
}

// Use data
console.log(data);
```

---

## Rate Limits

Supabase free tier limits:
- 50,000 rows read per month
- 100 concurrent connections
- 2GB database storage
- 1GB file storage

For production, upgrade to Pro plan for higher limits.
