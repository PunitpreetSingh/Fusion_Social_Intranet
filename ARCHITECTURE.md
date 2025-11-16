# Social Intranet - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                   (React + Vite + TypeScript)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Status     │  │   Document   │  │   Blog Post  │        │
│  │   Update     │  │     Form     │  │     Form     │        │
│  │    Modal     │  │              │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Space     │  │    Header    │  │    Modals    │        │
│  │     Form     │  │  Navigation  │  │   Manager    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌──────────────────┐
                    │  Supabase Client │
                    │  (@supabase/     │
                    │   supabase-js)   │
                    └──────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       SUPABASE BACKEND                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                        │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │  users   │  │ status_  │  │documents │           │   │
│  │  │          │  │ updates  │  │          │           │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
│  │  │blog_posts│  │  spaces  │  │attachments│          │   │
│  │  └──────────┘  └──────────┘  └──────────┘           │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────────────┐                 │   │
│  │  │ mentions │  │app_configuration │                 │   │
│  │  └──────────┘  └──────────────────┘                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │           Row Level Security (RLS) Policies            │   │
│  │  • User ownership validation                           │   │
│  │  • Role-based access control                           │   │
│  │  • Content visibility rules                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                 Storage Buckets                        │   │
│  │  • attachments/ (files, images, documents)             │   │
│  │  • Public access for uploaded files                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              Auto-Generated REST API                   │   │
│  │  • GET    /rest/v1/{table}                             │   │
│  │  • POST   /rest/v1/{table}                             │   │
│  │  • PATCH  /rest/v1/{table}?id=eq.{id}                 │   │
│  │  • DELETE /rest/v1/{table}?id=eq.{id}                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### Creating a Status Update

```
User fills form
     ↓
StatusUpdateModal validates
     ↓
Calls supabase.from('status_updates').insert()
     ↓
Supabase Client sends POST request
     ↓
RLS Policy checks: user.role === 'internal'
     ↓
Insert into status_updates table
     ↓
Return success + created record
     ↓
UI updates, modal closes
```

### Creating a Document

```
User fills document form
     ↓
DocumentForm validates (title, content required)
     ↓
Calls supabase.from('documents').insert()
     ↓
Supabase Client sends POST request
     ↓
RLS Policy checks: user_id === auth.uid()
     ↓
Insert into documents table with:
  - title
  - content
  - visibility_type
  - place_name (if applicable)
  - tags[]
  - status (draft/published)
     ↓
Return success + created document
     ↓
UI updates, modal closes
```

### Uploading an Attachment

```
User selects file
     ↓
Form calls upload function
     ↓
1. Upload to Supabase Storage:
   supabase.storage.from('attachments').upload()
     ↓
2. Get public URL:
   supabase.storage.from('attachments').getPublicUrl()
     ↓
3. Save metadata to database:
   supabase.from('attachments').insert({
     content_type,
     content_id,
     file_url,
     file_name
   })
     ↓
Return attachment record
     ↓
Display file in UI
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Frontend Validation                               │
│  ├─ Form field validation                                   │
│  ├─ Role checks (internal users only)                       │
│  └─ Required field enforcement                              │
│                                                             │
│  Layer 2: Supabase Client                                   │
│  ├─ JWT token authentication                                │
│  ├─ Anonymous key rate limiting                             │
│  └─ HTTPS encryption                                        │
│                                                             │
│  Layer 3: Row Level Security (Database)                     │
│  ├─ auth.uid() validation                                   │
│  ├─ Role-based policies                                     │
│  ├─ Ownership checks                                        │
│  └─ Visibility enforcement                                  │
│                                                             │
│  Layer 4: Data Constraints                                  │
│  ├─ NOT NULL constraints                                    │
│  ├─ CHECK constraints                                       │
│  ├─ Foreign key relationships                               │
│  └─ Unique constraints                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Database Schema Relationships

```
users (1)───────┬──────(N) status_updates
                │
                ├──────(N) documents
                │
                ├──────(N) blog_posts
                │
                └──────(N) spaces

