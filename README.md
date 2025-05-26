# Job Board
A full-stack job portal that allows users to post, browse, and apply for jobs. Built with React on the frontend and Node.js/Express on the backend.

## 🧠 Features
- User registration and secure authentication (JWT)-
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
- MongoDB (if applicable)
- JWT for authentication
- dotenv for configuration

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
cd backend
npm install

cd ../frontend
npm install

PORT=5000
MONGO_URI=mongodb://localhost:27017/jobboard
JWT_SECRET=your_jwt_secret

cd backend
npm run dev

cd ../frontend
npm start

📄 License
This project is licensed under the MIT License.

