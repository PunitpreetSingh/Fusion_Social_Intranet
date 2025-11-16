# Express Backend Setup Instructions

## ✅ Backend Files Created

Your Express.js backend is **fully configured** and ready to use. Here's what was created:

```
backend/
├── server.js                 # Main server entry point
├── app.js                    # Express app configuration
├── db.js                     # PostgreSQL connection module
├── package.json              # Dependencies
├── .env                      # Environment variables
├── middleware/
│   ├── errorHandler.js       # Global error handler
│   ├── notFound.js           # 404 handler
│   └── upload.js             # File upload middleware
└── routes/
    ├── users.js              # User management endpoints
    ├── spaces.js             # Space management endpoints
    ├── content.js            # Status/Document/Blog endpoints
    ├── admin.js              # Admin endpoints
    └── uploads.js            # File upload endpoints
```

---

## 🔧 Configuration Required

### Step 1: Get Your Supabase Database Password

1. Go to: https://supabase.com/dashboard
2. Select your project: `hlxgqavbdjymfmwipkmo`
3. Go to **Settings** → **Database**
4. Scroll to **Connection String**
5. Copy the password from the connection string

### Step 2: Update `.env` File

Edit `backend/.env` and replace `YOUR_PASSWORD` with your actual database password:

```env
# backend/.env
PORT=5000
NODE_ENV=development

# Replace YOUR_PASSWORD with your actual Supabase password
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.hlxgqavbdjymfmwipkmo.supabase.co:5432/postgres
```

**Example:**
```env
DATABASE_URL=postgresql://postgres:your_actual_password_here@db.hlxgqavbdjymfmwipkmo.supabase.co:5432/postgres
```

---

## 🚀 Starting the Backend Server

### Install Dependencies (if not done yet)
```bash
cd backend
npm install
```

### Start Development Server
```bash
npm run dev
# Server starts on http://localhost:5000
```

### Start Production Server
```bash
npm start
```

---

## ✅ Testing the Backend

### Test 1: Check Server Status
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "success": true,
  "message": "Social Intranet API",
  "version": "1.0.0",
  "endpoints": {
    "users": "/api/users",
    "spaces": "/api/spaces",
    "content": "/api/content",
    "admin": "/api/admin",
    "uploads": "/api/uploads"
  }
}
```

### Test 2: Get All Users
```bash
curl http://localhost:5000/api/users
```

Expected: List of 5 users from database

### Test 3: Get All Spaces
```bash
curl http://localhost:5000/api/spaces
```

Expected: List of 5 spaces from database

### Test 4: Create Status Update
```bash
curl -X POST http://localhost:5000/api/content/status \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "USER_ID_HERE",
    "body": "<p>Test status from Express API</p>",
    "postIn": "Engineering"
  }'
```

---

## 📊 API Endpoints

### Users API (`/api/users`)

```
GET    /api/users                 # Get all users
GET    /api/users?query=john      # Search users
GET    /api/users/:id             # Get user by ID
POST   /api/users                 # Create new user
PUT    /api/users/:id             # Update user
```

### Spaces API (`/api/spaces`)

```
GET    /api/spaces                # Get all spaces
GET    /api/spaces?query=eng      # Search spaces
POST   /api/spaces                # Create new space
PUT    /api/spaces/:id            # Update space
```

### Content API (`/api/content`)

```
POST   /api/content/status        # Create status update
POST   /api/content/document      # Create document
POST   /api/content/blog          # Create blog post
GET    /api/content?type=status   # Get status updates
GET    /api/content?type=document # Get documents
GET    /api/content?type=blog     # Get blog posts
```

### Uploads API (`/api/uploads`)

```
POST   /api/uploads               # Upload single file
POST   /api/uploads/multiple      # Upload multiple files
GET    /api/uploads/files/:filename  # Get uploaded file
```

### Admin API (`/api/admin`)

```
GET    /api/admin/form-fields?formName=document  # Get form config
POST   /api/admin/form-fields                     # Update form config
DELETE /api/admin/form-fields/:id                 # Delete form config
```

---

## 🧪 Example API Calls

### Create Status Update
```javascript
const response = await fetch('http://localhost:5000/api/content/status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    authorId: 'user-id-here',
    body: '<p>My status update</p>',
    postIn: 'Engineering'
  })
});

const data = await response.json();
console.log('Created:', data);
```

### Create Document
```javascript
const response = await fetch('http://localhost:5000/api/content/document', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    authorId: 'user-id-here',
    title: 'My Document',
    body: 'Document content here...',
    visibility: {
      type: 'place',
      placeName: 'Engineering'
    },
    tags: ['technical', 'documentation']
  })
});

const data = await response.json();
console.log('Created:', data);
```

### Upload File
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('contentType', 'document');
formData.append('contentId', 'document-id-here');

const response = await fetch('http://localhost:5000/api/uploads', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log('Uploaded:', data);
```

---

## 🔐 Database Connection

Your Express backend connects to the **same Supabase PostgreSQL database** as your frontend.

### Tables Available:
- `users` - 5 users ready
- `spaces` - 5 spaces ready
- `status_updates` - Ready for posts
- `documents` - Ready for documents
- `blog_posts` - Ready for blogs
- `attachments` - Ready for file uploads
- `mentions` - Ready for user mentions
- `app_configuration` - App configuration
- `form_fields` - Dynamic form fields

### Connection Details:
```
Host: db.hlxgqavbdjymfmwipkmo.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: (your Supabase password)
```

---

## 🐛 Troubleshooting

### "password authentication failed"
- Go to Supabase Dashboard → Settings → Database
- Get the correct password from Connection String
- Update `.env` file with correct password

### "Port 5000 is already in use"
- Change PORT in `.env` to another port (e.g., 5001)
- Or stop the process using port 5000

### "Cannot find module"
- Run `npm install` in the backend directory
- Make sure all dependencies are installed

### "Database connection failed"
- Check DATABASE_URL format in `.env`
- Verify your Supabase project is online
- Check firewall/network settings

### "ECONNREFUSED"
- Make sure Supabase database is accessible
- Check if you're behind a firewall
- Try using the connection pooler URL instead

---

## 📝 Environment Variables

```env
# Server Configuration
PORT=5000                    # Port for Express server
NODE_ENV=development         # Environment mode

# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.hlxgqavbdjymfmwipkmo.supabase.co:5432/postgres
```

---

## 🎯 Next Steps

1. **Update `.env` with your database password**
2. **Start the server:** `npm run dev`
3. **Test endpoints:** Use curl or Postman
4. **Connect frontend:** Update frontend to use Express APIs
5. **Deploy:** Deploy to Heroku, Railway, or any Node.js hosting

---

## 🚀 Deployment

### Deploy to Heroku
```bash
heroku create your-app-name
heroku config:set DATABASE_URL=your_database_url
git push heroku main
```

### Deploy to Railway
1. Connect your GitHub repo
2. Add DATABASE_URL environment variable
3. Deploy automatically

### Deploy to Render
1. Connect your GitHub repo
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add DATABASE_URL environment variable

---

## 📞 Support

If you encounter issues:

1. Check server logs for errors
2. Verify DATABASE_URL is correct
3. Test database connection with `psql` or another client
4. Check Supabase Dashboard for database status

---

**Your Express backend is ready to use! Just add your database password and start the server.**