attachments (N)─────(1) content_id
                     (references: documents, blogs, status)

mentions (N)────────(1) mentioned_user_id (FK to users)
                 └──(1) content_id
                     (references: documents, blogs, status)

spaces (N)──────────(1) parent_place (self-reference)
```

---

## 🔄 Component Hierarchy

```
App.tsx
├── ModalProvider (Context)
│   └── Modal State Management
│
├── Header
│   ├── Logo/Title
│   ├── Navigation Icons
│   └── Create Button (+)
│
├── ProfileModal
│   └── User profile menu
│
├── AppSearchModal
│   └── App search interface
│
├── GlobalSearchModal
│   └── Global search
│
├── CreateContentModal (Menu)
│   └── List of content types
│
├── StatusUpdateModal
│   ├── RichTextEditor (Quill)
│   ├── PlaceSearch
│   └── Form Controls
│
├── DocumentForm
│   ├── Title Input
│   ├── Content Textarea
│   ├── Visibility Options
│   ├── Tag Selection
│   └── Advanced Options
│
├── BlogPostForm
│   ├── Title Input
│   ├── Content Textarea
│   ├── Blog/Place Selection
│   ├── Tag Input
│   └── Advanced Options
│
└── CreateSpaceForm
    ├── Parent Place Input
    └── Form Controls
```

---

## 📦 State Management

```
┌──────────────────────────────────────────────────────────┐
│                  Application State                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Global State (React Context):                           │
│  ├── ModalContext                                        │
│  │   ├── currentModal: string | null                    │
│  │   ├── modalData: any                                 │
│  │   ├── openModal(name, data)                          │
│  │   └── closeModal()                                   │
│  │                                                       │
│  Custom Hooks:                                           │
│  ├── useUser()                                           │
│  │   ├── user: User | null                              │
│  │   └── loading: boolean                               │
│  │                                                       │
│  └── useConfiguration()                                  │
│      ├── config: Config | null                          │
│      └── loading: boolean                               │
│                                                          │
│  Component Local State:                                  │
│  ├── Form fields (title, content, etc.)                 │
│  ├── Validation errors                                  │
│  ├── Submit status                                      │
│  └── UI state (expanded, selected)                      │
│                                                          │
│  Supabase State (Backend):                              │
│  ├── User session (JWT)                                 │
│  ├── Database records                                   │
│  └── Storage files                                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Request Flow Example

### POST /status_updates

```
Frontend                    Supabase Client              Backend
   │                              │                         │
   │  User submits form           │                         │
   ├─────────────────────────────>│                         │
   │                              │                         │
   │                              │  POST /rest/v1/status_updates
   │                              ├────────────────────────>│
   │                              │  Headers:               │
   │                              │  - apikey: XXX          │
   │                              │  - Authorization: JWT   │
   │                              │  Body: {user_id, ...}   │
   │                              │                         │
   │                              │      RLS Check:         │
   │                              │      ✓ User authenticated
   │                              │      ✓ User is internal │
   │                              │      ✓ user_id matches  │
   │                              │                         │
   │                              │      INSERT INTO        │
   │                              │      status_updates     │
   │                              │                         │
   │                              │  201 Created            │
   │                              │<────────────────────────┤
   │                              │  {id, user_id, ...}     │
   │                              │                         │
   │  Success! Close modal        │                         │
   │<─────────────────────────────┤                         │
   │                              │                         │
```

---

## 📱 Responsive Design

