import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { FiLogOut, FiSettings, FiEdit, FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/signup');
  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };
  const handleCreatePost = () => navigate('/create');
  const handleHomeClick = () => navigate('/');
  const navigateTo = (path: string) => navigate(path);

  // User initial for avatar
  const getUserInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-50 border-b border-cyan-100 backdrop-blur-sm">
      <div className="cursor-pointer flex items-center gap-3" onClick={handleHomeClick}>
        <div className="relative w-12 h-12">
          {/* Simplified tilted square with color gradients */}
          <div className="absolute inset-0 bg-white rounded-lg shadow-md transform rotate-45 overflow-hidden border-2 border-cyan-100">
            {/* Color quadrants with neon cyber colors */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-cyan-300 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-fuchsia-300 to-violet-400 shadow-[0_0_10px_rgba(192,38,211,0.5)]"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-yellow-300 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-green-300 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            
            {/* Glowing intersecting lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-[1px] bg-white/80 shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
              <div className="w-full h-[1px] bg-white/80 shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
            </div>
          </div>
        </div>
        <h1 className="m-0 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-cyan-600 cyber-text">
          ColorDorm<span className="text-cyan-500 animate-pulse">_</span>
        </h1>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <button 
          onClick={() => navigateTo('/main-color')}
          className="text-gray-700 hover:text-cyan-700 font-medium px-3 py-2 rounded-lg
                    hover:bg-cyan-50 transition-colors duration-200 border border-transparent hover:border-cyan-200 cursor-pointer"
        >
          Main Color
        </button>
        <button 
          onClick={() => navigateTo('/home')}
          className="text-gray-700 hover:text-cyan-700 font-medium px-3 py-2 rounded-lg
                    hover:bg-cyan-50 transition-colors duration-200 border border-transparent hover:border-cyan-200 cursor-pointer"
        >
          Gallery
        </button>
        <button 
          onClick={() => navigateTo('/playground')}
          className="text-gray-700 hover:text-cyan-700 font-medium px-3 py-2 rounded-lg
                    hover:bg-cyan-50 transition-colors duration-200 border border-transparent hover:border-cyan-200 cursor-pointer"
        >
          Playground
        </button>
        {isAuthenticated && (
          <button 
            onClick={handleCreatePost} 
            className="text-fuchsia-600 hover:text-fuchsia-700 font-medium px-3 py-2 rounded-lg
                      hover:bg-fuchsia-50 transition-colors duration-200 flex items-center gap-1 border border-transparent hover:border-fuchsia-200 cursor-pointer"
          >
            <FiEdit className="w-4 h-4" />
            Create Post
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300 cursor-pointer"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                {getUserInitial()}
              </div>
              <span className="hidden md:block font-medium text-gray-700 max-w-[120px] truncate">
                {user?.username || user?.email?.split('@')[0] || 'User'}
              </span>
              <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-cyan-600 truncate">{user?.email}</p>
                </div>
                
                <div className="py-1">
                  <button 
                    onClick={() => navigateTo('/create')}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <FiEdit className="w-4 h-4" />
                    Create Post
                  </button>
                  <button 
                    onClick={() => navigateTo('/settings')}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <FiSettings className="w-4 h-4" />
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-gray-100 py-1">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-fuchsia-600 hover:bg-fuchsia-50 cursor-pointer"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogin} 
              className="py-2 px-4 rounded-lg font-medium border border-cyan-200 text-cyan-600 hover:bg-cyan-50 transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={handleSignup} 
              className="py-2 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
} 