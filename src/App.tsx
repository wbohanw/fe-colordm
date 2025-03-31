import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Login from './pages/login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import MainColor from './pages/MainColor';
import Playground from './pages/Playground';
import Copilot from './pages/Copilot';
import Settings from './pages/Settings';
import { AuthProvider } from './pages/AuthContext';
import Navbar from './Components/Navbar';

// Layout wrapper component that applies different styling based on route
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isCopilotPage = location.pathname === '/copilot';
  
  return (
    <main className={`flex-1 ${isCopilotPage ? 'p-0 w-full' : 'p-4 md:p-8 max-w-7xl mx-auto w-full'} box-border`}>
      {children}
    </main>
  );
};

// Conditional Navbar component
const ConditionalNavbar: React.FC = () => {
  const location = useLocation();
  const isCopilotPage = location.pathname === '/copilot';
  
  if (isCopilotPage) {
    return null;
  }
  
  return <Navbar />;
};

// Footer component with conditional rendering
const ConditionalFooter: React.FC = () => {
  const location = useLocation();
  const isCopilotPage = location.pathname === '/copilot';
  
  if (isCopilotPage) {
    return null;
  }
  
  return (
    <footer className="py-4 px-8 text-center text-gray-500 text-sm border-t border-gray-200 bg-white/80">
      <p>© {new Date().getFullYear()} ColorDorm • A modern color exploration platform</p>
    </footer>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800">
          <ConditionalNavbar />
          <PageLayout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/main-color" element={<MainColor />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </PageLayout>
          <ConditionalFooter />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;