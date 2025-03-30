import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Login from './pages/login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import MainColor from './pages/MainColor';
import Playground from './pages/Playground';
import Settings from './pages/Settings';
import { AuthProvider } from './pages/AuthContext';
import Navbar from './Components/Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800">
          <Navbar />
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full box-border">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-cyan-100 shadow-[0_0_20px_rgba(0,180,216,0.1)]">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/main-color" element={<MainColor />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
          <footer className="py-4 px-8 text-center text-gray-500 text-sm border-t border-gray-200 bg-white/80">
            <p>© {new Date().getFullYear()} ColorDorm • A modern color exploration platform</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;