# Video Upload Platform

A modern SvelteKit application with Svelte 5 (runes mode) for video uploads with AI-powered content analysis. Features a mobile-optimized public upload interface and a comprehensive admin dashboard.

## 🚀 Features

### Public Interface

- **Mobile-optimized video upload** with drag & drop support
- **AI-powered video analysis** using OpenAI Vision API
- **Real-time screenshot extraction** from uploaded videos
- **Automatic content description** generation
- **Upload progress tracking** with visual feedback
- **Metadata collection** (name, email, Instagram handle)

### Admin Dashboard

- **Basic Authentication** protection
- **Video management** with comprehensive table view
- **BunnyStream video player** integration
- **Video download** functionality
- **Content management** for site copy (colophon, screening dates)
- **Upload statistics** and system overview

### Technical Stack

- **Frontend**: SvelteKit with Svelte 5 (runes mode)
- **UI Components**: Flowbite Svelte with TailwindCSS
- **Database**: Cloudflare D1 with Drizzle ORM
- **Video Hosting**: BunnyStream CDN
- **AI Analysis**: OpenAI GPT-4 Vision API
- **Deployment**: Cloudflare Pages

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **BunnyStream account** with API credentials
4. **OpenAI API key** with GPT-4 Vision access
5. **Cloudflare account** for D1 database and Pages deployment

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd deepsoup
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

Update `.env` with your actual credentials:

```bash
DATABASE_URL=file:local.db

# Admin credentials (change these!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# BunnyStream API Configuration
BUNNY_API_KEY=your_bunny_api_key
BUNNY_LIBRARY_ID=your_bunny_library_id
BUNNY_STORAGE_ZONE_NAME=your_storage_zone_name

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key
```

### 3. Database Setup

Generate and apply database migrations:

```bash
npm run db:generate
npm run db:push
```

### 4. Development Server

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to see the upload interface.
Visit `http://localhost:5173/admin` to access the admin dashboard.

## 🗂️ Project Structure

```
src/
├── lib/
│   ├── server/
│   │   ├── db/           # Database configuration and schema
│   │   ├── bunny-stream.ts    # BunnyStream API integration
│   │   └── openai.ts          # OpenAI API integration
│   └── assets/           # Static assets
├── routes/
│   ├── +page.svelte           # Public upload interface
│   ├── api/
│   │   ├── analyze-video/     # AI analysis endpoint
│   │   └── upload-video/      # Video upload endpoint
│   └── admin/                 # Admin dashboard
│       ├── +layout.server.ts  # Admin authentication
│       ├── +layout.svelte     # Admin layout with navigation
│       ├── +page.svelte       # Dashboard overview
│       ├── videos/            # Video management
│       └── content/           # Content management
└── app.html               # Main HTML template
```

## 🎯 Key Features Explained

### Video Upload Process

1. User selects video file (drag & drop or file picker)
2. Client-side validation (file type, size limits)
3. Video preview loads and metadata is extracted
4. Screenshots are captured at 10%, 30%, 60%, 90% of video duration
5. Screenshots are sent to OpenAI for content analysis
6. AI generates title and description while upload is prepared
7. Video file is uploaded to BunnyStream
8. Metadata is saved to database with processing status

### Admin Authentication

- Uses HTTP Basic Authentication for simplicity
- Session cookies for subsequent requests
- Protects all `/admin/*` routes
- Configurable via environment variables

### Content Management

- Editable colophon text for credits/acknowledgments
- Screening dates information for events
- Real-time preview of content changes
- Version tracking with last updated timestamps

## 🚀 Deployment

### Cloudflare Pages Deployment

1. **Prepare for production**:

```bash
npm run build
```

2. **Set up Cloudflare D1 database**:

```bash
wrangler d1 create deepsoup-db
wrangler d1 execute deepsoup-db --file=./drizzle/0000_hot_luminals.sql
```

3. **Configure environment variables** in Cloudflare Pages dashboard:

- `BUNNY_API_KEY`
- `BUNNY_LIBRARY_ID`
- `BUNNY_STORAGE_ZONE_NAME`
- `OPENAI_API_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

4. **Update database URL** for production in `wrangler.toml`

5. **Deploy** via Cloudflare Pages dashboard or CLI

## 🔧 Configuration Options

### File Upload Limits

- **Maximum file size**: 300MB (configurable)
- **Supported formats**: MP4, MOV, AVI, and other video formats
- **Duration limit**: No specific limit (BunnyStream handles encoding)

### AI Analysis Settings

- **Model**: GPT-4 Vision Preview (cost-optimized)
- **Screenshot count**: 4 per video (10%, 30%, 60%, 90%)
- **Fallback behavior**: Generates basic description from filename if AI fails

### Admin Interface

- **Authentication**: HTTP Basic Auth with session cookies
- **Video management**: View, download, status monitoring
- **Content editing**: Rich text areas with live preview

## 🐛 Troubleshooting

### Common Issues

**Database connection errors**:

- Verify `DATABASE_URL` in `.env`
- Run `npm run db:push` to sync schema

**Video upload failures**:

- Check BunnyStream API credentials
- Verify file size is under 300MB
- Ensure video format is supported

**AI analysis not working**:

- Verify OpenAI API key has GPT-4 Vision access
- Check API quota/rate limits
- Screenshots might be failing to extract

**Admin login issues**:

- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`
- Clear browser cache/cookies
- Check for typos in credentials

## 📱 Mobile Optimization

The upload interface is specifically optimized for mobile devices:

- Touch-friendly drag & drop zones
- Responsive design for all screen sizes
- Large, accessible form controls
- Progress indicators designed for mobile viewing
- Optimized video preview for mobile bandwidth

## 🔒 Security Considerations

- Admin routes protected with HTTP Basic Authentication
- File type validation on both client and server
- File size limits to prevent abuse
- SQL injection protection via Drizzle ORM
- Environment variable separation for secrets

## 📄 License

This project is licensed under the MIT License.
