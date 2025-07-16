import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Plus, Camera, Download, Share2, RotateCcw, Zap, X, Upload, Sparkles } from 'lucide-react'

export default function FloatingActionButton({ onNewImage, onDownload, onShare, hasResults }) {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: Camera,
      label: 'New Image',
      onClick: onNewImage,
      color: 'bg-blue-600 hover:bg-blue-700',
      show: hasResults
    },
    {
      icon: Download,
      label: 'Download',
      onClick: onDownload,
      color: 'bg-green-600 hover:bg-green-700',
      show: hasResults
    },
    {
      icon: Share2,
      label: 'Share',
      onClick: onShare,
      color: 'bg-purple-600 hover:bg-purple-700',
      show: hasResults
    },
    {
      icon: Upload,
      label: 'Upload',
      onClick: () => document.querySelector('input[type="file"]')?.click(),
      color: 'bg-orange-600 hover:bg-orange-700',
      show: !hasResults
    }
  ]

  const visibleActions = actions.filter(action => action.show)

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {visibleActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  action.onClick?.()
                  setIsOpen(false)
                }}
                className={`${action.color} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 min-w-max group`}
              >
                <action.icon className="w-5 h-5" />
                <motion.span 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {action.label}
                </motion.span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation when closed */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"
          />
        )}
      </motion.button>
    </div>
  )
}
