# Blue Wave Plumbing - Backend

Node.js/Express backend API for Blue Wave Plumbing application with MongoDB and Cloudinary integration.

## Features

- RESTful API for plumbing items management
- MongoDB database integration
- Cloudinary image upload and storage
- CORS enabled for frontend communication
- Health check endpoint for monitoring

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account
- PM2 (for production deployment)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## Development

Run the development server with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Production Deployment on VPS

### 1. Install PM2 globally

```bash
npm install -g pm2
```

### 2. Install dependencies

```bash
npm install --production
```

### 3. Start the application with PM2

Using the ecosystem file:
```bash
pm2 start ecosystem.config.js
```

Or directly:
```bash
pm2 start npm --name "bluewave-backend" -- start
```

### 4. Configure PM2 to start on system boot

```bash
pm2 startup
# Follow the command it suggests (e.g., sudo env PATH=$PATH...)
pm2 save
```

This ensures your application automatically starts when the VPS restarts.

### 5. PM2 Management Commands

```bash
# View all running processes
pm2 list

# View logs
pm2 logs bluewave-backend

# Monitor CPU/Memory usage
pm2 monit

# Restart application
pm2 restart bluewave-backend

# Stop application
pm2 stop bluewave-backend

# Delete from PM2
pm2 delete bluewave-backend

# View detailed info
pm2 show bluewave-backend
```

## Nginx Reverse Proxy Configuration

Create an Nginx configuration file at `/etc/nginx/sites-available/bluewave-backend`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/bluewave-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL/HTTPS Setup with Let's Encrypt

Install Certbot:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

Obtain and configure SSL certificate:
```bash
sudo certbot --nginx -d api.yourdomain.com
```

Certbot will automatically configure SSL and set up auto-renewal.

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### Items
```
GET    /api/items           - Get all items (with optional search and pagination)
GET    /api/items/:id       - Get single item by ID
POST   /api/items           - Create new item (with image upload)
PATCH  /api/items/:id       - Update item (with optional image update)
DELETE /api/items/:id       - Delete item
```

### Query Parameters for GET /api/items
- `search` - Search by name or description
- `category` - Filter by category
- `limit` - Number of results per page (default: 10)
- `skip` - Number of results to skip for pagination

## Project Structure

```
backend/
├── controllers/          # Route controllers
│   └── itemController.js
├── models/              # MongoDB models
│   └── Item.js
├── routes/              # API routes
│   └── itemRoutes.js
├── utils/               # Utility functions
│   └── multerCloudinary.js
├── logs/                # PM2 logs (created automatically)
├── ecosystem.config.js  # PM2 configuration
├── server.js           # Main application file
├── package.json        # Dependencies and scripts
└── .env               # Environment variables (not in git)
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 5000) | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## Troubleshooting

### Check PM2 logs
```bash
pm2 logs bluewave-backend
```

### Restart the application
```bash
pm2 restart bluewave-backend
```

### Check if the app is running
```bash
pm2 status
```

### Test the API directly
```bash
curl http://localhost:5000/api/health
```

### Check Nginx status
```bash
sudo systemctl status nginx
```

### View Nginx error logs
```bash
sudo tail -f /var/log/nginx/error.log
```

## License

ISC
