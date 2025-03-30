import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../Components/PostForm';
import { useAuth } from './AuthContext';

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
    return <div className="max-w-3xl mx-auto p-8">Please log in to create a post</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Share Your Color Inspiration</h2>
      
      <div className="flex justify-center mb-6 gap-4">
        <button 
          className={`py-3 px-6 rounded-md font-semibold transition-all ${
            postType === 'regular' 
              ? 'bg-white border-2 border-blue-500 text-blue-500' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => handlePostTypeChange('regular')}
        >
          Regular Post
        </button>
        <button 
          className={`py-3 px-6 rounded-md font-semibold transition-all ${
            postType === 'featured' 
              ? 'bg-white border-2 border-blue-500 text-blue-500' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => handlePostTypeChange('featured')}
        >
          Featured Post
        </button>
      </div>
      
      <div className="text-center mb-8 italic text-gray-600 p-2 bg-gray-50 rounded-md">
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