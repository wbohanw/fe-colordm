import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { FiUser, FiLock, FiLink, FiCamera, FiSave, FiAlertTriangle, FiCheck, FiInstagram, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

interface SocialLinks {
  twitter: string;
  instagram: string;
  github: string;
  linkedin: string;
}

export default function Settings() {
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // User profile state
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Social media links
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitter: '',
    instagram: '',
    github: '',
    linkedin: ''
  });
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load user data
  useEffect(() => {
    if (user?.id) {
      // In a real app, we would fetch the user profile data including their social links
      // For now, we'll just use the data from auth context
      setUsername(user.username || '');
      setEmail(user.email || '');
      
      // Mock fetching profile photo and social links
      // In a real implementation, you'd fetch this from your API
    }
  }, [user]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!user?.id) {
      setError('You must be logged in to update your profile');
      return;
    }

    try {
      setLoading(true);
      
      // Profile data to send to API
      const profileData = {
        username,
        id: user.id
      };

      // Handle profile photo upload if present
      let photoUrl = user.photoUrl;
      if (profilePhotoFile) {
        // In a real implementation, you'd upload the file to your server or a service like S3
        // and get back a URL to store in the user profile
        photoUrl = 'mock-photo-url.jpg'; // Mock for now
      }

      // Mock API call - replace with your actual API endpoint
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          photoUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      // Update the user in auth context with new data
      login({
        ...user,
        username,
        photoUrl
      });
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!user?.id) {
      setError('You must be logged in to change your password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      // Mock API call - replace with your actual API endpoint
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }
      
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!user?.id) {
      setError('You must be logged in to update social links');
      return;
    }

    try {
      setLoading(true);
      
      // Mock API call - replace with your actual API endpoint
      const response = await fetch(`/api/users/${user.id}/social`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update social links');
      }
      
      setSuccess('Social links updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update social links');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Account Settings</h1>
      
      {/* Settings Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FiUser />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`pb-4 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'password'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FiLock />
            Password
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`pb-4 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'social'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FiLink />
            Social Links
          </button>
        </div>
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 flex items-start gap-3">
          <FiAlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium mb-1">Error</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 flex items-start gap-3">
          <FiCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium mb-1">Success</h4>
            <p className="text-sm">{success}</p>
          </div>
        </div>
      )}
      
      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={updateProfile}>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="mb-4 text-center">
                  <div className="relative inline-block">
                    <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                      {profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-4xl font-bold">
                          {username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <label 
                      htmlFor="profile-photo" 
                      className="absolute bottom-0 right-0 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50"
                    >
                      <FiCamera className="text-gray-600" />
                    </label>
                    <input 
                      id="profile-photo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleProfilePhotoChange} 
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    JPEG, PNG, GIF (Max 2MB)
                  </p>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username*
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                             focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500">
                    Your email cannot be changed for security reasons
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Password Settings */}
      {activeTab === 'password' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={updatePassword} className="max-w-lg mx-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Password*
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                           focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password*
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                           focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters with numbers and special characters
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password*
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                           focus:ring-blue-200 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiLock className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Social Links Settings */}
      {activeTab === 'social' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={updateSocialLinks}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiTwitter className="text-blue-400" />
                  Twitter
                </label>
                <div className="flex items-center">
                  <span className="bg-gray-50 px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 text-gray-500">
                    twitter.com/
                  </span>
                  <input
                    type="text"
                    value={socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    placeholder="username"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 
                             focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiInstagram className="text-pink-500" />
                  Instagram
                </label>
                <div className="flex items-center">
                  <span className="bg-gray-50 px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 text-gray-500">
                    instagram.com/
                  </span>
                  <input
                    type="text"
                    value={socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    placeholder="username"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 
                             focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiGithub />
                  GitHub
                </label>
                <div className="flex items-center">
                  <span className="bg-gray-50 px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 text-gray-500">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    placeholder="username"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 
                             focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiLinkedin className="text-blue-700" />
                  LinkedIn
                </label>
                <div className="flex items-center">
                  <span className="bg-gray-50 px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 text-gray-500">
                    linkedin.com/in/
                  </span>
                  <input
                    type="text"
                    value={socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    placeholder="username"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 
                             focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-r-transparent rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Save Social Links
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 