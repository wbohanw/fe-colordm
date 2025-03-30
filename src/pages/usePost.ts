import { useState, useEffect } from 'react';
import { Post } from '../types';
import { API_URL } from '../utils/api';

export default function usePost(postId: string | undefined) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError('No post ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/posts/${postId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch post');
        }
        
        const data = await response.json();
        
        // Convert backend post format to frontend Post format
        const formattedPost: Post = {
          id: data._id,
          title: data.title,
          description: data.content || '',
          image_url: data.image_url || '',
          colors: data.colors || [],
          css: data.css || '',
          author: data.author || 'Unknown',
          created_at: data.timestamp || new Date().toISOString(),
          likes: data.likes || 0,
          isFeatured: data.is_featured || false
        };
        
        setPost(formattedPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
}