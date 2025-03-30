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
    <div className="max-w-md mx-auto my-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Welcome back</h2>
      
      {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md">{error}</div>}
      
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full p-3 bg-yellow-400 text-gray-900 font-semibold rounded-md hover:bg-yellow-500 transition-colors cursor-pointer"
          >
            Login
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={handleGoogleLogin} 
            className="w-full p-3 border border-gray-300 rounded-md flex justify-center items-center font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-center text-gray-500">
        Don't have an account?{' '}
        <button 
          onClick={() => navigate('/signup')} 
          className="text-yellow-600 hover:underline font-medium cursor-pointer"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}