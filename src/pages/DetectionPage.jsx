import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Zap, Target, Camera, Download } from 'lucide-react'
import axios from 'axios'
import EnhancedUploadCard from '../components/EnhancedUploadCard'
import EnhancedResultCard from '../components/EnhancedResultCard'
import Loader from '../components/Loader'
import NotificationSystem, { showNotification } from '../components/NotificationSystem'

// API Configuration
const API_BASE_URL = 'http://localhost:8000'

export default function DetectionPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState(null)
  const [processingTime, setProcessingTime] = useState(0)

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
    
    showNotification('processing', 'Processing Started', 'AI is analyzing your image...', 0)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedImage)
      
      const response = await axios.post(`${API_BASE_URL}/detect`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      })
      
      const endTime = Date.now()
      const processTime = (endTime - startTime) / 1000
      setProcessingTime(processTime)
      
      console.log('API Response:', response.data) // Debug log
      
      // Handle different possible response formats
      if (response.data) {
        // Check if it's the expected format with objects array
        if (response.data.objects && Array.isArray(response.data.objects)) {
          setResults(response.data)
          showNotification('success', 'Detection Complete!', `Found ${response.data.objects.length} objects in ${processTime.toFixed(1)}s`, 3000)
        }
        // Check if backend returns 'predictions' (which is the actual format)
        else if (response.data.predictions && Array.isArray(response.data.predictions)) {
          console.log('imagePreview value:', imagePreview) // Debug log
          const formattedResponse = { 
            objects: response.data.predictions,
            imageUrl: imagePreview, // Add the original image URL
            ...response.data 
          }
          console.log('formattedResponse:', formattedResponse) // Debug log
          setResults(formattedResponse)
          showNotification('success', 'Detection Complete!', `Found ${response.data.predictions.length} objects in ${processTime.toFixed(1)}s`, 3000)
        }
        // Check if the response is directly an array of objects
        else if (Array.isArray(response.data)) {
          const formattedResponse = { objects: response.data }
          setResults(formattedResponse)
          showNotification('success', 'Detection Complete!', `Found ${response.data.length} objects in ${processTime.toFixed(1)}s`, 3000)
        }
        // Check if objects are nested differently
        else if (response.data.detections) {
          const objects = response.data.detections
          const formattedResponse = { objects: objects }
          setResults(formattedResponse)
          showNotification('success', 'Detection Complete!', `Found ${objects.length} objects in ${processTime.toFixed(1)}s`, 3000)
        }
        // Handle empty results
        else if (response.data.message === 'No objects detected' || 
                 (response.data.predictions && response.data.predictions.length === 0) ||
                 (response.data.objects && response.data.objects.length === 0)) {
          const emptyResponse = { objects: [] }
          setResults(emptyResponse)
          showNotification('info', 'Detection Complete', 'No objects detected in the image', 3000)
        }
        else {
          console.error('Unexpected response format:', response.data)
          throw new Error(`Invalid response format. Expected 'objects' or 'predictions' array but got: ${JSON.stringify(response.data)}`)
        }
      } else {
        throw new Error('Empty response from server')
      }
    } catch (error) {
      console.error('Detection error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code
      })
      
      let errorMessage = 'Failed to process image'
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to AI server. Please ensure the backend is running on port 8000.'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.detail || 'Invalid image format. Please try a different image.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error during processing. Please try again or contact support.'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try with a smaller image or check your connection.'
      } else if (error.message.includes('Invalid response format')) {
        errorMessage = `Server response format error: ${error.message}. Please check the backend API.`
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection and ensure the backend is running.'
      }
      
      showNotification('error', 'Processing Failed', errorMessage, 8000)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetDetection = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResults(null)
    setIsProcessing(false)
    setProcessingTime(0)
  }

  const downloadResults = () => {
    if (!results) return
    
    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'detection-results.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    showNotification('success', 'Download Started', 'Results exported successfully', 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <div className="container mx-auto px-3 py-3 sm:py-4 lg:py-6">
        {results ? (
          /* Results View - Grid Layout: Stats (vertical) | Image */
          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Left Section - Vertical Stats (1/3 width) */}
            <div className="lg:col-span-1 space-y-3">
              {/* Summary Stats - Vertical Layout */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center">
                  <Target className="w-4 h-4 text-green-600 mr-2" />
                  Detection Summary
                </h2>
                
                {/* Vertical Stats */}
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{results.objects.length}</div>
                    <div className="text-xs text-blue-700 font-medium">Objects Found</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{processingTime.toFixed(1)}s</div>
                    <div className="text-xs text-green-700 font-medium">Process Time</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {Math.round(results.objects.reduce((sum, obj) => sum + obj.confidence, 0) / results.objects.length * 100)}%
                    </div>
                    <div className="text-xs text-purple-700 font-medium">Avg Confidence</div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {[...new Set(results.objects.map(obj => obj.class))].length}
                    </div>
                    <div className="text-xs text-orange-700 font-medium">Unique Classes</div>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="space-y-3">
                  <button
                    onClick={resetDetection}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Analyze New Image
                  </button>
                  <button
                    onClick={downloadResults}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Download Results
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Section - Detected Image (2/3 width) */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Camera className="w-6 h-6 text-purple-600 mr-2" />
                  Detection Results
                </h2>
                
                <EnhancedResultCard 
                  results={results} 
                  onNewImage={resetDetection}
                />
              </motion.div>
            </div>
          </div>
        ) : (
          /* Upload/Processing View - Optimized for laptop viewport */
          <div className="max-w-3xl mx-auto">
            {!selectedImage && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100"
              >
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
                  Upload Image
                </h2>
                <EnhancedUploadCard 
                  onImageSelect={handleImageSelect} 
                  isProcessing={isProcessing}
                />
              </motion.div>
            )}

            {selectedImage && !isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100"
              >
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
                  Selected Image
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-200">
                    <img 
                      src={imagePreview} 
                      alt="Selected" 
                      className="w-full h-48 sm:h-56 lg:h-64 object-contain"
                    />
                  </div>
                  <button
                    onClick={processImage}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Analyze with AI</span>
                  </button>
                </div>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 text-center"
              >
                <Loader />
                <h3 className="text-lg font-semibold text-gray-800 mt-4">Processing Image...</h3>
                <p className="text-gray-600 mt-2">AI is analyzing your image</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Notification System */}
      <NotificationSystem />
    </div>
  )
}
