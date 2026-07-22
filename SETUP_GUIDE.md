# Complete Setup Guide for Farmhouse Frames E-Commerce

## 1. Database Setup

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows - Download from https://www.mongodb.com/try/download/community

# Verify connection
mongo
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Add to `.env` as `MONGODB_URI`

## 2. Backend Configuration

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with:
# - MONGODB_URI: your database connection
# - JWT_SECRET: any random string for signing tokens
# - STRIPE keys (optional for now)
```

## 3. Create Admin User

After backend is running, create first admin:

```bash
# Use MongoDB command line or MongoDB Compass
db.users.insertOne({
  name: "Admin",
  email: "admin@farmhouseframes.com",
  password: "bcryptHashedPassword",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})

# OR register via API then manually set role to admin
POST /api/auth/register
# Then update the user's role in MongoDB
```

## 4. Add Sample Products

Use Admin Panel or API:

```bash
POST /api/admin/products
Authorization: Bearer {admin_token}

{
  "name": "Kentucky Sunset Canvas",
  "description": "Beautiful sunset over Lake Barkley",
  "price": 49.99,
  "category": "Canvas",
  "inventory": 10,
  "sku": "CANVAS-001"
}
```

## 5. Frontend Configuration

```bash
cd frontend
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local

npm start
```

## 6. Admin Panel Configuration

```bash
cd admin
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local

# In a different terminal
npm start
```

## 7. Testing the System

### Customer Flow
1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Create account
4. Browse products
5. Add to cart
6. Checkout

### Admin Flow
1. Visit `http://localhost:3001`
2. Login with admin credentials
3. Add products
4. View orders
5. Manage customers

## 8. Payment Integration (Stripe)

1. Create Stripe account at https://stripe.com
2. Get API keys from dashboard
3. Add to backend `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. Update checkout component with Stripe Elements

## 9. Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Connect GitHub repo to Vercel
# Set REACT_APP_API_URL environment variable
```

### Admin Panel (Vercel)
```bash
cd admin
npm run build
# Deploy separately to different Vercel project
```

### Backend (Railway/Render)
1. Push to GitHub
2. Connect repo to Railway or Render
3. Set environment variables
4. Deploy

## 10. SSL Certificates & Domain

For production:
1. Get custom domain (e.g., shop.farmhouseframes.com)
2. Enable HTTPS (Vercel/Railway handle this)
3. Update CORS settings in backend
4. Update API URLs in frontend env

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongo --version

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### CORS Errors
- Check backend `.env` has correct CLIENT_URL and ADMIN_URL
- Ensure frontend is making requests to correct API URL

### Authentication Issues
- Verify JWT_SECRET is same in all app instances
- Check token is being saved in localStorage
- Verify Authorization header format: "Bearer {token}"

## Next Features to Add

- [ ] Stripe payment processing
- [ ] Email notifications
- [ ] Product image upload
- [ ] Discount codes
- [ ] Email verification
- [ ] Password reset
- [ ] Product reviews
- [ ] Wishlist
- [ ] Search and filtering
- [ ] Analytics dashboard
