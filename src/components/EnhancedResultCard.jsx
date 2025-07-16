import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function EnhancedResultCard({ results, onNewImage }) {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true)
  const [hoveredBox, setHoveredBox] = useState(null)
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!results) return null

  const { objects = [] } = results

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
    
    // Get the actual rendered dimensions of the image
    const imgRect = img.getBoundingClientRect()
    const containerRect = img.parentElement.getBoundingClientRect()
    
    // Calculate the actual displayed image size and position
    const imgAspectRatio = img.naturalWidth / img.naturalHeight
    const maxWidth = img.offsetWidth
    const maxHeight = img.offsetHeight
    
    let displayedWidth, displayedHeight, offsetX, offsetY
    
    // Calculate how the image fits within its container with object-contain
    if (maxWidth / maxHeight > imgAspectRatio) {
      // Container is wider than image aspect ratio - image height will fill, width will be constrained
      displayedHeight = maxHeight
      displayedWidth = maxHeight * imgAspectRatio
      offsetX = (maxWidth - displayedWidth) / 2  // Center horizontally
      offsetY = 0
    } else {
      // Container is taller than image aspect ratio - image width will fill, height will be constrained  
      displayedWidth = maxWidth
      displayedHeight = maxWidth / imgAspectRatio
      offsetX = 0
      offsetY = (maxHeight - displayedHeight) / 2  // Center vertically
    }
    
    // Set canvas size to match container (but we'll only draw in the image area)
    canvas.width = img.offsetWidth
    canvas.height = img.offsetHeight
    canvas.style.width = img.offsetWidth + 'px'
    canvas.style.height = img.offsetHeight + 'px'
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Get scaling factors for the actual displayed image
    const scaleX = displayedWidth / img.naturalWidth
    const scaleY = displayedHeight / img.naturalHeight
    
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
          canvasX = (val1 * scaleX) + offsetX
          canvasY = (val2 * scaleY) + offsetY
          canvasWidth = (val3 - val1) * scaleX
          canvasHeight = (val4 - val2) * scaleY
        } else {
          // [x, y, width, height] format
          canvasX = (val1 * scaleX) + offsetX
          canvasY = (val2 * scaleY) + offsetY
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
      
      // Highlight if hovered
      if (hoveredBox === index) {
        color = '#3b82f6' // blue for hovered
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
      
      // Ensure label stays within the actual image bounds
      const labelX = Math.max(offsetX, Math.min(canvasX, offsetX + displayedWidth - textWidth - 8))
      const labelY = Math.max(offsetY + textHeight, canvasY)
      
      // Label background
      ctx.fillStyle = color
      ctx.fillRect(labelX, labelY - textHeight - 4, textWidth + 8, textHeight + 4)
      
      // Label text
      ctx.fillStyle = 'white'
      ctx.fillText(label, labelX + 4, labelY - 6)
    })
  }, [objects, imageLoaded, showBoundingBoxes, hoveredBox])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Get the original image source - try multiple possible sources
  const getImageSource = () => {
    console.log('Results object:', results) // Debug log
    
    // Try to get from various possible sources
    if (results.imageUrl) {
      console.log('Using imageUrl:', results.imageUrl)
      return results.imageUrl
    }
    if (results.image_url) {
      console.log('Using image_url:', results.image_url)
      return results.image_url
    }
    if (results.originalImage) {
      console.log('Using originalImage:', results.originalImage)
      return results.originalImage
    }
    
    console.log('No image source found in results')
    return null
  }

  const imageSource = getImageSource()

  if (!imageSource) {
    console.log('No image source available, showing fallback')
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <p className="text-gray-600">Image preview not available</p>
        <p className="text-sm text-gray-500 mt-2">
          Detection completed successfully - {objects.length} objects found
        </p>
        {/* Show just the object list without image */}
        {objects.length > 0 && (
          <div className="mt-6 space-y-2 text-left">
            <h4 className="font-semibold text-gray-800 text-center">Detected Objects:</h4>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {objects.map((obj, index) => {
                const confidence = obj.confidence || 0.5
                const confidencePercent = Math.round(confidence * 100)
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        confidence >= 0.8 ? 'bg-green-500' :
                        confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium text-gray-900 capitalize">{obj.class}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      {confidencePercent}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Image with Bounding Boxes */}
      <div className="relative">
        <div className="relative inline-block w-full">
          <motion.img
            ref={imageRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={imageSource}
            alt="Detection Results"
            className="w-full max-h-96 object-contain mx-auto rounded-xl shadow-lg border border-gray-200"
            onLoad={handleImageLoad}
            onError={(e) => {
              console.error('Image failed to load:', e)
              console.log('Failed image src:', imageSource)
            }}
          />
          
          {/* Bounding Box Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl"
            style={{ 
              opacity: showBoundingBoxes ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        </div>
        
        {/* Toggle Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
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
            {showBoundingBoxes ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Simple Object List */}
      {objects.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800">Detected Objects:</h4>
          <div className="grid gap-2 max-h-48 overflow-y-auto">
            {objects.map((obj, index) => {
              const confidence = obj.confidence || 0.5
              const confidencePercent = Math.round(confidence * 100)
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredBox(index)}
                  onMouseLeave={() => setHoveredBox(null)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    hoveredBox === index
                      ? 'border-blue-400 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      confidence >= 0.8 ? 'bg-green-500' :
                      confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium text-gray-900 capitalize">{obj.class}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    {confidencePercent}%
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {objects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No objects detected in this image</p>
        </div>
      )}
    </div>
  )
}
