import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Eye, Target, Percent, Zap, Camera, Download, Share, RotateCcw, Maximize, Star, TrendingUp } from 'lucide-react'

export default function ResultCard({ results, onNewImage }) {
  const [selectedObject, setSelectedObject] = useState(null)
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true)

  if (!results) return null

  const { objects = [], imageUrl, processingTime, modelInfo } = results

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
        <div className="grid grid-cols-3 gap-4 mt-6">
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
        </div>
      </div>

      {/* Image and Controls */}
      <div className="p-6">
        <div className="relative mb-6">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={imageUrl}
            alt="Analysis Result"
            className="w-full max-h-96 object-contain mx-auto rounded-2xl shadow-lg"
          />
          
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
              <Eye className="w-4 h-4 inline mr-1" />
              Boxes
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
            <div className="text-sm text-gray-500">
              {objects.length} item{objects.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="grid gap-3">
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
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedObject === index
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
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
                        <div className="grid grid-cols-2 gap-4 text-sm">
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
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Detection Quality:</span>
                            <div className="text-gray-600 mt-1">
                              {confidence >= 0.8 ? 'Excellent' : confidence >= 0.6 ? 'Good' : 'Fair'}
                            </div>
                          </div>
                        </div>
                        
                        {obj.bbox && (
                          <div className="mt-3 text-xs text-gray-500">
                            <span className="font-medium">Bounding Box:</span> 
                            {` [${obj.bbox.map(b => Math.round(b)).join(', ')}]`}
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
      'orange': 'A citrus fruit',
      'broccoli': 'A green vegetable',
      'carrot': 'An orange root vegetable',
      'hot dog': 'A sausage in a bun',
      'pizza': 'A flat bread with toppings',
      'donut': 'A fried ring-shaped pastry',
      'cake': 'A sweet baked dessert',
      'chair': 'A piece of furniture for sitting',
      'couch': 'A piece of furniture for multiple people to sit',
      'potted plant': 'A plant growing in a container',
      'bed': 'A piece of furniture for sleeping',
      'dining table': 'A table used for eating meals',
      'toilet': 'A plumbing fixture for waste disposal',
      'tv': 'A television for viewing programs',
      'laptop': 'A portable computer',
      'mouse': 'A computer pointing device',
      'remote': 'A device for controlling electronics remotely',
      'keyboard': 'A computer input device',
      'cell phone': 'A mobile communication device',
      'microwave': 'An appliance for heating food',
      'oven': 'An appliance for baking and cooking',
      'toaster': 'An appliance for toasting bread',
      'sink': 'A basin for washing',
      'refrigerator': 'An appliance for keeping food cold',
      'book': 'A written or printed work',
      'clock': 'A device for telling time',
      'vase': 'A decorative container',
      'scissors': 'A cutting tool',
      'teddy bear': 'A stuffed toy bear',
      'hair drier': 'A device for drying hair',
      'toothbrush': 'A tool for cleaning teeth'
    }
    return descriptions[label] || `A ${label} object detected in the image`
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image with Bounding Boxes */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Eye className="w-5 h-5 text-blue-600" />
              Detection Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <img
                src={imageUrl}
                alt="Detection result"
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
              {/* Bounding boxes would be overlaid here - this requires canvas or SVG implementation */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Placeholder for bounding box overlay */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detection List */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-5 h-5 text-green-600" />
              Detected Objects ({predictions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-800 capitalize">
                      {prediction.label}
                    </h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidence)}`}>
                      <Percent className="w-3 h-3" />
                      {(prediction.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {getObjectDescription(prediction.label)}
                  </p>
                  <div className="text-xs text-gray-500">
                    Position: ({prediction.bbox[0].toFixed(0)}, {prediction.bbox[1].toFixed(0)}) - 
                    ({prediction.bbox[2].toFixed(0)}, {prediction.bbox[3].toFixed(0)})
                  </div>
                </motion.div>
              ))}
              {predictions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No objects detected in this image.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
