import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import Comment from "./models/Comment.js";
import Conversation from "./models/Conversation.js";
import Like from "./models/Like.js";
import Event from "./models/Event.js";
import File from "./models/File.js";
import User from "./models/User.js";
import Message from "./models/Message.js";
import Post from "./models/Post.js";
import { configureCloudinary, avatarUpload, mixedMediaUpload, cloudinary } from "./config/cloudinary.js";

const app = express();
env.config();

const port = process.env.PORT || 3001;

// Configure Cloudinary after environment variables are loaded
configureCloudinary();

// CORS setup for React frontend (must be first middleware)
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:3002",
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Allow HTTP for local development
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB connected successfully");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  console.error("Please check your MONGO_URI environment variable");
});

// Passport configuration
passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password' });
        }
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Middleware to check if user is logged in
app.use((req, res, next) => {
    res.locals.user = req.isAuthenticated() ? req.user : null;
    next();
});

// Health check route (keep this for API health)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
            username,
            name,
            email,
            passwordHash
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ 
        message: 'Login successful', 
        user: { 
            id: req.user._id, 
            username: req.user.username,
            name: req.user.name, 
            email: req.user.email 
        } 
    });
});

app.post('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});


// Get user profile (full)
app.get('/api/user', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    console.log('=== GET USER PROFILE ===');
    console.log('User ID:', req.user._id);
    console.log('Raw user from DB:', JSON.stringify(user.toObject(), null, 2));
    
    // Map bio to about for frontend
    const userObj = user.toObject();
    userObj.about = userObj.bio;
    
    console.log('User object sent to frontend:', JSON.stringify(userObj, null, 2));
    res.json({ user: userObj });
});

// Upload avatar to Cloudinary
app.post('/api/user/upload-avatar', avatarUpload.single('avatar'), async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Update user's avatar URL in database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // req.file.path contains the Cloudinary URL
        user.avatarUrl = req.file.path;
        await user.save();

        console.log('Avatar uploaded successfully:', req.file.path);
        res.json({ 
            message: 'Avatar uploaded successfully', 
            avatarUrl: req.file.path 
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Upload multiple media files to Cloudinary (for posts)
app.post('/api/upload/media', mixedMediaUpload.array('files', 10), async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        console.log('📁 Processing', req.files.length, 'files for upload...');
        
        const uploadPromises = req.files.map(async (file) => {
            return new Promise((resolve, reject) => {
                // Determine upload parameters based on file type
                let uploadParams = {
                    folder: 'community_connect/posts',
                    quality: 'auto',
                    fetch_format: 'auto'
                };

                // Configure parameters based on file type
                if (file.mimetype.startsWith('image/')) {
                    uploadParams.folder = 'community_connect/posts/images';
                    uploadParams.transformation = [
                        { width: 1200, height: 1200, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
                    ];
                } else if (file.mimetype.startsWith('video/')) {
                    uploadParams.folder = 'community_connect/posts/videos';
                    uploadParams.resource_type = 'video';
                    uploadParams.transformation = [
                        { width: 1280, height: 720, crop: 'limit' },
                        { quality: 'auto' }
                    ];
                } else {
                    // Documents/files
                    uploadParams.folder = 'community_connect/posts/files';
                    uploadParams.resource_type = 'raw';
                }

                // Upload to Cloudinary using upload stream
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadParams,
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(error);
                        } else {
                            console.log('✅ Uploaded:', result.secure_url);
                            resolve({
                                url: result.secure_url,
                                publicId: result.public_id,
                                originalName: file.originalname,
                                mimeType: file.mimetype,
                                size: file.size,
                                type: file.mimetype.startsWith('image/') ? 'image' : 
                                      file.mimetype.startsWith('video/') ? 'video' : 'file'
                            });
                        }
                    }
                );

                // Pipe the file buffer to Cloudinary
                uploadStream.end(file.buffer);
            });
        });

        // Wait for all uploads to complete
        const uploadResults = await Promise.all(uploadPromises);
        
        console.log('🎉 All files uploaded successfully:', uploadResults.length);
        res.json({ 
            message: 'Files uploaded successfully', 
            files: uploadResults 
        });
        
    } catch (error) {
        console.error('Media upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
app.post('/api/user/update', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        console.log('=== PROFILE UPDATE REQUEST ===');
        console.log('User ID:', req.user._id);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const { name, title, location, about, avatar, coverColor, profile } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        console.log('Current user profile before update:', JSON.stringify(user.profile, null, 2));
        
        // Update top-level fields
        user.name = name || user.name || '';
        user.title = title || user.title || '';
        user.location = location || user.location || '';
        user.bio = about || user.bio || '';
        user.avatarUrl = avatar || user.avatarUrl || '';
        user.coverColor = coverColor || user.coverColor || '';
        // Merge profile fields properly
        const currentProfile = user.profile || {};
        const currentSocialLinks = currentProfile.socialLinks || {};
        const newSocialLinks = profile?.socialLinks || {};
        
        console.log('Current socialLinks:', JSON.stringify(currentSocialLinks, null, 2));
        console.log('New socialLinks from request:', JSON.stringify(newSocialLinks, null, 2));
        
        user.profile = {
            experience: profile?.experience || currentProfile.experience || [],
            education: profile?.education || currentProfile.education || [],
            skills: profile?.skills || currentProfile.skills || [],
            socialLinks: {
                linkedin: newSocialLinks.linkedin || currentSocialLinks.linkedin || '',
                github: newSocialLinks.github || currentSocialLinks.github || '',
                twitter: newSocialLinks.twitter || currentSocialLinks.twitter || ''
            }
        };
        
        console.log('Final socialLinks before save:', JSON.stringify(user.profile.socialLinks, null, 2));
        
        console.log('User profile after update:', JSON.stringify(user.profile, null, 2));
        
        user.markModified('profile'); // Ensure Mongoose saves nested changes
        await user.save();
        
        console.log('Profile saved successfully');
        res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Posts routes
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username name email avatarUrl').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Must be logged in to create posts' });
        }
        
        const { title, content, media } = req.body;
        
        // Validate that we have either content or media
        if (!content?.trim() && (!media || media.length === 0)) {
            return res.status(400).json({ error: 'Post must have content or media' });
        }
        
        const newPost = new Post({
            title,
            content,
            author: req.user._id,
            media: media || [] // Array of {type, url, originalName, etc.}
        });
        
        console.log('📝 Creating post with media:', media?.length || 0, 'items');
        
        await newPost.save();
        await newPost.populate('author', 'username name email avatarUrl');
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Must be logged in to edit posts' });
        }
        
        const { id } = req.params;
        const { content } = req.body;
        
        // Find the post
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        // Check if the user is the author of the post
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only edit your own posts' });
        }
        
        // Update the post
        post.content = content;
        await post.save();
        await post.populate('author', 'username name email');
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Serve React frontend build as static files (must be after all API routes)
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "build")));

// Catch-all for non-API routes (Express 5+ safe)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📱 Frontend should connect to this backend from http://localhost:3000`);
});