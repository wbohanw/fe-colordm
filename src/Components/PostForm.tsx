import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';

interface PostFormProps {
  onCreate: (post: Post) => void;
  postType: 'regular' | 'featured';
  userId: string;
}

export default function PostForm({ onCreate, postType = 'regular', userId }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!userId) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      // API endpoint based on post type
      const endpoint = postType === 'featured' 
        ? '/api/posts/featured' 
        : '/api/posts/regular';
      
      const postData = {
        title: title,
        content: description || 'No description provided',
        user_id: userId
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Post creation failed');
      }
      
      const responseData = await response.json();
      
      // Create a Post object from the response
      const newPost: Post = {
        id: responseData.post_id,
        title: title,
        description: description || '',
        image_url: '', // No image support yet
        colors: [], // No colors support yet
        css: '', // No CSS support yet
        author: 'You', // Will be set by the server
        created_at: new Date().toISOString(),
        likes: 0,
        isFeatured: postType === 'featured'
      };
      
      onCreate(newPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="image">Image (Coming Soon)</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled // Disabled until we have image upload support
        />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
        <div className="note">
          Note: Image upload is not supported yet.
        </div>
      </div>
      
      <button type="submit" className={postType === 'featured' ? 'featured-submit' : ''}>
        Create {postType === 'featured' ? 'Featured' : 'Regular'} Post
      </button>
    </form>
  );
}