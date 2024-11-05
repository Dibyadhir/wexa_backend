#------------------------------------------------------------ WexaTalk ------------------------------------------------------------------------------------

**WexaTalk** is a real-time messaging application built with React (frontend), Node.js/Express (backend), and MySQL (database). This guide provides a comprehensive overview of how to install, set up, run, and deploy **WexaTalk**.

---

## Table of Contents

1. [Installation](#installation)
2. [Folder Structure](#folder-structure)
3. [Running the Project Locally](#running-the-project-locally)
4. [Deployment](#deployment)
5. [Accessing the Deployed App](#accessing-the-deployed-app)

---
#### 1. Clone the Backend Repository

https://github.com/Dibyadhir/wexa_backend/
cd <folder_Name>
cd backend

### 2. install Dependencies
npm install
npm install bcryptjs
npm install cloudinary 
npm install cors 
npm install dotenv 
npm install express
npm install jsonwebtoken 
npm install multer 
npm install mysql2 
npm install nodemon 
npm install socket.io
---- install all the above packages
### 3. Folder Structure
Here is the Backend folder struct
WexaTalk/
├── backend/               # Contains backend files (Node.js + Express)
│   ├── config/            # Configuration files (e.g., database connection)
│   ├── controllers/       # Logic for user authentication, messaging, etc.
│   ├── routes/            # API routes
│   ├── .env               # Envoronment setup
│   └── package.json       # Backend dependencies and scripts
├── README.md
└── .gitignore

### Running the Project Locally
Create a database (e.g., wexatalk) and set up the necessary tables (e.g., user, activity_logs, messages, etc.).

1. create database wexatalk;
2. use wexatalk
3. create table user(
   id int not null primary key auto_increment,
   password varchar(300) not null,
   email varchar(300) not null,
   pic varchar(300) not null,
   first_name varchar(300) not null,
   last_name varchar(300) not null,
   gender varchar(20) not null,
   dob varchar(20) not null,
   about_yourself varchar(500) not null);
4. CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type ENUM('login','profile_update', 'friend_request', 'friend_accepted') NOT NULL,
    activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
   

### Configure Environment Variables
PORT=8000

JWT_SECRET=mysecretkey

-- db configuration
USER = root
PASSWORD = pass
HOST = localhost
DB_PORT = write your DB Port
DATABASE = wexatalk

-- Cloudinary congiuration

CLOUD_NAME = '<witr cloud name>'
API_KEY = 'api key'
API_SECRET = 'secret key'
UPLOAD_PRESET_PROFILE_IMG = 'preset'

### Start the Backend Server
cd backend 
npm start
### Deployment

### 1. Database Deployment on Railway
Create a Railway Account and start a new project.
Set up a MySQL Database:
From the Railway dashboard, add a new MySQL service.
Copy the connection URL provided, which includes your database credentials.
### 2.Backend Deployment on Render
Create a Render Account and start a new Web Service project.
Connected mu GitHub Repository: Link Render to my GitHub repository where my backend code is hosted.
Environment Variables:
Add all necessary environment variables (like DATABASE_URL, JWT_SECRET, CLOUDINARY_URL) under the "Environment" section in Render.
For DATABASE_URL, use the connection string from Railway.
Specify Start Command: Set the start command, usually npm start or node server.js, in Render.
Deploy the Project: Render will install dependencies and deploy the service. It will provide you with a URL to access your backend.





