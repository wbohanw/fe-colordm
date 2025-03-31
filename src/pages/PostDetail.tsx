import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ColorPalette from '../Components/ColorPalette';
import { Post } from '../types';

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
          image_url: postData.image_url || '',
          colors: postData.colors || [],
          css: postData.css || '',
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

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-yellow-400 border-l-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <div className="inline-block p-2 rounded-full bg-red-100 text-red-500 mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Error</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button 
        onClick={() => navigate('/')} 
        className="px-5 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
  
  if (!post) return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <div className="inline-block p-2 rounded-full bg-red-100 text-red-500 mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
      <button 
        onClick={() => navigate('/')} 
        className="px-5 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to gallery
        </button>
      </div>
      
      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {post.colors && post.colors.length > 0 && (
          <div 
            className="h-48 w-full"
            style={{
              background: `linear-gradient(to right, ${post.colors.map(color => `rgb(${color.join(',')})`).join(', ')})`
            }}
          />
        )}
        
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>By {post.author}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.created_at}>{new Date(post.created_at).toLocaleDateString()}</time>
          </div>
          
          {post.description && (
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">{post.description}</p>
            </div>
          )}
          
          {post.image_url && (
            <div className="mb-8">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="rounded-lg w-full max-h-[500px] object-cover" 
              />
            </div>
          )}
          
          {post.colors && post.colors.length > 0 && (
            <ColorPalette 
              colors={post.colors} 
              cssCode={post.css} 
            />
          )}
        </div>
      </article>
    </div>
  );
}