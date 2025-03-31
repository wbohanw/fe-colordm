import { useState, useEffect } from 'react';
import { Post } from '../types';

interface PostsState {
  regularPosts: Post[];
  featuredPosts: Post[];
  allPosts: Post[];
}

// Changed to named export
export function usePosts() {
  const [posts, setPosts] = useState<PostsState>({
    regularPosts: [],
    featuredPosts: [],
    allPosts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch regular posts
        const regularResponse = await fetch('/api/posts/regular');
        if (!regularResponse.ok) {
          throw new Error('Failed to fetch regular posts');
        }
        const regularData = await regularResponse.json();
        
        // Fetch featured posts
        const featuredResponse = await fetch('/api/posts/featured');
        if (!featuredResponse.ok) {
          throw new Error('Failed to fetch featured posts');
        }
        const featuredData = await regularResponse.ok ? await featuredResponse.json() : [];
        
        // Convert backend post format to our frontend Post format
        const formatPost = (post: any, isFeatured: boolean): Post => ({
          id: post._id,
          title: post.title,
          description: post.content || '',
          image_url: post.image_url || '', 
          colors: post.colors || [],
          css: post.css || '',
          author: post.author || 'Unknown',
          created_at: post.timestamp || new Date().toISOString(),
          likes: post.likes || 0,
          isFeatured: isFeatured
        });
        
        const formattedRegularPosts = regularData.map((post: any) => formatPost(post, false));
        const formattedFeaturedPosts = featuredData.map((post: any) => formatPost(post, true));
        
        // Combine all posts for a unified view if needed
        const allPosts = [...formattedFeaturedPosts, ...formattedRegularPosts];
        
        setPosts({
          regularPosts: formattedRegularPosts,
          featuredPosts: formattedFeaturedPosts,
          allPosts
        });
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { 
    regularPosts: posts.regularPosts, 
    featuredPosts: posts.featuredPosts,
    allPosts: posts.allPosts,
    loading, 
    error 
  };
} 