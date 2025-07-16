import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DetectionPage from './pages/DetectionPage'
import NotificationSystem from './components/NotificationSystem'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />
      
      {/* Main Content with proper spacing for fixed navigation */}
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detect" element={<DetectionPage />} />
        </Routes>
      </div>

      {/* Global Notification System */}
      <NotificationSystem />
    </div>
  )
}

export default App
