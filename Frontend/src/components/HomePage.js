import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from './Navbar';
import MediaUpload from './MediaUpload';
import { Calendar, MessageSquare, Share, Send } from 'lucide-react';

// Helper to format timestamps
function formatTimestamp(ts) {
  if (!ts) return '';
  const now = Date.now();
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  const d = new Date(ts);
  return d.toLocaleString();
}

const Home = () => {
  const navigate = useNavigate();
  
  // Authentication and user state
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  

  // Track which post's comments are open
  const [openComments, setOpenComments] = React.useState({});

  // Posts state - start with empty array, will be loaded from backend
  const [posts, setPosts] = React.useState([]);
  
  // Check authentication status and fetch user data
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user', { 
          withCredentials: true 
        });
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('User not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch posts from backend
  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/posts', {
          withCredentials: true
        });
        setPosts(response.data);
        
        // After fetching posts, fetch like status and comment status for each post
        if (isAuthenticated && response.data.length > 0) {
          fetchPostStatuses(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        // Keep empty posts array on error
      }
    };

    fetchPosts();
  }, [isAuthenticated]); // Re-run when authentication status changes
  
  // Fetch like status and comment status for all posts
  const fetchPostStatuses = async (postsData) => {
    for (const post of postsData) {
      const postId = post._id || post.id;
      // Fetch like status
      fetchLikeStatus(postId);
      // Fetch user's comment status (check if user has commented)
      fetchUserCommentStatus(postId);
    }
  };
  
  // Check if user has commented on a post
  const fetchUserCommentStatus = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/posts/${postId}/user-comment-status`, { withCredentials: true });
      setUserCommentedPosts(prev => ({ ...prev, [postId]: res.data.hasCommented }));
    } catch (e) {
      setUserCommentedPosts(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Track which posts the user has commented on
  const [userCommentedPosts, setUserCommentedPosts] = React.useState({});
  

  // Sync posts to localStorage whenever posts change
  React.useEffect(() => {
    localStorage.setItem('user_posts', JSON.stringify(posts));
  }, [posts]);

  // Comments and likes state will be fetched from backend per post
  const [comments, setComments] = React.useState({}); // { [postId]: [commentObj, ...] }
  const [commentInputs, setCommentInputs] = React.useState({});
  const [likedPosts, setLikedPosts] = React.useState({}); // { [postId]: true/false }

  // Notification state
  const [notification, setNotification] = React.useState(null);

  // Show notification function
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Hide after 3 seconds
  };

  // Debug: Log likedPosts state changes
  React.useEffect(() => {
    console.log('🔄 LikedPosts state changed:', likedPosts);
  }, [likedPosts]);

  // Fetch comments for a post
  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/posts/${postId}/comments`, { withCredentials: true });
      setComments(prev => ({ ...prev, [postId]: res.data }));
    } catch (e) {
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  // Fetch like status for a post
  const fetchLikeStatus = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/posts/${postId}/like-status`, { withCredentials: true });
      setLikedPosts(prev => ({ ...prev, [postId]: res.data.liked }));
    } catch (e) {
      setLikedPosts(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Like/unlike a post
  const handleLike = async (postId) => {
    console.log('=== LIKE BUTTON DEBUG ===');
    console.log('1. PostId:', postId);
    console.log('2. Current likedPosts state:', likedPosts);
    console.log('3. Current like status for this post:', likedPosts[postId]);
    
    // Optimistic update - immediately toggle the UI
    const currentLiked = likedPosts[postId] || false;
    const newLiked = !currentLiked;
    
    console.log('4. Optimistic update: setting to', newLiked);
    setLikedPosts(prev => {
      const newState = { ...prev, [postId]: newLiked };
      console.log('5. Optimistic state update:', newState);
      return newState;
    });
    
    try {
      const res = await axios.post(`http://localhost:3001/api/posts/${postId}/like`, {}, { withCredentials: true });
      console.log('6. Backend response:', res.data);
      
      // Update with actual backend response
      setLikedPosts(prev => {
        const finalState = { ...prev, [postId]: res.data.liked };
        console.log('7. Final state from backend:', finalState);
        return finalState;
      });
      
      setPosts(posts => posts.map(post => (post._id || post.id) === postId ? { ...post, likes: res.data.likes } : post));
      console.log('8. Posts updated with new like count');
    } catch (e) {
      console.error('9. Like error - reverting optimistic update:', e);
      // Revert optimistic update on error
      setLikedPosts(prev => ({ ...prev, [postId]: currentLiked }));
    }
  };
  
  const [newPost, setNewPost] = React.useState("");
  const [postMedia, setPostMedia] = React.useState([]); // array of media objects from upload

  // Add new post handler with authentication check
  const handlePost = async () => {
    console.log('🚀 handlePost called');
    console.log('🔐 isAuthenticated:', isAuthenticated);
    console.log('👤 user:', user);
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to auth');
      alert('Please login to create a post');
      navigate('/auth');
      return;
    }

    console.log('📝 Post content:', newPost);
    console.log('📎 Post media:', postMedia);
    
    if (!newPost.trim() && postMedia.length === 0) {
      console.log('❌ No content or media, returning');
      return;
    }
    
    console.log('📤 Creating post with:', { 
      content: newPost, 
      mediaCount: postMedia.length, 
      media: postMedia,
      isAuthenticated,
      user: user?._id 
    });
    
    try {
      // Create post via backend API with media
      const response = await axios.post('http://localhost:3001/api/posts', {
        content: newPost,
        media: postMedia // Send uploaded media array
      }, { withCredentials: true });

      // Add the new post to the beginning of the posts array
      setPosts(prev => [response.data, ...prev]);
      
      // Clear the form
      setNewPost("");
      setPostMedia([]);
      
      console.log('✅ Post created successfully:', response.data);
    } catch (error) {
      console.error('❌ Failed to create post:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        console.log('❌ 401 Unauthorized - redirecting to auth');
        alert('Please login to create a post');
        navigate('/auth');
      } else if (error.response?.status === 400) {
        console.log('❌ 400 Bad Request:', error.response.data?.error);
        alert(`Failed to create post: ${error.response.data?.error || 'Invalid request'}`);
      } else {
        console.log('❌ Other error:', error.message);
        alert(`Failed to create post: ${error.response?.data?.error || error.message || 'Please try again.'}`);
      }
    }
  };

  // Edit post functionality
  const [editingPost, setEditingPost] = React.useState(null);
  const [editPostContent, setEditPostContent] = React.useState('');

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditPostContent(post.content);
  };

  const handleSaveEdit = async () => {
    if (!editPostContent.trim()) return;
    
    try {
      // Send PUT request to backend to update post
      const response = await axios.put(
        `http://localhost:3001/api/posts/${editingPost._id}`,
        { content: editPostContent },
        { withCredentials: true }
      );
      
      // Update post in local state with backend response
      setPosts(prev => prev.map(post => 
        post._id === editingPost._id 
          ? { ...post, ...response.data }
          : post
      ));
      setEditingPost(null);
      setEditPostContent('');
      console.log('Post updated successfully');
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditPostContent('');
  };

  // For media modal
  const [mediaModal, setMediaModal] = React.useState({ open: false, type: null, src: null });

  // Event scheduler modal state
  const [showEventModal, setShowEventModal] = React.useState(false);
  const [eventData, setEventData] = React.useState({ title: '', date: '', time: '', ampm: 'AM', location: '', description: '' });
  const [myEvents, setMyEvents] = React.useState([]);

  // Helper function to get file icon based on file type
const getFileIcon = (fileName, fileType) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (fileType === 'document' || extension) {
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      case 'txt':
        return '📄';
      case 'zip':
      case 'rar':
        return '🗜️';
      default:
        return '📎';
    }
  }
  return '📎';
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

  // Post a new comment to backend and refresh comments
  const handlePostComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    try {
      console.log('Posting comment:', { postId, text });
      const response = await axios.post(`http://localhost:3001/api/posts/${postId}/comments`, { text }, { withCredentials: true });
      console.log('Comment posted successfully:', response.data);
      setCommentInputs(inputs => ({ ...inputs, [postId]: '' }));
      fetchComments(postId); // Refresh comments from backend
      
      // Update the post's comment count
      setPosts(posts => posts.map(post => 
        (post._id || post.id) === postId 
          ? { ...post, commentCount: (post.commentCount || 0) + 1 }
          : post
      ));
      
      // Mark that user has commented on this post
      setUserCommentedPosts(prev => ({ ...prev, [postId]: true }));
    } catch (e) {
      console.error('Failed to post comment:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      alert(`Failed to post comment: ${e.response?.data?.error || e.message}`);
    }
  };

  console.log("Home component is rendering");
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <Container>
        <Navbar />
        <MainContent>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading...</h2>
          </div>
        </MainContent>
      </Container>
    );
  }

  return (
    <>
      {/* Edit Post Modal */}
      {editingPost && (
        <EditModal>
          <EditModalContent>
            <h3>Edit Post</h3>
            <EditTextarea
              value={editPostContent}
              onChange={(e) => setEditPostContent(e.target.value)}
              placeholder="What's on your mind?"
            />
            <EditActions>
              <EditCancelButton onClick={handleCancelEdit}>Cancel</EditCancelButton>
              <EditSaveButton onClick={handleSaveEdit}>Save</EditSaveButton>
            </EditActions>
          </EditModalContent>
        </EditModal>
      )}
      
      <Container>
        <Navbar />
        <MainContent>
          <LeftSidebar>
            <ProfileCard>
              <CoverImage />
              <ProfileInfo>
                <Avatar src="/ECE_logo/Logo.jpg" alt="Profile" onError={(e) => {e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMzYiIGZpbGw9IiMwYTY2YzIiLz4KPHRleHQgeD0iMzYiIHk9IjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIj5FQ0U8L3RleHQ+Cjwvc3ZnPgo='}} />
                <Name>ECE Student Network</Name>
                <Subtitle>Electronics & Communication Engineering</Subtitle>
              </ProfileInfo>
              <Stats>
                <StatItem>
                  <StatNumber>1,247</StatNumber>
                  <StatLabel>Connections</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>89</StatNumber>
                  <StatLabel>Faculty</StatLabel>
                </StatItem>
              </Stats>
            </ProfileCard>

            <QuickLinks>
              <LinkItem>Recent Activity</LinkItem>
              <LinkItem>Groups</LinkItem>
              <LinkItem>Events</LinkItem>
              <LinkItem>Saved</LinkItem>
            </QuickLinks>
          </LeftSidebar>

          <CenterColumn>
            <>
              <CreatePost>
                <PostHeader>
                  <Avatar 
                    src={user?.avatarUrl || "/ECE_logo/Logo.jpg"} 
                    alt="Profile" 
                    small 
                    onError={(e) => {e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiMwYTY2YzIiLz4KPHRleHQgeD0iMjQiIHk9IjI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIj5FQ0U8L3RleHQ+Cjwvc3ZnPgo='}} 
                  />
                  <PostInput
                    placeholder="Start a post..."
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handlePost();
                      }
                    }}
                  />
                  <ActionButton 
                    style={{ 
                      marginLeft: 8, 
                      background: '#0a66c2', 
                      color: 'white', 
                      fontWeight: 600 
                    }} 
                    onClick={handlePost} 
                    disabled={!newPost.trim() && postMedia.length === 0}
                  >
                    Post
                  </ActionButton>
                </PostHeader>

                {/* Media Upload Component */}
                <div style={{ marginTop: '12px' }}>
                  <MediaUpload
                    onMediaAdd={(media) => {
                      console.log('📎 Media added:', media);
                      setPostMedia(prev => [...prev, media]);
                    }}
                    onMediaRemove={(index) => {
                      console.log('🗑️ Media removed at index:', index);
                      setPostMedia(prev => prev.filter((_, i) => i !== index));
                    }}
                    mediaList={postMedia}
                  />
                </div>
                
                {/* Event Modal */}
                {showEventModal && (
                  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #fafdff 0%, #f3f7fa 100%)',
                        borderRadius: 22,
                        padding: '48px 48px 40px 48px',
                        width: '100%',
                        maxWidth: 500,
                        margin: '0 auto',
                        boxShadow: '0 10px 48px 0 #1a237e22, 0 1.5px 8px #1976d233',
                        position: 'relative',
                        fontFamily: 'inherit',
                        maxHeight: '92vh',
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                        border: '1.5px solid #e3eaf5',
                        transition: 'box-shadow 0.2s',
                        ...(window.innerWidth < 600 ? { padding: '28px 8px 24px 8px', borderRadius: 14 } : {})
                      }}
                    >
                      <button onClick={() => setShowEventModal(false)} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer', fontWeight: 700, lineHeight: 1 }}>×</button>
                      <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 30, fontWeight: 900, letterSpacing: 0.2, color: '#1a237e' }}>Schedule an Event</h2>
                      <div style={{ height: 1, background: '#e3eaf5', margin: '0 0 28px 0' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
                          Title
                          <input type="text" value={eventData.title} onChange={e => setEventData(d => ({ ...d, title: e.target.value }))} placeholder="Event title" style={{ width: '100%', marginTop: 7, padding: '15px 16px', borderRadius: 10, border: '1.5px solid #cfd8dc', fontSize: 18, marginBottom: 0, background: '#fff', boxShadow: '0 1px 2px #e3eaf5' }} />
                        </label>
                        <div style={{ display: 'flex', gap: 22, marginBottom: 2 }}>
                          <label style={{ flex: 1, fontWeight: 700, fontSize: 16 }}>
                            Date
                            <input type="date" value={eventData.date} onChange={e => setEventData(d => ({ ...d, date: e.target.value }))} placeholder="dd-mm-yyyy" style={{ width: '90%', marginTop: 7, padding: '15px 16px', borderRadius: 10, border: '1.5px solid #cfd8dc', fontSize: 18, background: '#fff', boxShadow: '0 1px 2px #e3eaf5' }} />
                          </label>
                          <label style={{ flex: 1.2, fontWeight: 700, fontSize: 16, display: 'flex', flexDirection: 'column', marginLeft: 0 }}>
                            <span style={{ marginBottom: 7 }}>Time</span>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <input type="time" value={eventData.time} onChange={e => setEventData(d => ({ ...d, time: e.target.value }))} placeholder="--:--" style={{ flex: 2, padding: '15px 16px', borderRadius: 10, border: '1.5px solid #cfd8dc', fontSize: 18, background: '#fff', boxShadow: '0 1px 2px #e3eaf5' }} />
                              <select value={eventData.ampm} onChange={e => setEventData(d => ({ ...d, ampm: e.target.value }))} style={{ flex: 1, padding: '12px 8px', borderRadius: 8, border: '1.5px solid #cfd8dc', fontSize: 16, background: '#fff', minWidth: 54, height: 44, marginLeft: 2, boxShadow: '0 1px 2px #e3eaf5' }}>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </label>
                        </div>
                        <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
                          Location
                          <input type="text" value={eventData.location} onChange={e => setEventData(d => ({ ...d, location: e.target.value }))} placeholder="Venue or online link" style={{ width: '100%', marginTop: 7, padding: '15px 16px', borderRadius: 10, border: '1.5px solid #cfd8dc', fontSize: 18, background: '#fff', boxShadow: '0 1px 2px #e3eaf5' }} />
                        </label>
                        <label style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
                          Description
                          <textarea value={eventData.description} onChange={e => setEventData(d => ({ ...d, description: e.target.value }))} placeholder="Event details, agenda, speakers, etc." style={{ width: '100%', marginTop: 7, padding: '15px 16px', borderRadius: 10, border: '1.5px solid #cfd8dc', fontSize: 18, minHeight: 80, background: '#fff', resize: 'vertical', boxShadow: '0 1px 2px #e3eaf5' }} />
                        </label>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 18, marginTop: 18 }}>
                          <button onClick={() => setShowEventModal(false)} style={{ padding: '13px 32px', borderRadius: 10, border: 'none', background: '#f3f6f9', fontWeight: 800, fontSize: 17, color: '#333', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 1px 2px #e3eaf5' }}>Cancel</button>
                          <button
                            onClick={() => {
                              if (!eventData.title || !eventData.date) return;
                              setPosts(posts => [
                                {
                                  id: Date.now(),
                                  author: 'You',
                                  title: 'Event',
                                  time: 'now',
                                  content: eventData.title,
                                  eventInfo: { ...eventData },
                                  image: null,
                                  likes: 0,
                                  comments: 0,
                                  shares: 0
                                },
                                ...posts
                              ]);
                              setEventData({ title: '', date: '', time: '', ampm: 'AM', location: '', description: '' });
                              setShowEventModal(false);
                              alert("This is a local event which can be rsvped by user but does not persist on backend yet. Click 'Attend Event' to RSVP. and see its proposed functionality.");
                            }}
                            style={{ padding: '13px 32px', borderRadius: 10, border: 'none', background: '#1976d2', color: 'white', fontWeight: 900, fontSize: 17, cursor: 'pointer', boxShadow: '0 2px 8px #1976d233', transition: 'background 0.2s' }}
                          >
                            Post Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action buttons for Event */}
                <PostActions>
                  <ActionButton
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, padding: '8px 16px', height: 40 }}
                    onClick={() => setShowEventModal(true)}
                  >
                    <Calendar size={20} style={{ verticalAlign: 'middle' }} />
                    Event
                  </ActionButton>
                </PostActions>
              </CreatePost>

              {posts.map(post => {
                const postId = post._id || post.id; // Use _id for backend posts, id for legacy/mock posts
                return (
                <PostCard key={postId}>
                <PostHeader>
                  <Avatar 
                    src={post.author?.avatarUrl || "/ECE_logo/Logo.jpg"}
                    alt="Profile" 
                    small 
                    onError={(e) => {e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiMwYTY2YzIiLz4KPHRleHQgeD0iMjQiIHk9IjI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIj5FQ0U8L3RleHQ+Cjwvc3ZnPgo='}}
                  />
                  <PostMeta>
                    <AuthorName>{post.author?.name || post.author}</AuthorName>
                    <AuthorTitle>{post.author?.username || 'Student'}</AuthorTitle>
                    <PostTime>{formatTimestamp(new Date(post.createdAt || post.timestamp).getTime())}</PostTime>
                  </PostMeta>
                  {/* Show edit button only for user's own posts */}
                  {isAuthenticated && user && post.author?._id === user._id && (
                    <EditButton onClick={() => handleEditPost(post)}>Edit</EditButton>
                  )}
                </PostHeader>
                {post.eventInfo && (
                  <div style={{ background: '#f5faff', border: '1px solid #b3e5fc', borderRadius: 10, padding: 16, margin: '12px 0' }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                      📅 {post.eventInfo.title}
                    </div>
                    <div style={{ color: '#1976d2', fontWeight: 600, marginBottom: 4 }}>
                      {post.eventInfo.date} {post.eventInfo.time && `at ${post.eventInfo.time} ${post.eventInfo.ampm || ''}`}
                    </div>
                    {post.eventInfo.location && (
                      <div style={{ marginBottom: 4 }}>
                        <b>Location:</b> {post.eventInfo.location}
                      </div>
                    )}
                    {post.eventInfo.description && (
                      <div style={{ marginBottom: 4 }}>
                        <b>About:</b> {post.eventInfo.description}
                      </div>
                    )}
                    <button
                      style={{ marginTop: 8, padding: '7px 18px', borderRadius: 6, background: '#1976d2', color: 'white', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
                      onClick={() => {
                        // Only add if not already attending
                        setMyEvents(evts => {
                          if (evts.some(e => e.title === post.eventInfo.title && e.date === post.eventInfo.date && e.time === post.eventInfo.time)) return evts;
                          return [...evts, post.eventInfo];
                        });
                        // Optionally, show a toast/alert
                        alert('You have RSVP’d to this event!');
                      }}
                      disabled={myEvents.some(e => e.title === post.eventInfo.title && e.date === post.eventInfo.date && e.time === post.eventInfo.time)}
                    >
                      {myEvents.some(e => e.title === post.eventInfo.title && e.date === post.eventInfo.date && e.time === post.eventInfo.time) ? 'Attending' : 'Attend Event'}
                    </button>
                  </div>
                )}
                <PostContent>{post.content}</PostContent>
                {/* Media display */}
                {console.log('🖼️ Post media check:', post._id, post.media?.length || 0, post.media)}
                {post.media && post.media.length > 0 && (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0' }}>
    {post.media.map((media, idx) => {
      if (media.type === 'image') {
        return (
          <img
            key={`media-${idx}`}
            src={media.url}
            alt={media.originalName || `Media ${idx+1}`}
            style={{ 
              width: 90, 
              height: 90, 
              objectFit: 'cover', 
              borderRadius: 8, 
              border: '1px solid #e0e0e0', 
              cursor: 'pointer' 
            }}
            onClick={() => setMediaModal({ open: true, type: 'image', src: media.url })}
          />
        );
      } else if (media.type === 'video') {
        return (
          <div 
            key={`media-${idx}`} 
            style={{ 
              width: 90, 
              height: 90, 
              position: 'relative', 
              borderRadius: 8, 
              overflow: 'hidden', 
              border: '1px solid #e0e0e0', 
              cursor: 'pointer', 
              background: '#000' 
            }} 
            onClick={() => setMediaModal({ open: true, type: 'video', src: media.url })}
          >
            <video 
              src={media.url} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                pointerEvents: 'none' 
              }} 
              muted 
            />
            <span style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%,-50%)', 
              color: 'white', 
              fontSize: 28, 
              background: 'rgba(0,0,0,0.4)', 
              borderRadius: '50%', 
              padding: 6 
            }}>▶</span>
          </div>
        );
      } else if (media.type === 'document') {
        return (
          <div 
            key={`media-${idx}`}
            style={{ 
              width: 140, 
              minHeight: 100, 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
              borderRadius: 8, 
              border: '2px solid #dee2e6', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 8px',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => {
              // Handle PDF viewing vs downloading based on file type
              const fileExtension = media.originalName?.split('.').pop()?.toLowerCase();
              
              if (fileExtension === 'pdf') {
                // For PDFs, open in a modal or new tab with proper PDF viewer
                let viewUrl = media.url;
                
                console.log('📄 Opening PDF:', viewUrl);
                console.log('📄 Original URL:', media.url);
                
                // Create a PDF viewer modal or open in new tab
                setMediaModal({ 
                  open: true, 
                  type: 'pdf', 
                  src: viewUrl,
                  title: media.originalName 
                });
              } else {
                // For other documents, download them
                const link = document.createElement('a');
                link.href = media.url;
                link.download = media.originalName || 'download';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {/* File Icon */}
            <span style={{ 
              fontSize: 32, 
              marginBottom: 6,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              {getFileIcon(media.originalName, media.type)}
            </span>
            
            {/* File Name */}
            <span style={{ 
              fontSize: 11, 
              textAlign: 'center', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap', 
              width: '100%',
              fontWeight: 600,
              color: '#495057',
              marginBottom: 2
            }}>
              {media.originalName || 'Document'}
            </span>
            
            {/* File Size */}
            {media.size && (
              <span style={{ 
                fontSize: 10, 
                color: '#6c757d',
                fontWeight: 500
              }}>
                {formatFileSize(media.size)}
              </span>
            )}
            
            {/* Download indicator */}
            <span style={{ 
              position: 'absolute',
              top: 4,
              right: 4,
              fontSize: 12,
              color: '#28a745',
              background: 'rgba(40, 167, 69, 0.1)',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              ⬇
            </span>
          </div>
        );
      }
      return null;
    })}
  </div>
)}
      {/* Media Modal */}
      {mediaModal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setMediaModal({ open: false, type: null, src: null })}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', background: 'transparent' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'relative' }}>
              {mediaModal.type === 'image' ? (
                <img src={mediaModal.src} alt="Expanded" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 4px 32px #0008' }} />
              ) : mediaModal.type === 'video' ? (
                <video src={mediaModal.src} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 4px 32px #0008', background: '#000' }} />
              ) : mediaModal.type === 'pdf' ? (
                <div style={{ width: '90vw', height: '90vh', background: 'white', borderRadius: 12, boxShadow: '0 4px 32px #0008', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '12px 16px', background: '#f5f5f5', borderRadius: '12px 12px 0 0', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>{mediaModal.title || 'PDF Document'}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => window.open(mediaModal.src, '_blank')}
                        style={{ padding: '4px 8px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, fontSize: '12px', cursor: 'pointer' }}
                      >
                        Open in New Tab
                      </button>
                      <a 
                        href={mediaModal.src} 
                        download={mediaModal.title || 'document.pdf'}
                        style={{ padding: '4px 8px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: '12px' }}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  {/* Enhanced PDF viewing approach */}
                  <div style={{ width: '100%', height: 'calc(100% - 60px)', position: 'relative' }}>
                    {/* Debug URL display */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '5px', 
                      left: '5px', 
                      background: 'rgba(0,0,0,0.8)', 
                      color: 'white', 
                      padding: '4px 8px', 
                      fontSize: '10px', 
                      borderRadius: '3px', 
                      zIndex: 1000,
                      maxWidth: '90%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {mediaModal.src}
                    </div>
                    {/* Primary PDF viewer */}
                    <iframe 
                      src={mediaModal.src}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        border: 'none', 
                        borderRadius: '0 0 12px 12px',
                        display: 'block'
                      }}
                      title="PDF Viewer"
                      onLoad={(e) => {
                        console.log('Direct PDF iframe loaded');
                        setTimeout(() => {
                          // Check if the iframe content is loading properly
                          try {
                            const iframeDoc = e.target.contentDocument || e.target.contentWindow.document;
                            if (iframeDoc.body && iframeDoc.body.innerHTML.includes('error') || iframeDoc.body.innerHTML === '') {
                              console.log('Direct PDF failed, showing fallback options');
                              e.target.style.display = 'none';
                              const fallback = e.target.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }
                          } catch (err) {
                            // Cross-origin, assume it's working if no error
                            console.log('Cross-origin iframe (likely working)');
                          }
                        }, 2000);
                      }}
                      onError={(e) => {
                        console.error('Direct PDF iframe error, showing fallback');
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    {/* Fallback viewer options */}
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'none', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                      borderRadius: '0 0 12px 12px',
                      textAlign: 'center',
                      padding: '40px 20px'
                    }}>
                      <div style={{ marginBottom: '30px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
                        <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '20px' }}>PDF Document</h3>
                        <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                          Unable to display PDF inline. Choose an option below:
                        </p>
                      </div>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                        gap: '12px', 
                        width: '100%',
                        maxWidth: '500px'
                      }}>
                        <button 
                          onClick={() => {
                            console.log('Opening PDF directly:', mediaModal.src);
                            window.open(mediaModal.src, '_blank');
                          }}
                          style={{ 
                            padding: '12px 16px', 
                            background: 'linear-gradient(135deg, #007bff, #0056b3)', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '14px', 
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(0,123,255,0.3)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>📖</span>
                          Open PDF
                        </button>
                        <button 
                          onClick={() => {
                            const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(mediaModal.src)}`;
                            console.log('Opening Google Viewer:', googleUrl);
                            window.open(googleUrl, '_blank');
                          }}
                          style={{ 
                            padding: '12px 16px', 
                            background: 'linear-gradient(135deg, #4285f4, #3367d6)', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '8px', 
                            fontSize: '14px', 
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(66,133,244,0.3)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>🔍</span>
                          Google Viewer
                        </button>
                        <a 
                          href={mediaModal.src} 
                          download={mediaModal.title || 'document.pdf'}
                          style={{ 
                            padding: '12px 16px', 
                            background: 'linear-gradient(135deg, #28a745, #1e7e34)', 
                            color: 'white', 
                            textDecoration: 'none', 
                            borderRadius: '8px', 
                            fontSize: '14px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(40,167,69,0.3)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>💾</span>
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              <button onClick={() => setMediaModal({ open: false, type: null, src: null })} style={{ position: 'absolute', top: -18, right: -18, background: '#e53935', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #0008' }}>×</button>
            </div>
          </div>
        </div>
      )}
                <PostStats>
                  <StatText>{post.likes} likes • {post.commentCount || 0} comments</StatText>
                </PostStats>
                {/* No separate Show Comments button; handled by Comment/Commented button below */}
                {/* Comments Section (only if open) */}
                {openComments[postId] && (
                  <div style={{ background: 'linear-gradient(135deg, #f7fafd 60%, #e3f0ff 100%)', borderRadius: 12, margin: '12px 0', padding: 18, boxShadow: '0 2px 8px 0 #e3eaf5' }}>
                    <div style={{ marginBottom: 14, fontWeight: 700, fontSize: 18, color: '#1976d2', letterSpacing: 0.5, display: 'flex', alignItems: 'center' }}>
                      <span className="material-icons" style={{ fontSize: 22, marginRight: 6, color: '#1976d2' }}>chat_bubble_outline</span>
                      Comments
                    </div>
                    <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 10 }}>
                      {(comments[postId] || []).map((c, idx) => (
                        <div key={c._id || c.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px #e3eaf5', padding: '8px 12px' }}>
                          <img src={c.author?.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'} alt={c.author?.name || 'User'} style={{ marginRight: 10, width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e3f0ff' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#1976d2', marginBottom: 2 }}>{c.author?.name || 'User'}</div>
                            {c.editing ? (
                              <>
                                <input
                                  value={c.content}
                                  onChange={e => {
                                    setComments(prev => ({
                                      ...prev,
                                      [postId]: prev[postId].map((com, i) => i === idx ? { ...com, content: e.target.value } : com)
                                    }));
                                  }}
                                  style={{ width: '100%', marginRight: 6, borderRadius: 4, border: '1px solid #b3c6e0', padding: 6, fontSize: 15 }}
                                />
                                <button onClick={() => {
                                  setComments(prev => ({
                                    ...prev,
                                    [postId]: prev[postId].map((com, i) => i === idx ? { ...com, editing: false } : com)
                                  }));
                                }} style={{ marginRight: 4, background: '#e3f0ff', border: 'none', borderRadius: 4, padding: '4px 10px', color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                              </>
                            ) : (
                              <span style={{ fontSize: 15, color: '#222', fontWeight: 500 }}>{c.content}</span>
                            )}
                          </div>
                          {/* Only allow editing and deleting if user is current user */}
                          {c.author?._id === user?._id && !c.editing && (
                            <>
                              <button onClick={() => {
                                setComments(prev => ({
                                  ...prev,
                                  [postId]: prev[postId].map((com, i) => i === idx ? { ...com, editing: true } : com)
                                }));
                              }} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#1976d2', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                              <button onClick={() => {
                                setComments(prev => ({
                                  ...prev,
                                  [postId]: prev[postId].filter((_, i) => i !== idx)
                                }));
                              }} style={{ marginLeft: 4, background: 'none', border: 'none', color: '#e53935', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', marginTop: 8, alignItems: 'center' }}>
                      <input
                        value={commentInputs[postId] || ''}
                        onChange={e => setCommentInputs(inputs => ({ ...inputs, [postId]: e.target.value }))}
                        placeholder="Write a comment..."
                        style={{ flex: 1, borderRadius: 6, border: '1px solid #b3c6e0', padding: 8, fontSize: 15, background: '#fafdff' }}
                        onKeyDown={async e => {
                          if (e.key === 'Enter' && commentInputs[postId]?.trim()) {
                            await handlePostComment(postId);
                          }
                        }}
                      />
                      <button
                        onClick={async () => {
                          if (commentInputs[postId]?.trim()) {
                            await handlePostComment(postId);
                          }
                        }}
                        style={{ marginLeft: 10, borderRadius: 6, background: '#1976d2', color: 'white', border: 'none', padding: '7px 18px', fontWeight: 700, fontSize: 15, boxShadow: '0 1px 3px #e3eaf5', cursor: 'pointer', letterSpacing: 0.5 }}
                      >Post</button>
                    </div>
                  </div>
                )}
                <PostActions>
                  <ActionButton 
                    key={`like-${postId}-${likedPosts[postId] || false}`}
                    onClick={() => {
                      const currentPostId = postId;
                      console.log('🎯 Like button clicked for post:', currentPostId);
                      console.log('🎯 Current likedPosts state:', likedPosts);
                      console.log('🎯 Is post liked?', likedPosts[currentPostId]);
                      handleLike(currentPostId);
                    }}>
                    <span className="material-icons" style={{
                      color: likedPosts[postId] ? '#1976d2' : '#757575',
                      fontWeight: likedPosts[postId] ? 700 : 400,
                      fontSize: 22,
                      marginRight: 8,
                      verticalAlign: 'middle',
                      transition: 'color 0.2s'
                    }}>
                      {likedPosts[postId] ? 'thumb_up' : 'thumb_up_off_alt'}
                    </span>
                    <span style={{
                      fontWeight: likedPosts[postId] ? 700 : 400,
                      color: likedPosts[postId] ? '#1976d2' : undefined,
                      verticalAlign: 'middle',
                      transition: 'color 0.2s'
                    }}>
                      {likedPosts[postId] ? 'Liked' : 'Like'}
                    </span>
                  </ActionButton>

                <ActionButton
                  style={(() => {
                    const hasUserCommented = userCommentedPosts[postId] || (comments[postId] || []).some(c => c.author?._id === user?._id);
                    return {
                      background: openComments[postId] ? '#1976d2' : (hasUserCommented ? '#1976d2' : ''),
                      color: openComments[postId] ? 'white' : (hasUserCommented ? 'white' : ''),
                      fontWeight: hasUserCommented || openComments[postId] ? 700 : 400
                    };
                  })()}
                  onClick={() => {
                    setOpenComments(prev => {
                      const isOpening = !prev[postId];
                      if (isOpening && !comments[postId]) {
                        fetchComments(postId);
                      }
                      return { ...prev, [postId]: isOpening };
                    });
                  }}
                >
                  <MessageSquare size={20} />
                  {openComments[postId]
                    ? 'Hide Comments'
                    : (userCommentedPosts[postId] || (comments[postId] || []).some(c => c.author?._id === user?._id))
                      ? 'Commented'
                      : 'Comment'}
                </ActionButton>
                <ActionButton onClick={() => showNotification('Share functionality to be implemented soon!')}>
                  <Share size={20} />
                  Share
                </ActionButton>
                <ActionButton onClick={() => showNotification('Send functionality to be implemented soon!')}>
                  <Send size={20} />
                  Send
                </ActionButton>
                </PostActions>
              </PostCard>
              );
              })}
            </>
          </CenterColumn>

          <RightSidebar>
            {myEvents.length > 0 && (
              <NewsCard style={{ marginBottom: 18, border: '2px solid #1976d2', background: '#e3f2fd' }}>
                <NewsHeader style={{ color: '#1976d2' }}>Your Upcoming Events</NewsHeader>
                {myEvents.map((evt, idx) => (
                  <NewsItem key={idx} style={{ fontWeight: 600, color: '#0d47a1' }}>
                    <NewsDot style={{ background: '#1976d2' }} />
                    {evt.title} <span style={{ color: '#1976d2', fontWeight: 400, marginLeft: 4 }}>{evt.date} {evt.time} {evt.ampm}</span>
                  </NewsItem>
                ))}
              </NewsCard>
            )}
            <NewsCard>
              <NewsHeader>ECE News</NewsHeader>
              <NewsItem>
                <NewsDot />
                New research lab inaugurated
                <NewsTime>2d ago</NewsTime>
              </NewsItem>
              <NewsItem>
                <NewsDot />
                Student wins national competition
                <NewsTime>3d ago</NewsTime>
              </NewsItem>
              <NewsItem>
                <NewsDot />
                Faculty published in IEEE
                <NewsTime>1w ago</NewsTime>
              </NewsItem>
            </NewsCard>
          </RightSidebar>
        </MainContent>
        
        {/* Notification Component */}
        {notification && (
          <Notification>
            {notification}
          </Notification>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: #f3f2ef;
`;

const MainContent = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding-top: 72px;
  display: grid;
  grid-template-columns: 225px 1fr 300px;
  gap: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
`;

const LeftSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const CoverImage = styled.div`
  height: 54px;
  background: linear-gradient(135deg, #0a66c2 0%, #004182 100%);
`;

const ProfileInfo = styled.div`
  padding: 12px;
  text-align: center;
  margin-top: -24px;
`;

const Avatar = styled.img`
  width: ${props => props.small ? '48px' : '72px'};
  height: ${props => props.small ? '48px' : '72px'};
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
`;

const Name = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 4px 0;
  color: #000;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #666;
  margin: 0;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  margin-top: 12px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0a66c2;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const QuickLinks = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 12px 0;
`;

const LinkItem = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    background: #f3f2ef;
    color: #000;
  }
`;

const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CreatePost = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const PostInput = styled.input`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 35px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #0a66c2;
  }
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  
  &:hover {
    background: #f3f2ef;
  }
`;

const PostCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const PostMeta = styled.div`
  flex: 1;
`;

const AuthorName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const AuthorTitle = styled.div`
  font-size: 12px;
  color: #666;
`;

const PostTime = styled.div`
  font-size: 12px;
  color: #666;
`;

const PostContent = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #000;
  margin: 12px 0;
`;

const PostStats = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
`;

const StatText = styled.span`
  font-size: 12px;
  color: #666;
`;

const RightSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NewsCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
`;

const NewsHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #000;
`;

const NewsItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 13px;
  color: #000;
  position: relative;
`;

const NewsDot = styled.div`
  width: 4px;
  height: 4px;
  background: #666;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
`;

const NewsTime = styled.span`
  color: #666;
  margin-left: auto;
  font-size: 12px;
`;

const EditButton = styled.button`
  background: #f0f2f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  margin-left: auto;
  
  &:hover {
    background: #e4e6ea;
  }
`;

const EditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const EditModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 15px;
`;

const EditActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const EditSaveButton = styled.button`
  background: #1877f2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    background: #166fe5;
  }
`;

const EditCancelButton = styled.button`
  background: #e4e6ea;
  color: #1c1e21;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  
  &:hover {
    background: #d8dadf;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #1976d2;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  font-weight: 500;
  font-size: 14px;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

export default Home;
