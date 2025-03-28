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
    <div className="auth-page">
      <h2>Sign Up</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} className="link-button">
          Log In
        </button>
      </p>
    </div>
  );
} 