# Farmhouse Frames - E-Commerce Platform

A complete e-commerce solution featuring your photography with a customer store, user accounts, and a full admin panel.

## Project Structure

```
├── backend/              # Node.js Express API
├── frontend/             # Customer-facing React store
├── admin/                # Admin panel React app
└── README.md
```

## Features

### Customer Store
- Browse and search products
- Add to cart and checkout
- User registration and login
- Order history and tracking
- Account management

### Admin Panel
- Dashboard with sales analytics
- Product management (create, edit, delete)
- Order management and status tracking
- Customer management
- Sales reporting

### Backend API
- User authentication (JWT)
- Product catalog management
- Order processing
- Customer account management
- Admin endpoints with authorization
- MongoDB database integration

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup (Customer Store)

```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local
npm start
```

Store will run on `http://localhost:3000`

### Admin Panel Setup

```bash
cd admin
npm install
echo "REACT_APP_API_URL=http://localhost:5000" > .env.local
npm start
```

Admin panel will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products (Public)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Users (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Orders (Protected)
- `POST /api/orders` - Create order
- `GET /api/orders/user/my-orders` - Get user orders

### Admin (Protected - Admin only)
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/users` - Get all users

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/farmhouse-frames
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your_stripe_key
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## Technology Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Stripe Integration

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios

### Admin Panel
- React 18
- Tailwind CSS
- Chart.js for analytics

## Next Steps

1. **Database Setup**: Install and configure MongoDB
2. **Stripe Integration**: Set up Stripe account and add API keys
3. **Image Upload**: Implement AWS S3 or similar for product images
4. **Email Notifications**: Configure SMTP for order confirmation emails
5. **Deployment**: Deploy to Vercel (frontend), Heroku/Railway (backend)

## Development Notes

- All passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- Admin access requires `role: 'admin'` on user account
- Cart is stored in browser localStorage
- Orders are created after checkout

## License

All rights reserved - Farmhouse Frames
