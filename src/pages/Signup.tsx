import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Registering user:', { username, email, password });
      
      // Create a new user
      const registerResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const registerData = await registerResponse.json();
      console.log('Registration response:', registerData);
      
      if (!registerResponse.ok) {
        throw new Error(registerData.error || 'Registration failed');
      }

      // After successful registration, login with username
      // We could use either username or email now that we've updated the backend
      const loginResponse = await fetch(`/api/users/${encodeURIComponent(username)}?password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!loginResponse.ok) {
        const loginError = await loginResponse.json();
        throw new Error(loginError.error || 'Login after registration failed');
      }
      
      const userData = await loginResponse.json();
      console.log('Login response:', userData);
      
      login({ 
        email: userData.email,
        username: userData.username,
        id: userData._id,
        token: userData._id // Using user ID as token for now
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Create your account</h2>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full p-3 bg-yellow-400 text-gray-900 font-semibold rounded-md hover:bg-yellow-500 transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </div>
      
      <p className="mt-6 text-center text-gray-500">
        Already have an account?{' '}
        <button 
          onClick={() => navigate('/login')} 
          className="text-yellow-600 hover:underline font-medium cursor-pointer"
        >
          Log In
        </button>
      </p>
    </div>
  );
} 