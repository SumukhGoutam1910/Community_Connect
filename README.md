# COMMUNITY_CONNECT

*Connecting Communities, Empowering Every Voice*

[![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/community_connect?style=for-the-badge&color=brightgreen)](https://github.com/yourusername/community_connect)
[![JavaScript](https://img.shields.io/badge/javascript-99.0%25-brightgreen?style=for-the-badge&logo=javascript)](https://github.com/yourusername/community_connect)
[![Languages](https://img.shields.io/badge/languages-3-blue?style=for-the-badge)](https://github.com/yourusername/community_connect)

## Built with the tools and technologies:

### Backend Technologies
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3A0A?style=for-the-badge&logo=autoprefixer&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)

### Frontend Technologies
![.ENV](https://img.shields.io/badge/.ENV-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Passport](https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled_Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

Community Connect is a full-stack social networking platform designed to bring communities together and amplify every voice. Built with modern web technologies, it provides a comprehensive suite of features for social interaction, networking, and community building.

The platform serves as a hub for academic communities, particularly designed for ECE department interactions, featuring real-time messaging, job opportunities, networking capabilities, and administrative tools.

## Features

### 🌟 Core Features
- **User Authentication & Authorization** - Secure login/signup.
- **Real-time Messaging** - Instant communication with Socket.io from accepted invitations only.
- **Social Feed** - Post, like, comment, and share content from public feed.
- **Networking** - Connect with other users and build professional networks.
- **Job Portal** - Browse and post job opportunities.
- **Notifications** - Real-time updates on user activities including new messages and posts.
- **Events** - Attend events and mark them RSVP as a reminder.
- **File Sharing** - Upload and share documents, images, and media giving a multimedia cutting edge.
- **File Viewer** - Uses an inbuilt embedded file viewer for files , photos and videos from the posts.
- **Say cheese** - Allows camera access to upload photos and recordings from the device camera.
- **Admin Dashboard** - Comprehensive administrative controls (Frontend only.)

### 💻 Technical Features
- **Responsive Design** - Mobile-first approach with styled-components
- **Cloud Storage** - Cloudinary integration for media management
- **Database Management** - MongoDB with Mongoose ODM
- **RESTful API** - Clean and documented API endpoints
- **Real-time Updates** - Live notifications and messaging
- **Security** - Password hashing, session management, and CORS protection

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling solution
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time communication
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **Passport.js** - Authentication middleware
- **Cloudinary** - Cloud-based media management
- **Multer** - File upload handling
- **bcrypt** - Password hashing

### Development Tools
- **npm** - Package management
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request body parsing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/yourusername/community_connect.git
cd community_connect
```

### Backend Setup
```bash
cd Backend
npm install

# Create .env file with the following variables:
# MONGODB_URI=your_mongodb_connection_string
# SESSION_SECRET=your_session_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_key
# CLOUDINARY_API_SECRET=your_cloudinary_secret

node server.js / npm start
```

### Frontend Setup
```bash
cd Frontend
npm install
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

## Usage

### Getting Started
1. Register a new account or login with existing credentials
2. Complete your profile setup
3. Explore the dashboard and available features
4. Connect with other users in the network
5. Start posting and engaging with the community

### Key Functionalities

#### User Management
- Secure registration and authentication
- Profile customization and management
- Password reset functionality

#### Social Features
- Create and share posts with media
- Like, comment, and interact with content
- Real-time messaging system
- Follow and connect with other users

#### Professional Features
- Job posting and browsing
- Network building and professional connections
- Educational resource sharing
- Department-specific features for ECE students

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Posts Endpoints
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Messaging Endpoints
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message
- `GET /api/conversations` - Get conversations

### Network Endpoints
- `GET /api/users` - Get all users
- `POST /api/connections` - Send connection request
- `PUT /api/connections/:id` - Accept/reject connection

## Database Schema

### User Model
- Username, email, password
- Profile information
- Connections and followers
- Created and updated timestamps

### Post Model
- Content, media attachments
- Author reference
- Likes and comments
- Timestamps

### Message Model
- Sender and receiver references
- Content and media
- Conversation threading
- Read status and timestamps

### Additional Models
- Comments, Likes, Notifications
- Events, Files, Conversations

## Project Structure

```
community_connect/
├── Backend/
│   ├── models/          # Database models
│   ├── config/          # Configuration files
│   ├── migrations/      # Database migrations
│   ├── scripts/         # Utility scripts
│   └── server.js        # Main server file
├── Frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── public/          # Static assets
└── README.md
```

## Contributing

We welcome contributions to Community Connect! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## Deployment

### Deploy on Render

This application can be deployed on Render using the following steps:

#### Prerequisites for Deployment
- GitHub repository with your code
- MongoDB Atlas account (for cloud database)
- Cloudinary account (for media storage)

#### Backend Deployment on Render

1. **Prepare your backend for production:**

Update your `Backend/server.js` to use environment PORT:
```javascript
const port = process.env.PORT || 3001;
```

2. **Create a Web Service on Render:**
   - Connect your GitHub repository
   - Choose the `Backend` folder as the root directory
   - Set the following configuration:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables to set in Render:**
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secure_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=https://your-frontend-app.onrender.com
BACKEND_URL=https://your-backend-app.onrender.com
PORT=10000
```

#### Frontend Deployment on Render

1. **Update Frontend API endpoints:**

Create a production build configuration in your React app. Update your API calls to point to your deployed backend URL.

2. **Create a Static Site on Render:**
   - Choose the `Frontend` folder as the root directory
   - Set the following configuration:

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
build
```

**Environment Variables (if needed):**
```
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

#### Alternative: Full-Stack Deployment

For a single deployment, you can serve your React app from your Express server:

1. **Modify your backend package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "cd ../Frontend && npm install && npm run build && cp -r build ../Backend/",
    "heroku-postbuild": "npm run build"
  }
}
```

2. **Update your server.js to serve static files:**
```javascript
// Serve static files from React build
app.use(express.static('build'));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

3. **Render Configuration for Full-Stack:**
   - Root directory: `/`
   - Build command: `cd Backend && npm install && npm run build`
   - Start command: `cd Backend && npm start`

#### Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add your Render IP to the allowed IP addresses (or use 0.0.0.0/0 for all IPs)
4. Set the MONGODB_URI environment variable in Render

#### Post-Deployment Steps

1. **Update CORS settings** in your backend to include your Render domain:
```javascript
app.use(cors({
    origin: [
        "http://localhost:3000", 
        "https://your-frontend-app.onrender.com",
        "https://your-backend-app.onrender.com"
    ], 
    credentials: true
}));
```

2. **Test all functionality** after deployment
3. **Monitor logs** in Render dashboard for any issues

#### Build Commands Summary

**For Backend only:**
```bash
# In Backend directory
npm install
npm start
```

**For Frontend only:**
```bash
# In Frontend directory
npm install
npm run build
```

**For Full-Stack deployment:**
```bash
# Build command
cd Backend && npm install && cd ../Frontend && npm install && npm run build && cp -r build ../Backend/

# Start command
cd Backend && npm start
```

#### Troubleshooting Deployment

- Check Render logs for error messages
- Ensure all environment variables are set correctly
- Verify database connection strings
- Check CORS configuration
- Ensure file paths are correct in production

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

## Acknowledgments

- React community for excellent documentation
- Express.js team for the robust framework
- MongoDB for the flexible database solution
- All contributors who have helped improve this project

---

**Built by Sumukh Goutam**