```
Mobile (<768px)      Tablet (768-1024px)    Desktop (>1024px)
┌──────────┐         ┌────────────────┐     ┌─────────────────────┐
│  Header  │         │    Header      │     │      Header         │
├──────────┤         ├────────────────┤     ├─────────────────────┤
│          │         │                │     │                     │
│  Stack   │         │   Sidebar +    │     │  Sidebar + Content  │
│  Layout  │         │    Content     │     │  + Right Panel      │
│          │         │                │     │                     │
│          │         │                │     │                     │
│  Modals  │         │    Modals      │     │      Modals         │
│  Full    │         │   Centered     │     │     Centered        │
│  Screen  │         │                │     │                     │
│          │         │                │     │                     │
└──────────┘         └────────────────┘     └─────────────────────┘
```

---

## 🔌 API Integration Points

### Supabase Client Configuration
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Usage in Components
```typescript
// In any component
import { supabase } from '../lib/supabase'

// Query
const { data, error } = await supabase
  .from('status_updates')
  .select('*')
  .order('created_at', { ascending: false })

// Insert
const { data, error } = await supabase
  .from('documents')
  .insert({ ...documentData })
  .select()
  .single()

// Update
const { data, error } = await supabase
  .from('blog_posts')
  .update({ title: 'New Title' })
  .eq('id', blogId)
  .eq('user_id', userId)

// Delete
const { data, error } = await supabase
  .from('spaces')
  .delete()
  .eq('id', spaceId)
```

---

## 🎯 Performance Optimization

### Database Level
- ✅ Indexes on frequently queried columns (user_id, status, created_at)
- ✅ Connection pooling (handled by Supabase)
- ✅ Query optimization with `.select()` specific fields

### Frontend Level
- ✅ Code splitting (Vite automatic)
- ✅ Lazy loading modals
- ✅ Memoized callbacks (`useCallback`)
- ✅ Optimized re-renders (stable references)

### Network Level
- ✅ Supabase CDN for static assets
- ✅ Compressed responses (gzip)
- ✅ Connection reuse
- ✅ JWT caching

---

## 🔍 Monitoring & Debugging

### Frontend
- Browser DevTools Console
- React DevTools
- Network tab for API calls

### Backend
- Supabase Dashboard → Database → Query Editor
- Supabase Dashboard → API → Logs
- Supabase Dashboard → Storage → Files

### Error Tracking
```typescript
try {
  const { data, error } = await supabase.from('table').insert(...)
  if (error) throw error
} catch (error) {
  console.error('Operation failed:', error)
  // Send to error tracking service
}
```

---

## 📈 Scalability

### Current Architecture Supports:
- ✅ Thousands of concurrent users
- ✅ Millions of database rows
- ✅ Gigabytes of file storage
- ✅ Real-time subscriptions (not yet implemented)

### Future Enhancements:
- 🔄 Real-time updates with Supabase Realtime
- 🔄 Full-text search with PostgreSQL FTS
- 🔄 Caching layer (Redis) for hot data
- 🔄 CDN for user-uploaded files
- 🔄 Background jobs for scheduled publishing

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite 5** - Build tool
- **Tailwind CSS** - Styling
- **React Quill** - Rich text editor
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL 15** - Database
- **PostgREST** - Auto-generated REST API
- **GoTrue** - Authentication (not yet implemented)

### DevOps
- **Git** - Version control
- **npm** - Package management
- **Vite** - Development server
- **ESLint** - Code linting

---

## 📋 Deployment Architecture

```
                    ┌──────────────┐
                    │   GitHub     │
                    │  Repository  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  CI/CD       │
                    │  (optional)  │
                    └──────┬───────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
   ┌────▼─────┐                         ┌────▼────┐
   │  Vercel  │                         │ Supabase│
   │  Netlify │                         │ Backend │
   │  (Frontend)                        │ (Always │
   │           │                         │  Live)  │
   └────┬─────┘                         └────┬────┘
        │                                     │
        └─────────────┬───────────────────────┘
                      │
                ┌─────▼──────┐
                │   Users    │
                │  (Browser) │
                └────────────┘
```

---

This architecture provides a solid foundation for a production-ready social intranet application with proper security, scalability, and maintainability.
