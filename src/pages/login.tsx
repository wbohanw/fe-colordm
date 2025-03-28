import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Logging in user:', { identifier, password });
      
      // We can use either username or email for login
      const response = await fetch(`/api/users/${encodeURIComponent(identifier)}?password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const userData = await response.json();
      console.log('Login response:', userData);
      
      login({ 
        email: userData.email, 
        username: userData.username,
        id: userData._id,
        token: userData._id // Using user ID as token for now
      });
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    // Note: Google login is not implemented in the backend yet
    setError('Google login is not available yet');
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <div className="login-options">
        <div className="email-login">
          <h3>Login</h3>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          {error && <div className="error">{error}</div>}
        </div>

        <div className="google-login">
          <h3>Continue with Google</h3>
          <button onClick={handleGoogleLogin} className="google-button">
            Sign in with Google
          </button>
        </div>
      </div>
      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')} className="link-button">
          Sign Up
        </button>
      </p>
    </div>
  );
}