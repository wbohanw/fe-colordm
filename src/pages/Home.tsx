import { usePosts } from '../hooks/usePosts';
import PostGallery from '../Components/PostGallery';

export default function Home() {
  const { regularPosts, featuredPosts, loading, error } = usePosts();

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 border-4 border-yellow-400 border-l-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500">Loading posts...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
      <h2 className="text-red-500 text-xl mb-2">Error</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto mb-16">
        <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold text-gray-600 mb-4">
          COLOR GALLERY
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Discover color inspiration
        </h1>
        <p className="text-xl text-gray-500">
          Browse our curated collection of color palettes from the community
        </p>
      </div>
      
      {/* Featured Posts Gallery */}
      <PostGallery
        title="Featured Inspiration"
        posts={featuredPosts}
        emptyMessage="No featured posts yet. Be the first to have your post featured!"
        className="featured-gallery"
      />
      
      {/* Regular Posts Gallery */}
      <PostGallery
        title="Community Gallery"
        posts={regularPosts}
        emptyMessage="No posts yet. Be the first to share your color inspiration!"
        className="regular-gallery"
      />
    </div>
  );
}