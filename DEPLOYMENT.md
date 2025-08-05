# Strapi Backend Deployment Guide

## Prerequisites
- Node.js 16.x or 18.x
- npm or yarn
- Git

## Local Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

3. **Start development server:**
```bash
npm run develop
```

4. **Access admin panel:**
Open http://localhost:1337/admin and create your first admin user.

## Production Deployment

### Option 1: Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Option 2: Heroku Deployment
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set APP_KEYS=your-keys`
4. Deploy: `git push heroku main`

### Option 3: VPS/Server Deployment
1. Clone repository on server
2. Install dependencies: `npm install --production`
3. Build project: `npm run build`
4. Start with PM2: `pm2 start npm --name "strapi" -- start`

## Environment Variables for Production
```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
APP_KEYS=generate-secure-keys
API_TOKEN_SALT=generate-secure-salt
ADMIN_JWT_SECRET=generate-secure-secret
TRANSFER_TOKEN_SALT=generate-secure-salt
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=data.db
```

## Post-Deployment Steps
1. Access admin panel at your-domain.com/admin
2. Create admin user
3. Configure content types permissions
4. Upload initial content using bootstrap data
5. Test API endpoints

## API Endpoints
- Band Members: `/api/band-members`
- Services: `/api/services`
- Timeline Events: `/api/timeline-events`
- Contact Forms: `/api/contacts`
- Site Settings: `/api/site-setting`
