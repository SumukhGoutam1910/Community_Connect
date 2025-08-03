import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Function to configure Cloudinary (call this after env.config())
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Debug: Log configuration (without exposing secrets)
  console.log('🔧 Cloudinary Config Status:');
  console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing'}`);
  console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing'}`);
};

// Configure Cloudinary storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'community_connect/avatars', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Auto-crop to face
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format optimization
    ],
  },
});

// Configure Cloudinary storage for post media (images)
const postImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'community_connect/posts/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' }, // Limit max dimensions
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format optimization
    ],
  },
});

// Configure Cloudinary storage for post media (videos)
const postVideoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'community_connect/posts/videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    resource_type: 'video',
    transformation: [
      { width: 1280, height: 720, crop: 'limit' }, // Limit max dimensions
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format optimization
    ],
  },
});

// Configure Cloudinary storage for documents/files
const postFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'community_connect/posts/files',
    allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar'],
    resource_type: 'raw', // For non-image/video files
  },
});

// Create multer instances for different upload types
const avatarUpload = multer({ 
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const postMediaUpload = multer({ 
  storage: postImageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
});

const postVideoUpload = multer({ 
  storage: postVideoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

const postFileUpload = multer({ 
  storage: postFileStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for documents
  },
});

// Combined multer for mixed media uploads
const mixedMediaUpload = multer({
  storage: multer.memoryStorage(), // Use memory storage for dynamic routing
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
    files: 10, // Max 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Videos
      'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm',
      // Documents
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/zip', 'application/x-rar-compressed'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

export { cloudinary, avatarUpload, postMediaUpload, postVideoUpload, postFileUpload, mixedMediaUpload };
