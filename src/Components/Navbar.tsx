import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreatePost = () => {
    navigate('/create');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={handleHomeClick}>
        <h1>ColorDorm</h1>
      </div>
      
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <button onClick={handleCreatePost} className="create-post-button">
              Create Post
            </button>
            <div className="user-info">
              <span className="username">
                {user?.username || user?.email || 'User'}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={handleLogin} className="login-button">
              Login
            </button>
            <button onClick={handleSignup} className="signup-button">
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
} 