import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Zap, Target, Camera, Sparkles, Brain, Command, Settings, Bell, Menu, X } from 'lucide-react'
import axios from 'axios'
import EnhancedUploadCard from './components/EnhancedUploadCard'
import EnhancedResultCard from './components/EnhancedResultCard'
import Loader from './components/Loader'
import PerformanceMetrics from './components/PerformanceMetrics'
import InteractiveVisualization from './components/InteractiveVisualization'
import CommandPalette from './components/CommandPalette'
import NotificationSystem, { showNotification } from './components/NotificationSystem'
import './App.css'

// API Configuration
const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState(null)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file)
    setImagePreview(preview)
    setResults(null)
    setProcessingTime(0)
  }

  const processImage = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    const startTime = Date.now()
    
    // Show processing notification
    showNotification('processing', 'Processing Started', 'AI is analyzing your image...', 0)
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', selectedImage)
      
      // Make API call to backend
      const response = await axios.post(`${API_BASE_URL}/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      })
      
      const endTime = Date.now()
      const processingTimeSeconds = (endTime - startTime) / 1000
      setProcessingTime(processingTimeSeconds)
      
      // Process API response
      const apiData = response.data
      
      // Transform API response to match frontend format
      const enhancedResults = {
        objects: apiData.predictions || [],
        processingTime: apiData.processing_time || processingTimeSeconds,
        imageUrl: imagePreview,
        modelInfo: apiData.model_info || {
          name: 'YOLOv8n',
          version: '8.0',
          accuracy: 94.2,
          speed: 'Real-time'
        },
        metadata: {
          filename: apiData.filename,
          imageShape: apiData.image_shape,
          timestamp: apiData.timestamp,
          numDetections: apiData.num_detections
        }
      }
      
      setResults(enhancedResults)
      
      // Show success notification with details
      const objectCount = enhancedResults.objects.length
      const processingTime = enhancedResults.processingTime
      showNotification(
        'success', 
        'Detection Complete!', 
        `Found ${objectCount} object${objectCount !== 1 ? 's' : ''} in ${processingTime.toFixed(2)}s`, 
        5000
      )
      
      // Log success
      console.log('✅ Detection successful:', enhancedResults)
      
    } catch (error) {
      console.error('❌ Error processing image:', error)
      
      let errorMessage = 'There was an error analyzing your image. Please try again.'
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to AI server. Please ensure the backend is running on port 8000.'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.detail || 'Invalid image format. Please try a different image.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error during processing. Please try again or contact support.'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try with a smaller image or check your connection.'
      }
      
      showNotification('error', 'Processing Failed', errorMessage, 8000)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCommandAction = (action) => {
    switch (action) {
      case 'upload':
        document.querySelector('input[type="file"]')?.click()
        break
      case 'clear':
        setSelectedImage(null)
        setImagePreview(null)
        setResults(null)
        setProcessingTime(0)
        showNotification('info', 'Results Cleared', 'Ready for a new image analysis', 3000)
        break
      case 'process':
        if (selectedImage && !isProcessing) {
          processImage()
        }
        break
      case 'settings':
        showNotification('info', 'Settings', 'Settings panel coming soon!', 3000)
        break
      case 'about':
        showNotification('info', 'About', 'AI Object Detection Studio v2.0 - Powered by YOLOv8', 5000)
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148,163,184,0.3)_1px,transparent_0)] bg-[size:20px_20px]"></div>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.2, 1, 1.2]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </div>
      
      {/* Navigation Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
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
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCommandPalette(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <Command className="w-4 h-4" />
              <span className="text-sm font-medium">Commands</span>
              <kbd className="px-2 py-1 bg-white rounded text-xs text-gray-600">⌘K</kbd>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </motion.nav>
      
      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 pt-12 pb-8"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Camera className="w-12 h-12 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Next-Gen Object
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Detection
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Experience the future of computer vision with our state-of-the-art AI that identifies, 
            analyzes, and understands objects with unprecedented accuracy and speed.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-8"
          >
            {[
              { icon: Target, text: "95%+ Accuracy", color: "text-green-600" },
              { icon: Zap, text: "Real-time Speed", color: "text-yellow-600" },
              { icon: Sparkles, text: "AI-Powered", color: "text-purple-600" },
              { icon: Brain, text: "Deep Learning", color: "text-blue-600" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 shadow-lg"
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span className="font-semibold text-gray-800">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.header>

      {/* Performance Metrics */}
      {results && (
        <div className="relative z-10 container mx-auto px-4 mb-8">
          <div className="max-w-6xl mx-auto">
            <PerformanceMetrics 
              predictions={results.objects} 
              processingTime={processingTime}
              modelAccuracy={results.modelInfo?.accuracy}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className={`grid gap-8 ${results ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
            
            {/* Upload/Processing Section */}
            <div className="space-y-8">
              {!selectedImage && !isProcessing && !results && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <EnhancedUploadCard 
                    onImageSelect={handleImageSelect} 
                    isProcessing={isProcessing}
                  />
                </motion.div>
              )}

              {/* Processing State */}
              <AnimatePresence mode="wait">
                {isProcessing && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <Loader />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-8 space-y-6"
                    >
                      <h3 className="text-3xl font-bold text-gray-800">AI Analysis in Progress</h3>
                      <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Our neural network is examining every pixel to identify objects with precision
                      </p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                        {[
                          { step: "Neural Loading", delay: 0 },
                          { step: "Pixel Analysis", delay: 0.5 }, 
                          { step: "Object Detection", delay: 1 },
                          { step: "Confidence Calc", delay: 1.5 }
                        ].map((item, index) => (
                          <motion.div
                            key={item.step}
                            initial={{ opacity: 0.3, scale: 0.9 }}
                            animate={{ 
                              opacity: [0.3, 1, 0.3],
                              scale: [0.9, 1, 0.9]
                            }}
                            transition={{ 
                              duration: 2,
                              delay: item.delay,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50"
                          >
                            <div className="text-sm font-medium text-gray-700">{item.step}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Selected Image with Process Button */}
                {selectedImage && !isProcessing && !results && (
                  <motion.div
                    key="selected"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                      <motion.img 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={imagePreview} 
                        alt="Selected" 
                        className="max-h-96 w-full object-contain mx-auto rounded-2xl shadow-lg mb-8"
                      />
                      <div className="text-center">
                        <motion.button
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={processImage}
                          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-4 mx-auto text-lg"
                        >
                          <Zap className="w-8 h-8" />
                          <span>Analyze with AI</span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-6 h-6" />
                          </motion.div>
                        </motion.button>
                        <p className="text-gray-500 mt-4 text-sm">
                          Click to start object detection analysis
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results and Visualization Section */}
            {results && (
              <div className="space-y-8">
                <EnhancedResultCard 
                  results={results} 
                  onNewImage={() => {
                    setSelectedImage(null)
                    setImagePreview(null)
                    setResults(null)
                    setProcessingTime(0)
                  }}
                />
              </div>
            )}
          </div>

          {/* Interactive Visualization Panel */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12"
            >
              <InteractiveVisualization predictions={results.objects} />
            </motion.div>
          )}
        </div>
      </main>

      {/* Enhanced Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="relative z-10 bg-white/80 backdrop-blur-lg border-t border-gray-200/50 py-12 mt-16"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-gray-600 mb-4">
            © 2024 AI Object Detection Studio. Revolutionizing computer vision with cutting-edge technology.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>Powered by YOLOv8</span>
            <span>•</span>
            <span>Real-time Processing</span>
            <span>•</span>
            <span>95%+ Accuracy</span>
          </div>
        </div>
      </motion.footer>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onAction={handleCommandAction}
      />

      {/* Notification System */}
      <NotificationSystem />
    </div>
  )
}

export default App
