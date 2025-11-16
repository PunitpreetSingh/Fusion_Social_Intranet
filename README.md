# Daimler Truck Social Intranet - Create Content Module

A fully functional social intranet create content system with smooth modal routing, rich text editor, and complete backend integration using Supabase.

## Features

### Frontend
- **React 18** with TypeScript
- **React Router** for deep-linking modal routes
- **Smooth Modal Transitions** with animations
- **Rich Text Editor** with full formatting, image upload, mentions, and links
- **Browse People & Places** searchable components
- **Modal Context** for centralized modal state management
- **Responsive Design** with Tailwind CSS

### Backend (Supabase)
- **PostgreSQL Database** with Row Level Security
- **Real-time Data** with Supabase client
- **File Storage** for images and attachments
- **Edge Functions** for serverless API
- **Authentication** ready

### Content Types
1. **Status Updates** - Quick posts with mentions and place references
2. **Documents** - Full documents with visibility controls
3. **Blog Posts** - Personal or place-based blogs
4. **Spaces** - Community spaces/places

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── StatusUpdateModal.tsx       # Status update form with RTE
│   │   ├── DocumentForm.tsx            # Document creation form
│   │   ├── BlogPostForm.tsx            # Blog post creation form
│   │   ├── CreateSpaceForm.tsx         # Space creation form
│   │   ├── CreateContentModal.tsx      # Main create menu
│   │   ├── RichTextEditor.tsx          # Full-featured rich text editor
│   │   ├── UserSearch.tsx              # Searchable user selector
│   │   ├── PlaceSearch.tsx             # Searchable place selector
│   │   ├── ModalWrapper.tsx            # Reusable modal wrapper
│   │   └── Header.tsx                  # App header with + button
│   ├── contexts/
│   │   └── ModalContext.tsx            # Modal routing & state management
│   ├── lib/
│   │   └── supabase.ts                 # Supabase client setup
│   ├── types/
│   │   └── index.ts                    # TypeScript definitions
│   └── App.tsx                         # Main app component
├── public/
│   ├── formLabels.json                 # All form labels & text
│   ├── uiLabels.json                   # UI labels
│   └── icons.json                      # Icon configurations
├── supabase/
│   └── migrations/                     # Database migrations
│       ├── 001_create_intranet_schema.sql
│       ├── 002_create_content_tables.sql
│       ├── 003_add_admin_and_storage_setup.sql
│       ├── 004_update_user_roles_add_admin.sql
│       └── 005_seed_initial_data_fixed.sql
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account (database already provisioned)

### Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**

The `.env` file is already configured with Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. **Database Setup**

All migrations have been automatically applied. The database includes:
- Users table (with admin, internal, external roles)
- Status updates, documents, blogs, spaces tables
- Form fields for admin configuration
- Seed data (5 users, 5 spaces)

4. **Storage Bucket**

Create the `attachments` bucket in Supabase dashboard:
- Go to Storage in Supabase dashboard
- Create bucket named `attachments`
- Set to Public
- Upload policies: Authenticated users can upload

## Running the Application

### Development
```bash
npm run dev
```
The app will open at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Usage

### Creating Content

1. **Click the + icon** in the header
2. **Select content type**:
   - Status Update
   - Document
   - Blog Post
   - Space

3. **Fill out the form**:
   - Use the rich text editor for formatting
   - Add images via the image button
   - Mention users with @ button
   - Insert links
   - Select visibility options
   - Browse places/people

4. **Publish or Save Draft**

### Modal Routing

Each form has its own route:
- `/create` - Create menu
- `/create/status_update` - Status form
- `/create/document` - Document form
- `/create/blog_post` - Blog form
- `/create/space` - Space form

URLs are pushable/bookmarkable. Browser back button closes modals.

### Search Functionality

**Browse Places:**
- Click "Browse" next to place input
- Search by name
- Select from list

**Select People:**
- Click "Select People" in document form
- Search by name, email, or department
- Multiple selection supported

## Database Schema

### Tables

**users**
- id, name, email, department, role (admin/internal/external)
- profile_image_url, created_at, updated_at

**status_updates**
- id, user_id, content, post_in, created_at

**documents**
- id, user_id, title, content, visibility_type, place_name
- tags (array), status, restrict_comments, created_at

**blog_posts**
- id, user_id, title, content, visibility_type, place_name
- blog_name, tags, restrict_comments, scheduled_publish_at, status

**spaces**
- id, user_id, name, parent_place, created_at

