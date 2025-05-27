# Job Board

A full-stack job portal that allows users to post, browse, and apply for jobs. Built with React on the frontend and Node.js/Express on the backend.

## 🧠 Features

- User registration and secure authentication (JWT)
- Role-based access: Employers & Job Seekers
- Post, edit, and manage job listings
- Browse and search for jobs
- Apply for jobs with instant feedback
- Responsive UI with modern design
- RESTful API for all backend operations

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5 & CSS3
- Axios (for HTTP requests)
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- dotenv for configuration

---

## 📸 Frontend Screenshots

- **Login Page**  
  ![Login Page](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/login.png)

- **Signup Page**  
  ![Signup Page](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/sigup.png)

- **Landing Page**  
  ![Landing Page](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/landing.png)

- **Candidate Dashboard**  
  ![Candidate Dashboard](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/candidate_dashboard.png)

- **Employee Dashboard**  
  ![Employee Dashboard](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/employee_dashboard.png)

- **Profile Page**  
  ![Profile Page](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/profile.png)

- **Apply Job 1**  
  ![Apply Job 1](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/apply_job1.png)
  ![Apply Job 2](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/apply_job2.png)
  ![Apply Job 3](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/apply_job3.png)

- **Job Detail Page**  
  ![Detail Page](https://raw.githubusercontent.com/jay091105/codsoft_task-1/main/frontend/public/screenshots/detail_page.png)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:
- Node.js (v14 or newer)
- npm or yarn
- MongoDB (if used)

### 🔧 Installation

```bash
git clone https://github.com/jay091105/Job_Board.git
cd Job_Board

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install

PORT=5000
MONGO_URI=mongodb://localhost:27017/jobboard
JWT_SECRET=your_jwt_secret

# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm start

