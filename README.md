# AllMall - Ecommerce Website

## 📌 Project Overview
AllMall is a full-stack ecommerce web application developed as part of the **CSE470 Software Engineering** course. Built using the **MERN stack (MongoDB, Express.js, React, Node.js)**, it follows the **Model-View-Controller (MVC)** architecture to provide a scalable and maintainable codebase.

---

## 📚 Table of Contents
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [AI Integration](#ai-integration)
- [Installation & Setup](#installation--setup)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Conclusion](#conclusion)

---

## 🛠️ Technology Stack

### Frontend
- **React** – Component-based UI library
- **React Router** – Client-side routing
- **React Icons** – Icon library
- **Context API** – State management
- **Tailwind CSS** – Styling and responsive design

### Backend
- **Node.js** – Runtime environment
- **Express.js** – Web application framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling
- **JWT** – Authentication tokens
- **bcrypt** – Password hashing
- **Multer** – File upload handling
- **Google Generative AI** – AI chatbot integration

### Development Tools
- **Nodemon** – Development server auto-restart
- **Dotenv** – Environment variable management
- **Postman** – API testing

---

## 📂 Project Structure
```text
allmall/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Context providers
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # Uploaded files
│   └── package.json
└── README.md
```

---

## ✨ Features

### User Features
- User registration and authentication
- User profile management with image upload
- Product browsing and searching
- Shopping cart management
- Wishlist functionality
- Order placement and tracking
- AI-powered shopping assistant

### Admin Features
- Product management (CRUD operations)
- Order management and status updates
- User management
- Inventory management

### Technical Features
- JWT-based authentication
- Responsive design for mobile and desktop
- Secure file uploads
- Real-time cart and wishlist updates
- AI integration for customer support
- Pagination and filtering

---

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  phone: String,
  password: String (hashed),
  description: String,
  image: String (URL),
  address: String,
  isAdmin: Boolean
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  imageUrl: String,
  status: String (active/inactive),
  reviews: [{
    userId: ObjectId,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  averageRating: Number
}
```

### Cart Model
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    priceAtAddition: Number
  }]
}
```

### Wishlist Model
```javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    addedAt: Date
  }]
}
```

### Order Model
```javascript
{
  orderId: String (auto-generated),
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number,
    name: String,
    imageUrl: String
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String
  },
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  subtotal: Number,
  shippingFee: Number,
  totalAmount: Number,
  trackingNumber: String,
  notes: String
}
```

---

## 🔗 API Endpoints

### Authentication Routes
- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login
- `GET /api/auth/user` – Get user data
- `PUT /api/auth/update/:id` – Update user profile
- `GET /api/auth/users` – Get all users (admin)
- `DELETE /api/auth/delete/:id` – Delete user (admin)

### Product Routes
- `GET /api/products` – Get all products
- `GET /api/products/:id` – Get single product
- `POST /api/products` – Create product (admin)
- `PUT /api/products/:id` – Update product (admin)
- `DELETE /api/products/:id` – Delete product (admin)

### Cart Routes
- `GET /api/cart` – Get user cart
- `POST /api/cart` – Add item to cart
- `PUT /api/cart/:itemId` – Update cart item
- `DELETE /api/cart/:itemId` – Remove item from cart
- `DELETE /api/cart` – Clear cart

### Wishlist Routes
- `GET /api/wishlist` – Get user wishlist
- `POST /api/wishlist` – Add item to wishlist
- `DELETE /api/wishlist/:productId` – Remove item from wishlist
- `DELETE /api/wishlist` – Clear wishlist
- `GET /api/wishlist/check/:productId` – Check if product is in wishlist

### Order Routes
- `POST /api/orders` – Create new order
- `GET /api/orders` – Get user orders
- `GET /api/orders/:orderId` – Get single order
- `PUT /api/orders/:orderId` – Update order status (admin)
- `DELETE /api/orders/:orderId` – Cancel order
- `GET /api/orders/admin/all` – Get all orders (admin)

### Chatbot Route
- `POST /api/chatbot/chat` – Interact with AI chatbot

---

## 🤖 AI Integration
The application features an AI-powered chatbot using **Google's Generative AI (Gemini)**. The chatbot can:
- Answer general shopping questions
- Provide product recommendations
- Assist with order status inquiries
- Explain shipping and return policies
- Access real-time user data (cart, wishlist, orders) when authenticated

Implemented in `Chatbot.jsx` and `chatbotController.js` with **context-aware prompts** for personalized responses.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Google Generative AI API key

### Backend Setup
```bash
cd server
npm install
```
Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_TOKEN=your_jwt_secret
GEMINI_API_KEY=your_google_ai_api_key
NODE_ENV=development
```
Start server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
```
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```
Start frontend:
```bash
npm start
```

---

## 🚀 Deployment

### Backend (Heroku)
```bash
heroku create your-app-name
```
- Set environment variables in Heroku dashboard
- Deploy:
```bash
git push heroku main
```

### Frontend (Netlify/Vercel)
```bash
npm run build
```
- Upload `build/` folder
- Configure environment variables

### Database (MongoDB Atlas)
- Create a cluster
- Get the connection string
- Update `MONGODB_URI` in `.env`

---

## 🔮 Future Enhancements
- **Payment Integration**: Add support for popular payment gateways
- **Email Notifications**: Implement order confirmation and status emails
- **Advanced Search**: Add filters and sorting options
- **Product Recommendations**: ML-based recommendation engine
- **Social Features**: Product reviews and ratings
- **Multi-language Support**: Internationalization for global reach
- **PWA**: Progressive Web App for mobile experience
- **Analytics Dashboard**: Sales and user analytics for admin

---

## 🏁 Conclusion
AllMall represents a **comprehensive ecommerce solution** built with modern web technologies. The application demonstrates **full-stack development, database design, API development, and AI integration**. Following software engineering best practices and MVC architecture, it provides a solid foundation for real-world deployment.

**Developed for CSE470 - Software Engineering**  
*Note: This is an academic project demonstrating software engineering principles and full-stack development capabilities.*
