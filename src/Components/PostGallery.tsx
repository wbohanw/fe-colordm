import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import { Post } from '../types';

interface PostGalleryProps {
  title: string;
  posts: Post[];
  emptyMessage?: string;
  className?: string;
}

export default function PostGallery({ 
  title, 
  posts, 
  emptyMessage = "No posts to display", 
  className = "" 
}: PostGalleryProps) {
  const navigate = useNavigate();

  const isFeatured = className.includes('featured');

  return (
    <div className={`mb-16 ${className}`}>
      <div className="flex justify-between items-end mb-8">
        <h2 className={`text-2xl font-bold ${isFeatured ? 'text-purple-600' : 'text-gray-800'}`}>
          {title}
        </h2>
        {posts.length > 0 && (
          <button 
            onClick={() => navigate('/home')}
            className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            View all →
          </button>
        )}
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-10 px-4 bg-gray-50 rounded-lg text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => navigate(`/post/${post.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 