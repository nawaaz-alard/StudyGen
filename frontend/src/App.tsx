
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sandbox from './modules/Sandbox/Sandbox'
import ProgressDashboard from './modules/Dashboard/ProgressDashboard'
import Dashboard from './modules/Dashboard/Dashboard'
import ModuleView from './modules/ModuleView/ModuleView'
import Leaderboard from './modules/Leaderboard/Leaderboard'
import Header from './components/layout/Header'
import './index.css'
import { UserProvider } from './context/UserContext'
import { SoundProvider } from './context/SoundContext'

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"}>
      <UserProvider>
        <SoundProvider>
          <Router>
            <div className="app-container">
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sandbox" element={<Sandbox />} />
                <Route path="/progress" element={<ProgressDashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/modules/:id" element={<ModuleView />} />
              </Routes>
            </div>
          </Router>
        </SoundProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  )
}
