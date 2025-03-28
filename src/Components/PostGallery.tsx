import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';
import { Post } from '../types';
import './PostGallery.css';

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

  return (
    <div className={`post-gallery ${className}`}>
      <h2 className="gallery-title">{title}</h2>
      
      {posts.length === 0 ? (
        <div className="empty-gallery-message">{emptyMessage}</div>
      ) : (
        <div className="post-grid">
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