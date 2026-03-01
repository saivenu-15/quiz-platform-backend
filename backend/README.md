# Quiz Platform Backend

Production-grade MERN stack real-time quiz platform backend optimized for free-tier hosting.

## 🚀 Features

- **JWT Authentication** with secure httpOnly cookies
- **RESTful API** for quiz management
- **MongoDB** database with optimized connection pooling
- **Role-based access control** (Admin/User)
- **Comprehensive error handling**
- **Production-ready** configuration

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account (free tier)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd quiz-platform-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   ```

4. **Get MongoDB Atlas URI**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Replace `<password>` and database name in the URI

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### Quiz Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/quizzes` | Get all quizzes | Public |
| GET | `/api/quizzes/:id` | Get quiz by ID | Public |
| POST | `/api/quizzes` | Create new quiz | Private |
| PUT | `/api/quizzes/:id` | Update quiz | Private (Creator) |
| DELETE | `/api/quizzes/:id` | Delete quiz | Private (Creator) |

## 🧪 Testing the API

### Using Thunder Client / Postman

1. **Register a new user**
   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   Content-Type: application/json

   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Create a quiz** (requires authentication)
   ```
   POST http://localhost:5000/api/quizzes
   Content-Type: application/json
   Cookie: token=your_jwt_token

   {
     "title": "Sample Quiz",
     "description": "A test quiz",
     "timeLimit": 30,
     "category": "general",
     "difficulty": "medium",
     "questions": [
       {
         "questionText": "What is 2 + 2?",
         "type": "multiple-choice",
         "options": ["3", "4", "5", "6"],
         "correctAnswer": "4",
         "points": 10
       }
     ]
   }
   ```

## 🏗️ Architecture

```
quiz-platform-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── quizController.js  # Quiz CRUD operations
├── models/
│   ├── User.js            # User schema
│   ├── Quiz.js            # Quiz schema
│   ├── Question.js        # Question schema
│   └── Participant.js     # Quiz participant schema
├── routes/
│   ├── auth.js            # Auth routes
│   └── quiz.js            # Quiz routes
├── utils/
│   ├── authMiddleware.js  # JWT verification
│   ├── errorHandler.js    # Error handling
│   └── generateToken.js   # Token generation
├── .env.example           # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js              # Entry point
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT tokens stored in httpOnly cookies
- CORS configuration
- Helmet.js for security headers
- Input validation
- Environment-based configuration

## 🌐 Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables in Render dashboard
5. Deploy!

**Build Command:** `npm install`
**Start Command:** `npm start`

## 📦 Database Schema

### User
- name, email, password (hashed), role, createdAt

### Quiz
- title, description, creator, timeLimit, isPublic, category, difficulty

### Question
- quiz, questionText, type, options, correctAnswer, points, order

### Participant
- quiz, user, answers, score, percentage, startedAt, completedAt

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

ISC
