import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from './Navbar';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/api/posts`, { withCredentials: true })
      .then(res => {
        const found = res.data.find(p => String(p._id) === String(id));
        setPost(found);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch post.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !post) {
    return (
      <>
        <Navbar />
        <Container>
          <h2>Post not found</h2>
          <Link to="/profile">Back to Profile</Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <Card>
          <h2 style={{ marginBottom: 8 }}>{post.title === 'Event' ? '📅 ' : ''}{post.content}</h2>
          {post.eventInfo && (
            <div style={{ color: '#1976d2', fontWeight: 500, fontSize: 15, marginBottom: 8 }}>
              {post.eventInfo.date} {post.eventInfo.time} {post.eventInfo.ampm} {post.eventInfo.location && `| ${post.eventInfo.location}`}
            </div>
          )}
          {post.images && post.images.length > 0 && (
            <div style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt="img" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e0e0e0' }} />
              ))}
            </div>
          )}
          {post.videos && post.videos.length > 0 && (
            <div style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
              {post.videos.map((vid, idx) => (
                <video key={idx} src={vid} style={{ width: 120, height: 100, borderRadius: 8, background: '#000' }} controls />
              ))}
            </div>
          )}
          <Link to="/profile" style={{ display: 'inline-block', marginTop: 18, color: '#1976d2', fontWeight: 600 }}>Back to Profile</Link>
        </Card>
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
`;
const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px #e3eaf5;
  padding: 32px 28px 24px 28px;
`;

export default PostPage;
