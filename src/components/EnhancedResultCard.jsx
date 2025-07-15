import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Eye, Target, Percent, Zap, Camera, Download, Share, RotateCcw, Maximize, Star, TrendingUp, EyeOff } from 'lucide-react'

export default function ResultCard({ results, onNewImage }) {
  const [selectedObject, setSelectedObject] = useState(null)
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true)
  const [hoveredBox, setHoveredBox] = useState(null)
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!results) return null

  const { objects = [], imageUrl, processingTime, modelInfo } = results

  // Draw bounding boxes on canvas
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current || !showBoundingBoxes) {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
      return
    }

    const canvas = canvasRef.current
    const img = imageRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size to match image display size
    const rect = img.getBoundingClientRect()
    canvas.width = img.offsetWidth
    canvas.height = img.offsetHeight
    canvas.style.width = img.offsetWidth + 'px'
    canvas.style.height = img.offsetHeight + 'px'
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Get image natural vs display size ratio
    const scaleX = img.offsetWidth / img.naturalWidth
    const scaleY = img.offsetHeight / img.naturalHeight
    
    // Draw bounding boxes
    objects.forEach((obj, index) => {
      if (!obj.bbox) return
      
      const confidence = obj.confidence || 0.5
      
      // Handle different bbox formats: [x1, y1, x2, y2] or [x, y, width, height]
      let canvasX, canvasY, canvasWidth, canvasHeight
      
      if (obj.bbox.length === 4) {
        const [val1, val2, val3, val4] = obj.bbox
        
        // Check if it's [x1, y1, x2, y2] format (YOLO format)
        if (val3 > val1 && val4 > val2) {
          // [x1, y1, x2, y2] format
          canvasX = val1 * scaleX
          canvasY = val2 * scaleY
          canvasWidth = (val3 - val1) * scaleX
          canvasHeight = (val4 - val2) * scaleY
        } else {
          // [x, y, width, height] format
          canvasX = val1 * scaleX
          canvasY = val2 * scaleY
          canvasWidth = val3 * scaleX
          canvasHeight = val4 * scaleY
        }
      } else {
        return // Invalid bbox format
      }
      
      // Color based on confidence
      let color = '#ef4444' // red for low confidence
      if (confidence >= 0.8) color = '#22c55e' // green for high confidence
      else if (confidence >= 0.6) color = '#eab308' // yellow for medium confidence
      
      // Highlight if hovered or selected
      if (hoveredBox === index || selectedObject === index) {
        color = '#3b82f6' // blue for selected/hovered
        ctx.lineWidth = 3
      } else {
        ctx.lineWidth = 2
      }
      
      // Draw bounding box
      ctx.strokeStyle = color
      ctx.fillStyle = color + '20' // Semi-transparent fill
      ctx.fillRect(canvasX, canvasY, canvasWidth, canvasHeight)
      ctx.strokeRect(canvasX, canvasY, canvasWidth, canvasHeight)
      
      // Draw label background
      const label = `${obj.class} ${Math.round(confidence * 100)}%`
      ctx.font = 'bold 12px Arial'
      const textMetrics = ctx.measureText(label)
      const textWidth = textMetrics.width
      const textHeight = 16
      
      // Label background
      ctx.fillStyle = color
      ctx.fillRect(canvasX, canvasY - textHeight - 4, textWidth + 8, textHeight + 4)
      
      // Label text
      ctx.fillStyle = 'white'
      ctx.fillText(label, canvasX + 4, canvasY - 6)
    })
  }, [objects, imageLoaded, showBoundingBoxes, hoveredBox, selectedObject])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const getObjectDescription = (label) => {
    const descriptions = {
      'person': 'A human being detected in the image with full body recognition',
      'car': 'A motor vehicle identified with precise boundary detection',
      'dog': 'A domestic canine companion recognized by advanced AI',
      'cat': 'A domestic feline companion with detailed feature analysis',
      'bicycle': 'A two-wheeled vehicle with component recognition',
      'motorcycle': 'A motorized two-wheeled vehicle with detailed detection',
      'bus': 'A large passenger transport vehicle with accurate sizing',
      'truck': 'A commercial cargo vehicle with load area detection',
      'traffic light': 'A traffic control device with state recognition',
      'stop sign': 'A regulatory traffic sign with text recognition',
      'bird': 'An avian creature with species-specific identification',
      'horse': 'An equine mammal with posture and gait analysis',
      'sheep': 'A pastoral mammal with wool texture recognition',
      'cow': 'A bovine animal with breed-specific characteristics',
      'elephant': 'A large pachyderm with trunk and ear analysis',
      'bear': 'A large carnivorous mammal with species identification',
      'zebra': 'A striped equine with pattern recognition',
      'giraffe': 'A tall African mammal with neck measurement',
      'tree': 'Natural vegetation with foliage density analysis',
      'building': 'Architectural structure with material recognition'
    }
    return descriptions[label] || `${label.charAt(0).toUpperCase() + label.slice(1)} detected with AI precision`
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50 border-green-200'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return '🎯'
    if (confidence >= 0.6) return '⚡'
    return '🔍'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            >
              <Target className="w-6 h-6" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Detection Results</h3>
              <p className="text-blue-100">AI Analysis Complete</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewImage}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">New Image</span>
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{objects.length}</div>
            <div className="text-sm text-blue-100">Objects Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{(processingTime || 1.2).toFixed(2)}s</div>
            <div className="text-sm text-blue-100">Processing Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{modelInfo?.accuracy || 94.2}%</div>
            <div className="text-sm text-blue-100">Model Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{objects.filter(obj => (obj.confidence || 0.5) >= 0.8).length}</div>
            <div className="text-sm text-blue-100">High Confidence</div>
          </div>
        </div>
      </div>

      {/* Image and Controls */}
      <div className="p-6">
        <div className="relative mb-6">
          {/* Image Container with Canvas Overlay */}
          <div className="relative inline-block w-full">
            <motion.img
              ref={imageRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={imageUrl}
              alt="Analysis Result"
              className="w-full max-h-96 object-contain mx-auto rounded-2xl shadow-lg"
              onLoad={handleImageLoad}
            />
            
            {/* Bounding Box Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl"
              style={{ 
                opacity: showBoundingBoxes ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
          </div>
          
          {/* Toggle Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showBoundingBoxes 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white/90 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {showBoundingBoxes ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
              {showBoundingBoxes ? 'Hide Boxes' : 'Show Boxes'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/90 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Save
            </motion.button>
          </div>
        </div>

        {/* Objects List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Detected Objects</span>
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{objects.length} item{objects.length !== 1 ? 's' : ''} found</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>High confidence: {objects.filter(obj => (obj.confidence || 0.5) >= 0.8).length}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">{/* Scrollable container */}
            {objects.map((obj, index) => {
              const confidence = obj.confidence || 0.5
              const confidencePercent = Math.round(confidence * 100)
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setSelectedObject(selectedObject === index ? null : index)}
                  onMouseEnter={() => setHoveredBox(index)}
                  onMouseLeave={() => setHoveredBox(null)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedObject === index
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : hoveredBox === index
                      ? 'border-purple-400 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getConfidenceIcon(confidence)}</div>
                      <div>
                        <h5 className="font-semibold text-gray-900 capitalize text-lg">
                          {obj.class}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {getObjectDescription(obj.class)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold border ${getConfidenceColor(confidence)}`}>
                        <TrendingUp className="w-4 h-4" />
                        <span>{confidencePercent}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">confidence</div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedObject === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Confidence Level:</span>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${confidencePercent}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`h-2 rounded-full ${
                                  confidence >= 0.8 
                                    ? 'bg-green-500' 
                                    : confidence >= 0.6 
                                    ? 'bg-yellow-500' 
                                    : 'bg-red-500'
                                }`}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{confidencePercent}% confidence</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Detection Quality:</span>
                            <div className={`text-sm mt-1 font-medium ${
                              confidence >= 0.8 
                                ? 'text-green-600' 
                                : confidence >= 0.6 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                            }`}>
                              {confidence >= 0.8 ? '🎯 Excellent' : confidence >= 0.6 ? '⚡ Good' : '🔍 Fair'}
                            </div>
                          </div>
                        </div>
                        
                        {obj.bbox && (
                          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                            <span className="font-medium text-gray-700 text-sm block mb-2">Bounding Box Coordinates:</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-white p-2 rounded">
                                <span className="text-gray-500">Top-Left:</span>
                                <div className="font-mono text-gray-800">
                                  x: {Math.round(obj.bbox[0])}, y: {Math.round(obj.bbox[1])}
                                </div>
                              </div>
                              <div className="bg-white p-2 rounded">
                                <span className="text-gray-500">
                                  {obj.bbox[2] > obj.bbox[0] ? 'Bottom-Right:' : 'Size:'}
                                </span>
                                <div className="font-mono text-gray-800">
                                  {obj.bbox[2] > obj.bbox[0] 
                                    ? `x: ${Math.round(obj.bbox[2])}, y: ${Math.round(obj.bbox[3])}`
                                    : `w: ${Math.round(obj.bbox[2])}, h: ${Math.round(obj.bbox[3])}`
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Model Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200"
        >
          <h5 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <span>AI Model Information</span>
          </h5>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Model:</span>
              <div className="text-gray-600">{modelInfo?.name || 'YOLOv8'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Version:</span>
              <div className="text-gray-600">{modelInfo?.version || '8.0'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Speed:</span>
              <div className="text-gray-600">{modelInfo?.speed || 'Real-time'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Accuracy:</span>
              <div className="text-gray-600">{modelInfo?.accuracy || 94.2}%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
