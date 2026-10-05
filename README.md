

🚀 LMS Backend API Engine

A robust, production-ready RESTful API backend for a Machine Learning-driven Learning Management System (LMS), built using Node.js, Express.js, and MongoDB.

🛠️ Tech Stack & Dependencies

⚬ Runtime: Node.js
⚬ Framework: Express.js
⚬ Database: MongoDB (via Mongoose ODM)
⚬ Authentication: JWT (JSON Web Tokens) & Bcrypt.js
⚬ HTTP Client: Axios (for FastAPI ML Integration)
⚬ Middleware: CORS, Centralized Error Handler, Health Tracker

🏗️ System Architecture & Features

1. Authentication & Authorization: Secure Signup, Signin, Password Hashing, and JWT-protected routes.
2. Course Management: System-seeded standard tech stack courses with module structures.
3. Enrollment & Progress Tracking: Tracks completed modules, lecture progress, and logs interactions for analytics.
4. Assessment Engine: Dynamically hides correct answer keys from endpoints, calculates scores, and persists quiz attempts.
5. Analytics Dashboard: Aggregates overall user progress, enrolled counts, and quiz scores.
6. ML Recommendation Aggregator: Dynamically compiles 7 core metrics (mean_score, assessment_count, course_score, total_clicks, active_days, learning_resources) and routes them to external FastAPI endpoints.
7. Certificate Engine: Automated generation upon 100% course completion.

⚙️ Environment Variables Setup (.env)

Create a .env file in the root directory and populate it with the following key-value pairs:

PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/lms
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
ML_API_URL=https://learning-management-system-1ej4.onrender.com/recommend/


🚀 Getting Started

1. Install Dependencies

npm install


2. Seed Initial Courses

node seeders/courseSeeder.js


3. Start Development Server

npm run dev
# OR
node server.js


📡 Complete API Endpoints Documentation

🔑 Auth Endpoints (/api/auth)

Method	Endpoint	Description	Auth Required
POST	/api/auth/signup	Register a new user	❌ No
POST	/api/auth/signin	User login & return JWT token	❌ No

📚 Course & Enrollment Endpoints

Method	Endpoint	Description	Auth Required
GET	/api/courses	Fetch all available courses	🔒 Yes (Bearer Token)
POST	/api/courses/:courseId/enroll	Enroll current user in a course	🔒 Yes (Bearer Token)
GET	/api/enrollments/my-courses	Get enrolled courses for logged user	🔒 Yes (Bearer Token)

📈 Progress & Analytics

Method	Endpoint	Description	Auth Required
PATCH	/api/progress/:courseId	Update completed lectures & log activity	🔒 Yes (Bearer Token)
GET	/api/dashboard	Fetch user dashboard analytics	🔒 Yes (Bearer Token)

📝 Quiz & Assessment

Method	Endpoint	Description	Auth Required
POST	/api/quizzes/seed	Auto-seed sample quizzes for testing	🔒 Yes (Bearer Token)
POST	/api/quizzes	Create custom quiz (Admin)	🔒 Yes (Bearer Token)
GET	/api/quizzes/:courseId	Get quiz questions (Answers sanitized)	🔒 Yes (Bearer Token)
POST	/api/quizzes/:quizId/submit	Evaluate answers and save attempt	🔒 Yes (Bearer Token)

🤖 ML Recommendation & Extras

Method	Endpoint	Description	Auth Required
POST	/recommend	Aggregate 7 DB metrics & query ML API	🔒 Yes (Bearer Token)
GET	/api/certificates	Get certificate status	🔒 Yes (Bearer Token)
GET	/api/health	System health check	❌ No

📤 Request/Response Payload Samples

1. Progress Update (PATCH /api/progress/:courseId)

Body:

{
  "lectureId": "6ac0d9b081e5c547095449b5"
}


2. Quiz Submission (POST /api/quizzes/:quizId/submit)

Body:

{
  "answers": [
    {
      "questionId": "65f1a2b3c4d5e6f789019999",
      "selectedOptionIndex": 0
    }
  ]
}


3. ML Recommendation Call (POST /recommend)

Body:

{
  "current_course": "HTML & CSS"
}
**Backend ML:**  
https://learning-management-system-1ej4.onrender.com/

**Course Recommendation Endpoint:**  
POST https://learning-management-system-1ej4.onrender.com/recommend

**Swagger API Documentation FOR ML:**  
https://learning-management-system-1ej4.onrender.com/docs


