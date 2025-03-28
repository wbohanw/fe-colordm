import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  return (
    <div className={`post-card ${post.isFeatured ? 'featured' : ''}`} onClick={onClick}>
      {post.isFeatured && <div className="featured-badge">Featured</div>}
      {post.image_url ? (
        <img src={post.image_url} alt={post.title} className="post-thumbnail" />
      ) : (
        <div className="post-thumbnail placeholder">No Image</div>
      )}
      <div className="post-content">
        <h3>{post.title}</h3>
        {post.colors && post.colors.length > 0 && (
          <div className="color-preview">
            {post.colors.map((color, index) => (
              <div
                key={index}
                className="color-dot"
                style={{ backgroundColor: `rgb(${color.join(',')})` }}
              />
            ))}
          </div>
        )}
        <div className="post-meta">
          <span>By {post.author}</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}