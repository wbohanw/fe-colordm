import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../Components/PostForm';
import { useAuth } from './AuthContext';
import './CreatePost.css';

export default function CreatePost() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [postType, setPostType] = useState<'regular' | 'featured'>('regular');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handlePostTypeChange = (type: 'regular' | 'featured') => {
    setPostType(type);
  };

  const handlePostCreated = () => {
    navigate('/');
  };

  if (!user) {
    return <div className="create-post-page">Please log in to create a post</div>;
  }

  return (
    <div className="create-post-page">
      <h2>Share Your Color Inspiration</h2>
      
      <div className="post-type-selector">
        <button 
          className={`type-button ${postType === 'regular' ? 'active' : ''}`}
          onClick={() => handlePostTypeChange('regular')}
        >
          Regular Post
        </button>
        <button 
          className={`type-button ${postType === 'featured' ? 'active' : ''}`}
          onClick={() => handlePostTypeChange('featured')}
        >
          Featured Post
        </button>
      </div>
      
      <div className="post-type-description">
        {postType === 'featured' ? (
          <p>Featured posts are highlighted on the home page and receive special styling.</p>
        ) : (
          <p>Regular posts appear in the community section of the home page.</p>
        )}
      </div>
      
      <PostForm 
        postType={postType} 
        onCreate={handlePostCreated} 
        userId={user.id || ''} 
      />
    </div>
  );
}