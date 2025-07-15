import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { Brain, Home, Camera } from 'lucide-react'

export default function Navigation() {
  const location = useLocation()
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Objectifi
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                location.pathname === '/' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </motion.button>
          </Link>
          
          <Link to="/detect">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                location.pathname === '/detect' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Detect</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
