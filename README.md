# 🎓 Campus Resource Optimization Platform

A Full-Stack Web Application designed to efficiently manage and optimize campus resources such as classrooms, laboratories, and equipment. The system provides role-based access for Admin, Faculty, and Students with secure authentication and real-time booking management.

---

## 🚀 Features

### 👨‍💼 Admin
- Manage users (Add / Remove / Update)
- Manage resources (Classrooms, Labs, Equipment)
- Monitor bookings
- Prevent scheduling conflicts

### 👨‍🏫 Faculty
- Request resource bookings
- View availability
- Manage personal bookings

### 🎓 Student
- View available resources
- Request bookings (if permitted)
- Track booking status

---

## 🛠 Tech Stack

### Frontend
- React.js
- CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- Role-based Access Control

---

## 📂 Project Structure
campus-resource-optimization-platform
│
├── backend
│ ├── config
│ ├── controllers
│ ├── middleware
│ ├── models
│ ├── routes
│ ├── utils
│ └── server.js
│
├── frontend
│ ├── public
│ └── src
│
└── .gitignore

Complete Installation & Setup Guide
📌 1️⃣ Clone the Repository

Open terminal and run:

git clone https://github.com/VThrishna/campus-resource-optimization-platform.git
cd campus-resource-optimization-platform

🛠 2️⃣ Backend Setup
🔹 Step 1: Navigate to backend
cd backend

🔹 Step 2: Install dependencies
npm install

🔹 Step 3: Create Environment File

Inside the backend folder, create a file named:

.env
Add the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

🔹 Step 4: Start Backend Server
node server.js

Backend will run on:
http://localhost:5000

🎨 3️⃣ Frontend Setup

Open new terminal.

🔹 Step 1: Navigate to frontend
cd frontend
🔹 Step 2: Install dependencies
npm install
🔹 Step 3: Start React App
npm start

Frontend runs on:

http://localhost:3000

🗄 4️⃣ MongoDB Setup
 Local MongoDB

Install MongoDB locally
Then run:
mongod

Make sure your .env uses:
MONGO_URI=mongodb://127.0.0.1:27017/campus_db


