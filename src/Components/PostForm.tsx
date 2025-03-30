import { useState} from 'react';
import { Post } from '../types';
import { FiAlertTriangle, FiLoader, FiUpload } from 'react-icons/fi';
import { API_URL } from '../utils/api';

interface PostFormProps {
  onCreate: (post: Post) => void;
  postType: 'regular' | 'featured';
  userId: string;
}

// Add color extraction function
const extractColorsFromImage = async (imageUrl: string, colorCount = 10): Promise<number[][]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);

      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap = new Map<string, number>();

      // Sample pixels at intervals
      for (let i = 0; i < imageData.length; i += 16 * 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Get most frequent colors
      const colors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount)
        .map(([key]) => key.split(',').map(Number));

      resolve(colors);
    };
  });
};

export default function PostForm({ onCreate, postType = 'regular', userId }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [colors, setColors] = useState<number[][]>([]);
  const [cssCode, setCssCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);

      try {
        const palette = await extractColorsFromImage(imageUrl);
        setColors(palette);
        
        const gradient = palette.map(color => 
          `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        ).join(', ');
        
        setCssCode(`background: linear-gradient(to right, ${gradient});`);
      } catch (error) {
        console.error('Error extracting colors:', error);
        setColors([]);
        setCssCode('');
      }
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
      setLoading(true);
      const postData = {
        title,
        content: description,
        user_id: userId,
        colors,
        css: cssCode
      };

      const response = await fetch(
        `${API_URL}/api/posts/${postType === 'featured' ? 'featured' : 'regular'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Post creation failed');
      }
      
      const responseData = await response.json();
      
      // Create a Post object from the response
      const newPost: Post = {
        id: responseData.post_id,
        title,
        description: description || '',
        image_url: '', // No image support yet
        colors,
        css: cssCode,
        author: 'You', // Will be set by the server
        created_at: new Date().toISOString(),
        likes: 0,
        isFeatured: postType === 'featured'
      };
      
      onCreate(newPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3">
          <FiAlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium mb-1">Submission Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Title Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input
            id="title"
            type="text"
            placeholder="Enter a descriptive title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                     focus:ring-blue-200 focus:border-blue-500 transition-all
                     placeholder-gray-400 text-gray-900"
          />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            placeholder="Tell us about your color palette (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-4 border border-gray-200 rounded-xl resize-y
                     focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                     placeholder-gray-400 text-gray-900"
          />
          <p className="text-sm text-gray-500">Markdown formatting supported</p>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Image *</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center
                          hover:border-blue-500 transition-colors cursor-pointer
                          group relative">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center
                              group-hover:bg-blue-50 transition-colors">
                  <FiUpload className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    Drag & drop or{" "}
                    <span className="text-blue-600">browse files</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPEG, PNG, WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="relative group">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="rounded-xl border border-gray-200 w-full object-cover h-64" 
              />
              {colors.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-700 mb-2">Extracted Colors</p>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map((color, i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 rounded-full shadow-sm border-2 border-white/50
                                    hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: `rgb(${color.join(',')})` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 font-semibold rounded-xl text-white text-base 
                    transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${postType === 'featured' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-purple/20 hover:shadow-lg' 
                      : 'bg-gray-900 hover:bg-gray-800 shadow-gray/20 hover:shadow-lg'}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <FiLoader className="w-5 h-5 animate-spin" />
              <span className="animate-pulse">Creating Post...</span>
            </div>
          ) : (
            `Publish ${postType === 'featured' ? 'Featured' : 'Community'} Post`
          )}
        </button>
      </div>
    </form>
  );
}