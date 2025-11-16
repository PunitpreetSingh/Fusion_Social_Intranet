# Social Intranet Backend API

Node.js + Express backend for Daimler Truck Social Intranet.

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+

## Installation

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Setup Environment Variables**

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/social_intranet
NODE_ENV=development
```

3. **Setup Database**

Create PostgreSQL database:
```sql
CREATE DATABASE social_intranet;
```

Run migrations:
```bash
psql -U username -d social_intranet -f migrations/001_tables.sql
```

Seed data:
```bash
psql -U username -d social_intranet -f seed/001_seed_data.sql
```

## Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs at `http://localhost:3001`

## API Endpoints

### Users

**GET /api/users**
- Query: `?query=name&page=1&limit=20`
- Search users by name, email, or department
- Returns paginated user list

**GET /api/users/:id**
- Get single user by ID

**POST /api/users**
- Body: `{ name, email, department, avatar_url, role }`
- Create new user

**PUT /api/users/:id**
- Body: `{ name, email, department, avatar_url, role }`
- Update user

### Spaces

**GET /api/spaces**
- Query: `?query=name&page=1&limit=20`
- Search spaces by name
- Returns paginated space list

**POST /api/spaces**
- Body: `{ name, createdBy }`
- Create new space

**PUT /api/spaces/:id**
- Body: `{ name }`
- Update space

### Content

**POST /api/content/status**
- Body: `{ authorId, body, postIn }`
- Create status update

**POST /api/content/document**
- Body: `{ authorId, title, body, visibility, tags, authors }`
- Create document

**POST /api/content/blog**
- Body: `{ authorId, title, body, visibility, tags, blogFor }`
- Create blog post

**GET /api/content**
- Query: `?type=status|document|blog&page=1&limit=20`
- Get content by type

### Admin

**GET /api/admin/form-fields**
- Query: `?formName=document`
- Get form field configuration

**POST /api/admin/form-fields**
- Body: `{ formName, fieldSchemaJson }`
- Create/update form field configuration

**DELETE /api/admin/form-fields/:id**
- Delete form field configuration

### Uploads

**POST /api/uploads**
- Content-Type: `multipart/form-data`
- Field: `file`
- Body: `{ contentType, contentId, createdBy }`
- Upload file

## Example Requests

### Create User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@daimler.com",
    "department": "Engineering",
    "role": "internal"
  }'
```

### Search Users
```bash
curl "http://localhost:3001/api/users?query=john&page=1&limit=10"
```

### Create Space
```bash
curl -X POST http://localhost:3001/api/spaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Team Space",
    "createdBy": 1
  }'
```

### Create Status Update
```bash
curl -X POST http://localhost:3001/api/content/status \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": 1,
    "body": "Working on exciting new features!",
    "postIn": "Engineering"
  }'
```

### Create Document
```bash
curl -X POST http://localhost:3001/api/content/document \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": 1,
    "title": "Technical Documentation",
    "body": "<p>Document content here...</p>",
    "visibility": {
      "type": "place",
      "placeName": "Engineering"
    },
    "tags": ["technical", "documentation"]
  }'
```

### Create Blog Post
```bash
curl -X POST http://localhost:3001/api/content/blog \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": 1,
    "title": "My Blog Post",
    "body": "<p>Blog content here...</p>",
    "visibility": {
      "type": "personal_blog"
    },
    "blogFor": "John Doe'\''s Blog",
    "tags": ["personal", "updates"]
  }'
```

### Upload File
```bash
curl -X POST http://localhost:3001/api/uploads \
  -F "file=@/path/to/file.jpg" \
  -F "contentType=document" \
  -F "contentId=1" \
  -F "createdBy=1"
```

## Database Schema

### Tables
- **users** - User accounts and profiles
- **spaces** - Workspaces/places
- **status_updates** - Quick status posts
- **documents** - Full documents
- **blogs** - Blog posts
- **tags** - Content tags
- **document_tags** - Document-tag relationships
- **blog_tags** - Blog-tag relationships
- **attachments** - File uploads
- **mentions** - User mentions in content
- **form_fields** - Admin-configurable form fields

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 409: Conflict (duplicate)
- 500: Server Error

## Security Notes

- Add authentication middleware for production
- Implement rate limiting
- Add request validation
- Use HTTPS in production
- Sanitize user inputs
- Add CORS whitelist for production

## Development

The server uses:
- **Express** - Web framework
- **pg** - PostgreSQL client
- **multer** - File upload handling
- **cors** - Cross-origin requests
- **body-parser** - JSON parsing

## Testing

Use tools like:
- **Postman** - API testing
- **curl** - Command line testing
- **Jest** - Unit testing (add as needed)

## Production Deployment

1. Set `NODE_ENV=production`
2. Use connection pooling
3. Enable SSL for database
4. Add authentication
5. Configure reverse proxy (nginx)
6. Set up monitoring
7. Enable logging

## Support

For issues:
- Check logs in console
- Verify database connection
- Check environment variables
- Review error messages

## License

Proprietary - Daimler Truck
