# Complete Setup Guide for Farmhouse Frames E-Commerce

## Table of Contents
1. [MongoDB Setup](#mongodb-setup)
2. [Stripe Configuration](#stripe-configuration)
3. [AWS S3 Setup (Image Uploads)](#aws-s3-setup)
4. [Gmail SMTP Configuration (Email)](#gmail-smtp-configuration)
5. [Creating Your First Admin](#creating-your-first-admin)
6. [Canvas Product Configuration](#canvas-product-configuration)
7. [Running the Application](#running-the-application)

---

## MongoDB Setup

### Option 1: Local MongoDB (Development)

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify it's running
mongosh
> db.version()  # Should show version number
```

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer (choose "Install MongoDB as a Service")
3. MongoDB will start automatically
4. Verify: Open Command Prompt and run `mongosh`

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl status mongod
```

**Connection String for Local:**
```
MONGODB_URI=mongodb://localhost:27017/farmhouse-frames
```

### Option 2: MongoDB Atlas (Cloud - Recommended for Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project
4. Create a cluster (free tier available)
5. Add IP address to network access (or allow all: 0.0.0.0/0)
6. Create database user with username and password
7. Copy connection string and replace password

**Connection String Format:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/farmhouse-frames?retryWrites=true&w=majority
```

---

## Stripe Configuration

### 1. Create Stripe Account
1. Go to https://stripe.com
2. Click "Get started"
3. Sign up with email
4. Verify email
5. Complete onboarding

### 2. Get API Keys
1. Go to Dashboard → Developers → API Keys
2. You'll see **Publishable Key** and **Secret Key**
3. Make sure you're in "Test Mode" (toggle in top right)
4. Copy both keys

### 3. Set Up Webhook (for order confirmations)
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-backend-url.com/api/payments/webhook`
   - For local testing, use: `http://localhost:5000/api/payments/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the signing secret

### 4. Add to .env
```env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### 5. Test Payment Cards
Stripe provides test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Expiry:** Any future date (e.g., 12/25)
- **CVC:** Any 3 digits (e.g., 123)

---

## AWS S3 Setup

### 1. Create AWS Account
1. Go to https://aws.amazon.com
2. Click "Create AWS Account"
3. Complete signup

### 2. Create S3 Bucket
1. Go to S3 console
2. Click "Create bucket"
3. Name: `farmhouse-frames-images`
4. Region: Choose closest to you (e.g., us-east-1)
5. Uncheck "Block all public access" (we want public read)
6. Create bucket

### 3. Set Bucket Policy
1. Click on bucket → Permissions
2. Click "Bucket Policy"
3. Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::farmhouse-frames-images/*"
    },
    {
      "Sid": "AllowObjectOperations",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:root"
      },
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::farmhouse-frames-images/*"
    }
  ]
}
```

### 4. Create IAM User
1. Go to IAM → Users
2. Click "Create user"
3. Name: `farmhouse-frames-uploader`
4. Continue
5. Click "Attach policies directly"
6. Search and select: `AmazonS3FullAccess`
7. Create user

### 5. Create Access Keys
1. Click on user → Security credentials
2. Click "Create access key"
3. Choose "Application running outside AWS"
4. Copy **Access Key ID** and **Secret Access Key**

### 6. Add to .env
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_S3_BUCKET=farmhouse-frames-images
```

---

## Gmail SMTP Configuration

### 1. Enable Gmail App Passwords
1. Go to myaccount.google.com
2. Security → Enable 2-Step Verification (if not already)
3. Go back to Security
4. Scroll down to "App passwords"
5. Select "Mail" and "Windows Computer"
6. Google generates 16-character password
7. Copy this password

### 2. Add to .env
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # 16-char app password (spaces included)
SMTP_FROM=noreply@farmhouseframes.com
```

### Alternative: Use SendGrid (Recommended)
1. Go to https://sendgrid.com
2. Create free account
3. Create API key
4. Update email service with SendGrid credentials

---

## Creating Your First Admin

### Method 1: API Endpoint (Easiest)

1. Start your backend server:
```bash
cd backend
npm install
npm run dev
```

2. Use POST endpoint to create admin:
```bash
curl -X POST http://localhost:5000/api/admin-users/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marley Chick",
    "email": "admin@farmhouseframes.com",
    "password": "SecurePassword123!"
  }'
```

Or use Postman:
- Method: POST
- URL: `http://localhost:5000/api/admin-users/create-admin`
- Body (JSON):
```json
{
  "name": "Marley Chick",
  "email": "admin@farmhouseframes.com",
  "password": "YourSecurePassword123!"
}
```

### Method 2: MongoDB Direct

1. Open MongoDB Compass or command line
2. Connect to your database
3. Create document in `users` collection:

```javascript
db.users.insertOne({
  "name": "Marley Chick",
  "email": "admin@farmhouseframes.com",
  "password": "$2a$10$...", // bcrypt hashed password
  "role": "admin",
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
})
```

### Method 3: Via Admin Panel
1. Register as normal customer
2. Update the document in MongoDB to set `role: "admin"`

---

## Canvas Product Configuration

Your products support **single-piece** and **multi-piece** canvases:

### Example 1: Single-Piece Canvas
```json
{
  "name": "Kentucky Sunset Canvas",
  "description": "Beautiful sunset over Lake Barkley",
  "price": 49.99,
  "category": "Canvas",
  "canvasType": "single-piece",
  "pieceCount": 1,
  "inventory": 10,
  "material": "Canvas",
  "frameStyle": "Rustic",
  "quality": "Premium",
  "image": "https://s3.amazonaws.com/...",
  "sku": "CANVAS-001"
}
```

### Example 2: Multi-Piece Canvas (2-3 piece set)
```json
{
  "name": "Farmhouse Triptych - Trigg County",
  "description": "3-piece canvas set of rolling farmland",
  "price": 129.99,
  "category": "Canvas Set",
  "canvasType": "multi-piece",
  "pieceCount": 3,
  "pieceDimensions": [
    {
      "width": 16,
      "height": 24,
      "description": "Left panel"
    },
    {
      "width": 16,
      "height": 24,
      "description": "Center panel"
    },
    {
      "width": 16,
      "height": 24,
      "description": "Right panel"
    }
  ],
  "inventory": 5,
  "material": "Canvas",
  "frameStyle": "Modern",
  "quality": "Premium",
  "canvasImages": [
    {
      "pieceNumber": 1,
      "url": "https://s3.amazonaws.com/...",
      "description": "Left panel"
    },
    {
      "pieceNumber": 2,
      "url": "https://s3.amazonaws.com/...",
      "description": "Center panel"
    },
    {
      "pieceNumber": 3,
      "url": "https://s3.amazonaws.com/...",
      "description": "Right panel"
    }
  ],
  "sku": "TRIPTYCH-001"
}
```

### Supported Canvas Types
- Single-piece (standard framed canvas)
- 2-piece (diptych)
- 3-piece (triptych)
- 4-piece (polyptych)
- Custom multi-piece sets

---

## Running the Application

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your keys (MongoDB, Stripe, AWS, Gmail)
nano .env

# Start development server
npm run dev

# Should see:
# ✅ MongoDB connected
# 🚀 Server running on port 5000
```

### 2. Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local
echo "REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE" >> .env.local

# Start dev server
npm start

# Should open http://localhost:3000
```

### 3. Admin Panel Setup (New Terminal)
```bash
cd admin

# Install dependencies
npm install

# Create .env.local
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local
echo "REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE" >> .env.local

# Start dev server
NPORT=3001 npm start

# Should open http://localhost:3001
```

---

## Testing the Full Flow

### 1. Create Admin Account
```bash
curl -X POST http://localhost:5000/api/admin-users/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marley",
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

### 2. Login to Admin Panel
- Go to http://localhost:3001
- Email: `admin@test.com`
- Password: `admin123`

### 3. Add Your First Product
- Click "Products"
- Click "Add Product"
- Fill in details:
  - Name: "Kentucky Sunset"
  - Price: 49.99
  - Inventory: 10
  - Canvas Type: Single-piece
  - Material: Canvas

### 4. Upload Product Image
- In product form, use the upload button
- Select a landscape image of Kentucky
- Image uploads to AWS S3

### 5. Customer Test Flow
- Go to http://localhost:3000
- Click "Shop"
- You should see your product
- Click to view details
- Add to cart
- Checkout

### 6. Test Payment
- Use Stripe test card: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`
- Complete checkout

### 7. Verify Email
- Check Gmail for order confirmation email
- Should contain order details and items

---

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start it
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

### Stripe Payment Fails
- Verify `STRIPE_SECRET_KEY` is correct
- Make sure you're using test keys (not live keys)
- Check webhook secret matches

### Email Not Sending
- Verify Gmail app password is correct (16 chars)
- Check 2-factor authentication is enabled
- Verify SMTP credentials in .env
- Try SendGrid instead

### Image Upload Fails
- Verify AWS credentials in .env
- Check bucket name is correct
- Ensure bucket policy allows public read
- Verify IAM user has S3 permissions

### CORS Errors
- Check `CLIENT_URL` and `ADMIN_URL` in backend .env
- Make sure frontend URL matches exactly
- Verify API URL in frontend .env.local

---

## Next Steps

✅ Add more canvas designs  
✅ Configure shipping rates  
✅ Set up email notifications  
✅ Add product reviews/ratings  
✅ Create discount codes  
✅ Deploy to production  
✅ Set up analytics dashboard  
✅ Add social media integration  

---

## Production Deployment

### Backend (Railway.app)
1. Push code to GitHub
2. Connect Railway to GitHub
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Connect Vercel to GitHub
2. Set `REACT_APP_API_URL` environment variable
3. Set `REACT_APP_STRIPE_PUBLISHABLE_KEY`
4. Deploy

### Database (MongoDB Atlas)
- Already cloud-hosted
- No additional setup needed
