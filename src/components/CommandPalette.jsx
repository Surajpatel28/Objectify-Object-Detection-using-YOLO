import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, Search, Command, FileImage, Zap, Settings, Info, ChevronRight } from 'lucide-react'

export default function CommandPalette({ isOpen, onClose, onAction }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands = [
    {
      id: 'upload',
      title: 'Upload New Image',
      description: 'Select an image file for object detection',
      icon: FileImage,
      action: () => onAction('upload'),
      shortcut: 'Ctrl+U'
    },
    {
      id: 'clear',
      title: 'Clear Results',
      description: 'Remove current detection results',
      icon: X,
      action: () => onAction('clear'),
      shortcut: 'Ctrl+C'
    },
    {
      id: 'process',
      title: 'Process Image',
      description: 'Run object detection on uploaded image',
      icon: Zap,
      action: () => onAction('process'),
      shortcut: 'Ctrl+P'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure detection parameters',
      icon: Settings,
      action: () => onAction('settings'),
      shortcut: 'Ctrl+,'
    },
    {
      id: 'about',
      title: 'About',
      description: 'Learn more about this application',
      icon: Info,
      action: () => onAction('about'),
      shortcut: 'Ctrl+?'
    }
  ]

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
            onClose()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center space-x-3 p-4 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg bg-transparent border-none outline-none placeholder-gray-400 text-gray-900"
              autoFocus
            />
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600">ESC</kbd>
              <span>to close</span>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <motion.button
                    key={command.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                      index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      command.action()
                      onClose()
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === selectedIndex ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <command.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${
                        index === selectedIndex ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {command.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {command.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {command.shortcut && (
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {command.shortcut}
                        </kbd>
                      )}
                      <ChevronRight className={`w-4 h-4 ${
                        index === selectedIndex ? 'text-blue-400' : 'text-gray-300'
                      }`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No commands found</p>
                <p className="text-sm text-gray-400">Try searching for something else</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-gray-600">↑↓</kbd>
                  <span>to navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-gray-600">↵</kbd>
                  <span>to select</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Command className="w-3 h-3" />
                <span>Command Palette</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
