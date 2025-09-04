# Blog API – TypeScript, Express & MongoDB

A production-ready RESTful Blog API built with **TypeScript, Express, and MongoDB**.

## 🚀 Features
- User authentication & authorization with JWT
- Role-based access control (admin & user)
- Blog management (create, update, delete, fetch) with slugs & Cloudinary image upload
- Commenting & like system with counters
- Secure practices: input sanitization, rate limiting, cookie-based refresh tokens, and Helmet
- Scalable architecture with controllers, middlewares, and models
- Centralized logging with Winston

## 📂 Tech Stack
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (Access & Refresh tokens)
- **Storage:** Cloudinary (for blog banners)
- **Security:** Helmet, CORS, Rate Limiting, Input Sanitization
- **Logging:** Winston

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/izeeshanshabbir/Blog-API-TypeScript-Express-MongoDB.git

# Navigate to the project folder
cd blog-api

# Install dependencies
npm install

# Create a .env file and configure the following variables
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
LOG_LEVEL=info

# Start the development server
npm run dev
```

## 📌 API Endpoints

### Auth
- `POST /api/v1/auth/register` → Register a new user
- `POST /api/v1/auth/login` → Login & get tokens
- `POST /api/v1/auth/logout` → Logout user
- `POST /api/v1/auth/refresh-token` → Refresh access token

### Blog
- `POST /api/v1/blogs` → Create a new blog (with image upload)
- `GET /api/v1/blogs` → Get all blogs (with pagination & filters)
- `GET /api/v1/blogs/:slug` → Get blog by slug
- `PUT /api/v1/blogs/:id` → Update blog
- `DELETE /api/v1/blogs/:id` → Delete blog

### Comment
- `POST /api/v1/blogs/:id/comments` → Add a comment
- `GET /api/v1/blogs/:id/comments` → Get all comments
- `DELETE /api/v1/comments/:id` → Delete a comment

### Like
- `POST /api/v1/blogs/:id/like` → Like a blog
- `DELETE /api/v1/blogs/:id/unlike` → Unlike a blog

### User
- `GET /api/v1/users` → Get all users (admin only)
- `GET /api/v1/users/:id` → Get a user by ID
- `GET /api/v1/users/me` → Get current user
- `PUT /api/v1/users/me` → Update current user
- `DELETE /api/v1/users/me` → Delete current user
- `DELETE /api/v1/users/:id` → Delete a user (admin only)

## 🛡 License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---
Made with ❤️ by Zeeshan Shabbir Abbasi