**form_fields** (Admin-managed)
- id, form_name, field_schema (jsonb), created_at

**attachments**
- id, content_type, content_id, file_url, file_name

**mentions**
- id, content_type, content_id, mentioned_user_id

### Row Level Security

All tables have RLS enabled with policies:
- Users can read published content
- Users can create/update/delete their own content
- Admins can manage form fields
- Proper authentication checks on all operations

## API / Supabase Operations

### Creating Status Update
```typescript
const { error } = await supabase
  .from('status_updates')
  .insert({
    user_id: user.id,
    content: 'Hello world',
    post_in: 'Engineering'
  });
```

### Creating Document
```typescript
const { error } = await supabase
  .from('documents')
  .insert({
    user_id: user.id,
    title: 'My Document',
    content: '<p>Document content</p>',
    visibility_type: 'place',
    place_name: 'HQ',
    tags: ['innovation', 'training'],
    status: 'published'
  });
```

### Searching Users
```typescript
const { data } = await supabase
  .from('users')
  .select('*')
  .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
  .limit(20);
```

### Searching Places
```typescript
const { data } = await supabase
  .from('spaces')
  .select('*')
  .ilike('name', `%${query}%`)
  .limit(20);
```

### Uploading Images
```typescript
const { data, error } = await supabase.storage
  .from('attachments')
  .upload(`content-images/${fileName}`, file);

const { data: urlData } = supabase.storage
  .from('attachments')
  .getPublicUrl(filePath);
```

## Configuration

### Form Labels

All UI text is configurable via `/public/formLabels.json`:

```json
{
  "createMenu": {
    "title": "Create:",
    "sections": { ... }
  },
  "statusUpdate": {
    "title": "Post a status update",
    ...
  },
  "document": { ... },
  "blogPost": { ... },
  "space": { ... }
}
```

### Admin Form Fields

Admins can create dynamic form fields:

```typescript
const { error } = await supabase
  .from('form_fields')
  .insert({
    form_name: 'document',
    field_schema: {
      customField: {
        type: 'text',
        label: 'Custom Field',
        required: false
      }
    }
  });
```

## Key Features Explained

### Rich Text Editor

- **Formatting**: Bold, italic, underline, lists, alignment
- **Images**: Upload directly from editor with Supabase storage integration
- **Links**: Insert hyperlinks with custom text
- **Mentions**: Tag users (can integrate with UserSearch)
- **Attachments**: Attach files via callback

### Modal Routing

- Opens modal → pushes route
- Closes modal → goes back in history
- Direct URL access works
- Browser back/forward navigation
- Smooth animations on open/close

### Search Components

- **Debounced search** for performance
- **Pagination** support
- **Multiple selection** (for users)
- **Real-time results** from Supabase
- **Accessible** with keyboard navigation

## Testing

### Manual Testing Checklist

- [ ] Click + icon opens create menu
- [ ] Each menu item opens correct form
- [ ] URL changes when form opens
- [ ] Browser back closes form
- [ ] Rich text editor formatting works
- [ ] Image upload works
- [ ] Browse places shows results
- [ ] Select people shows users
- [ ] Forms submit to database
- [ ] Validation works
- [ ] Loading states display
- [ ] Error messages show

### Sample Test Data

The seed migration includes:
- 5 users (1 admin, 4 internal)
- 5 spaces/places
- Ready for testing all scenarios

## Troubleshooting

### Build Errors
```bash
npm run build
```
Check console for TypeScript errors

### Supabase Connection Issues
- Verify `.env` file has correct credentials
- Check Supabase dashboard is accessible
- Ensure RLS policies are enabled

### Image Upload Fails
- Create `attachments` bucket in Supabase Storage
- Set bucket to Public
- Add upload policy for authenticated users

### Modal Routing Not Working
- Ensure BrowserRouter wraps App
- ModalProvider must wrap App
- Routes must match modal names

## Performance Optimizations

- **Code splitting** via dynamic imports
- **Lazy loading** of modal components
- **Debounced search** queries
- **Optimistic UI** updates
- **Image compression** before upload
- **RLS policies** for data security

## Security

- Row Level Security on all tables
- Authentication required for all operations
- File upload restrictions
- XSS protection in rich text editor
- CSRF protection via Supabase
- Environment variables for sensitive data

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow existing code style
- Use TypeScript
- Follow component structure
- Add proper types
- Document complex logic

## License

Proprietary - Daimler Truck

## Support

For issues or questions:
- Check this README
- Review code comments
- Check Supabase documentation
- Contact development team

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase**
