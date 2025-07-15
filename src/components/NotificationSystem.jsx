import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X, Bell, Zap, Upload, Download } from 'lucide-react'

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([])

  const addNotification = (type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random()
    const notification = { id, type, title, message, duration }
    
    setNotifications(prev => [...prev, notification])
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  // Expose globally for use in other components
  useEffect(() => {
    window.showNotification = addNotification
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'error': return AlertCircle
      case 'info': return Info
      case 'upload': return Upload
      case 'download': return Download
      case 'processing': return Zap
      default: return Bell
    }
  }

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          title: 'text-green-900',
          message: 'text-green-700'
        }
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          title: 'text-red-900',
          message: 'text-red-700'
        }
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-900',
          message: 'text-blue-700'
        }
      case 'processing':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          title: 'text-yellow-900',
          message: 'text-yellow-700'
        }
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-900',
          message: 'text-gray-700'
        }
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type)
          const styles = getNotificationStyles(notification.type)
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className={`${styles.bg} border rounded-xl shadow-lg backdrop-blur-sm p-4 relative overflow-hidden`}
            >
              {/* Progress bar for auto-dismiss */}
              {notification.duration > 0 && (
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: notification.duration / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-current opacity-20"
                />
              )}
              
              <div className="flex items-start space-x-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={`flex-shrink-0 ${styles.icon}`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className={`text-sm font-semibold ${styles.title}`}
                  >
                    {notification.title}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className={`text-sm ${styles.message} mt-1`}
                  >
                    {notification.message}
                  </motion.p>
                </div>
                
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeNotification(notification.id)}
                  className={`flex-shrink-0 ${styles.icon} hover:opacity-70 transition-opacity duration-200`}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// Utility function to show notifications from anywhere in the app
export const showNotification = (type, title, message, duration) => {
  if (window.showNotification) {
    window.showNotification(type, title, message, duration)
  }
}
