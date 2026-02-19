import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import LifeScienceQuiz from './modules/LifeScience/LifeScienceQuiz'
import MathQuiz from './modules/Math/MathQuiz'
import AfrikaansQuiz from './modules/Afrikaans/AfrikaansQuiz'
import Sandbox from './modules/Sandbox/Sandbox'
import ProgressDashboard from './modules/Dashboard/ProgressDashboard'
import { Monitor, BookOpen, Calculator, Atom, User, Lock, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import './index.css'
import { UserProvider, useUser } from './context/UserContext'

// Interfaces
interface Module {
  id: string;
  name: string;
  icon?: any;
  authorized: boolean;
  description: string;
}

const MOCK_MODULES: Module[] = [

  { id: 'math', name: 'Math Quiz', icon: <Calculator className="w-8 h-8" />, authorized: true, description: "Challenge your math skills." },
  { id: 'lifescience', name: 'Life Science', icon: <Atom className="w-8 h-8" />, authorized: true, description: "Biology and nature exploration." },
  { id: 'afrikaans', name: 'Afrikaans Quiz', icon: <Award className="w-8 h-8" />, authorized: true, description: "Language mastery." }
]

function UserHeader() {
  const { user, login, logout } = useUser();
  return (
    <header className="glass header">
      <div className="header-brand">
        <Monitor className="text-secondary" size={32} color="#a78bfa" />
        <h2 className="header-title">StudyGen Hub</h2>
      </div>
      <div className="header-actions">
        {user.isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/progress" className="hidden md:flex items-center gap-2 px-3 py-1.5 glass rounded-lg hover:bg-white/10 transition-colors no-underline">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-bold text-orange-400">{user.streak} Day Streak</span>
            </Link>

            <Link to="/progress" className="text-sm font-bold text-slate-300 hover:text-white transition-colors no-underline">
              Lvl {user.level} {user.name.split(' ')[0]}
            </Link>

            <button onClick={logout} className="glass-btn btn-login text-sm">Logout</button>
          </div>
        ) : (
          <button onClick={() => login()} className="glass-btn btn-login">
            <User size={18} /> Login
          </button>
        )}
      </div>
    </header>
  )
}

function Dashboard() {
  const [modules, setModules] = useState<Module[]>(MOCK_MODULES)

  useEffect(() => {
    // Attempt to fetch from consolidated API
    fetch('/api/getModules')
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          return res.json();
        }
        throw new Error("API not available (likely dev mode)");
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Map API data to UI model - in real app, API should return correct shape or be mapped
          setModules(data.map((m: any) => ({
            ...m,
            icon: <BookOpen className="w-8 h-8" />,
            description: m.description || "Loaded from Consolidated API"
          })))
        }
      })
      .catch(err => {
        console.warn("API Fetch Failed - using Mock Data for demo", err);
      })
  }, [])

  return (
    <div className="grid-layout">
      {modules.map((mod, i) => (
        <motion.div
          key={mod.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass module-card"
        >
          <div className="module-bg-glow" />

          <div className="module-icon-container">
            {mod.icon}
          </div>

          <div>
            <h3 className="module-title">{mod.name}</h3>
            <p className="module-desc">{mod.description}</p>
          </div>

          <div className="module-footer">
            {mod.authorized ? (
              <Link to={`/modules/${mod.id}`} style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-access"
                >
                  Access Module
                </motion.button>
              </Link>
            ) : (
              <div className="locked-badge">
                <Lock size={18} /> <span>Subscription Required</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Mock Content for Dev Mode
const MOCK_CONTENT: Record<string, any> = {
  "math": {
    moduleId: "math",
    sections: [
      { title: "Algebra Basics", content: "Understanding variables and equations." },
      { title: "Geometry", content: "Shapes, angles, and dimensions." },
      { title: "Calculus Intro", content: "Limits and derivatives." }
    ]
  },
  "lifescience": {
    moduleId: "lifescience",
    sections: [
      { title: "Cell Biology", content: "Structure and function of cells." },
      { title: "Genetics", content: "DNA, genes, and heredity." },
      { title: "Ecology", content: "Ecosystems and interactions." }
    ]
  },
  "afrikaans": {
    moduleId: "afrikaans",
    sections: [
      { title: "Woordeskat", content: "Belangrike woorde en frases." },
      { title: "Grammatika", content: "Sinbou en tye." }
    ]
  }
};

function ModuleView() {
  const { id } = useParams()

  if (id === 'lifescience') {
    return <LifeScienceQuiz />
  }
  if (id === 'math') {
    return <MathQuiz />
  }
  if (id === 'afrikaans') {
    return <AfrikaansQuiz />
  }


  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    setContent(null); // Reset content on id change

    fetch(`/api/getContent?moduleId=${id}`)
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          return res.json();
        }
        throw new Error("API not available (likely dev mode)");
      })
      .then(data => setContent(data))
      .catch(err => {
        console.warn("API Fetch Failed - using Mock Content", err);
        // Fallback to mock content if available
        if (id && MOCK_CONTENT[id]) {
          setTimeout(() => setContent(MOCK_CONTENT[id]), 500); // Simulate network delay
        } else {
          setContent({ sections: [{ title: "Error", content: "Content failed to load." }] });
        }
      })
  }, [id])

  return (
    <div className="page-padding">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass view-container"
      >
        <h1 className="mb-2">{id?.toUpperCase()} Module</h1>

        {content ? (
          <div>
            <p>Content loaded securely from Consolidated API/Datastore.</p>
            <div className="mt-2 grid-gap-2">
              {content.sections?.map((section: any, idx: number) => (
                <div key={idx} className="section-card">
                  <h3 className="section-title">{section.title}</h3>
                  <p>{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="spinner-container">
            <div className="animate-spin spinner"></div>
          </div>
        )}
      </motion.div>
    </div>
  )
}



// ... (existing code)

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"}>
      <UserProvider>
        <Router>
          <div className="app-container">
            <UserHeader />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/progress" element={<ProgressDashboard />} />
              <Route path="/modules/:id" element={<ModuleView />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  )
}
