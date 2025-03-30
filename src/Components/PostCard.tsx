import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  // Generate gradient from post colors
  const gradientColors = post.colors?.length > 0 
    ? post.colors.map(color => `rgb(${color.join(',')})`).join(', ')
    : '#f1f5f9';

  // Function to determine text color based on background color brightness
  const getTextColor = (rgb: number[]) => {
    // Calculate perceived brightness using the formula for luminance
    // 0.299*R + 0.587*G + 0.114*B
    const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return brightness > 0.7 ? 'text-gray-900' : 'text-white';
  };

  return (
    <div 
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer group
        bg-white backdrop-blur-sm rounded-xl hover:scale-[1.02] cyber-border
        ${post.isFeatured ? 'shadow-[0_0_15px_rgba(192,38,211,0.3)]' : 'shadow-md hover:shadow-lg'}
      `}
      onClick={onClick}
    >
      {/* Top corner circuits */}
      <div className="absolute w-12 h-12 -top-5 -right-5 circuit-pulse">
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-[1px] h-full bg-cyan-500"></div>
      </div>
      
      {/* Gradient overlay */}
      <div 
        className="w-full h-48 transition-all relative"
        style={{
          background: post.colors?.length > 0
            ? `linear-gradient(45deg, ${gradientColors})`
            : 'linear-gradient(45deg, #f8fafc, #e2e8f0)'
        }}
      >
        {post.colors?.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm opacity-70">No Colors</span>
            </div>
          </div>
        )}
        
        {/* Featured badge */}
        {post.isFeatured && (
          <div className="absolute top-3 right-3 bg-white/90 text-fuchsia-600 py-1 px-3 text-xs rounded-full border border-fuchsia-200 font-medium shadow-[0_0_8px_rgba(192,38,211,0.2)]">
            Featured
          </div>
        )}

        {/* Subtle scanner line animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-30 absolute top-0 animate-[scanner_4s_ease-in-out_infinite]"></div>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 bg-white">
        <h3 className="font-medium text-lg mb-2 truncate text-gray-800">{post.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-3">
            {post.colors && post.colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className={`
                  w-7 h-7 rounded-full border-2 border-white 
                  transition-transform group-hover:translate-y-[-4px] hover:z-10
                  ${index === 0 ? 'group-hover:rotate-[-12deg]' : ''}
                  ${index === 1 ? 'group-hover:rotate-[-6deg]' : ''}
                  ${index === 2 ? 'group-hover:rotate-[0deg]' : ''}
                  ${index === 3 ? 'group-hover:rotate-[6deg]' : ''}
                  ${index === 4 ? 'group-hover:rotate-[12deg]' : ''}
                  shadow-sm hover:shadow-[0_0_6px_rgba(6,182,212,0.3)]
                `}
                style={{ 
                  backgroundColor: `rgb(${color.join(',')})`,
                  transitionDelay: `${index * 50}ms`
                }}
              >
                <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 ${getTextColor(color)}`}>
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
          <span className="text-xs text-cyan-600">
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
      
      {/* Bottom corner circuits */}
      <div className="absolute w-14 h-14 -bottom-7 -left-7 circuit-pulse">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500"></div>
        <div className="absolute top-0 left-0 w-[1px] h-full bg-cyan-500"></div>
      </div>
    </div>
  );
}