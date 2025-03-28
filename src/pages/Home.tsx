import { usePosts } from '../hooks/usePosts';
import PostGallery from '../Components/PostGallery';
import './Home.css';

export default function Home() {
  const { regularPosts, featuredPosts, loading, error } = usePosts();

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading posts...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <h2>Error</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="home-page">
      <div className="header">
        <h1>Color Inspiration Gallery</h1>
      </div>
      
      {/* Featured Posts Gallery */}
      <PostGallery
        title="Featured Color Inspiration"
        posts={featuredPosts}
        emptyMessage="No featured posts yet. Be the first to have your post featured!"
        className="featured-gallery"
      />
      
      {/* Regular Posts Gallery */}
      <PostGallery
        title="Community Color Posts"
        posts={regularPosts}
        emptyMessage="No posts yet. Be the first to share your color inspiration!"
        className="regular-gallery"
      />
    </div>
  );
}