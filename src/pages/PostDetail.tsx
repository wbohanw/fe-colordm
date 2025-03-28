import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ColorPalette from '../Components/ColorPalette';
import { Post } from '../types';
import './PostDetail.css';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        console.log(`Fetching post with ID: ${id}`);
        const response = await fetch(`/api/posts/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Post not found');
        }
        
        const postData = await response.json();
        console.log('Post data:', postData);
        
        // Convert backend post data to our frontend Post format
        const formattedPost: Post = {
          id: postData._id,
          title: postData.title,
          description: postData.content || '',
          image_url: postData.image_url || '', // Backend may not have this yet
          colors: postData.colors || [], // Backend may not have this yet
          css: postData.css || '', // Backend may not have this yet
          author: postData.author || 'Unknown',
          created_at: postData.timestamp || new Date().toISOString(),
          likes: postData.likes || 0
        };
        
        setPost(formattedPost);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setError('Post ID is missing');
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="post-detail-loading">Loading post...</div>;
  if (error) return (
    <div className="post-detail-error">
      <h2>Error</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
  if (!post) return (
    <div className="post-detail-not-found">
      <h2>Post Not Found</h2>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="post-image" />
      )}
      <p className="post-description">{post.description}</p>
      {post.colors && post.colors.length > 0 && (
        <ColorPalette colors={post.colors} cssCode={post.css} />
      )}
      <div className="post-meta">
        <span>By {post.author}</span>
        <span>Posted on {new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      <button onClick={() => navigate('/')} className="back-button">
        Back to Home
      </button>
    </div>
  );
}