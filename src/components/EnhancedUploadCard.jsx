import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Camera, Image, FileImage, Upload, Sparkles, Zap, Brain, Target } from 'lucide-react'

export default function EnhancedUploadCard({ onImageSelect, isProcessing }) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Simulate upload progress
      setUploadProgress(0)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 50)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
        onImageSelect(file, e.target.result)
        
        // Show success notification
        if (window.showNotification) {
          window.showNotification('success', 'Image Uploaded', 'Ready for object detection analysis', 3000)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const features = [
    { icon: Brain, text: "AI-Powered Detection", color: "text-purple-600" },
    { icon: Target, text: "95%+ Accuracy", color: "text-green-600" },
    { icon: Zap, text: "Real-time Processing", color: "text-yellow-600" },
    { icon: Sparkles, text: "Advanced Analytics", color: "text-blue-600" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <Camera className="w-8 h-8" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Object Detection Studio</h2>
          <p className="text-blue-100">Upload an image to discover what's inside</p>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-8 h-8 mx-auto mb-2 ${feature.color}`}
            >
              <feature.icon className="w-full h-full" />
            </motion.div>
            <p className="text-xs font-medium text-gray-700">{feature.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Upload Area */}
      <div className="p-6">
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />

          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 max-w-full rounded-xl shadow-lg"
                  />
                  {uploadProgress < 100 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center"
                    >
                      <div className="text-white text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-12 h-12 mx-auto mb-2 border-4 border-white border-t-transparent rounded-full animate-spin"
                        />
                        <p className="font-medium">Uploading... {uploadProgress}%</p>
                      </div>
                    </motion.div>
                  )}
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-sm text-gray-600"
                >
                  Image loaded successfully! Click to change image.
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    y: dragActive ? -5 : 0,
                    scale: dragActive ? 1.1 : 1 
                  }}
                  transition={{ duration: 0.2 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    dragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {dragActive ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Upload className="w-8 h-8" />
                    </motion.div>
                  ) : (
                    <FileImage className="w-8 h-8" />
                  )}
                </motion.div>
                
                <motion.h3
                  animate={{ color: dragActive ? '#2563eb' : '#374151' }}
                  className="text-lg font-semibold mb-2"
                >
                  {dragActive ? 'Drop your image here' : 'Choose an image to analyze'}
                </motion.h3>
                
                <p className="text-gray-500 mb-4">
                  Drag and drop or click to select
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <Image className="w-5 h-5" />
                  <span>Select Image</span>
                </motion.div>
                
                <p className="text-xs text-gray-400 mt-4">
                  Supports: JPG, PNG, GIF, WebP (Max: 10MB)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
