import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { BarChart3, PieChart, Activity, Eye, Target, Zap } from 'lucide-react'

export default function InteractiveVisualization({ predictions = [] }) {
  const [selectedObject, setSelectedObject] = useState(null)
  const [viewMode, setViewMode] = useState('confidence') // 'confidence', 'distribution', 'timeline'

  // Calculate object distribution
  const objectDistribution = predictions.reduce((acc, pred) => {
    acc[pred.class] = (acc[pred.class] || 0) + 1
    return acc
  }, {})

  const confidenceRanges = {
    'High (90-100%)': predictions.filter(p => p.confidence >= 0.9).length,
    'Medium (70-89%)': predictions.filter(p => p.confidence >= 0.7 && p.confidence < 0.9).length,
    'Low (50-69%)': predictions.filter(p => p.confidence >= 0.5 && p.confidence < 0.7).length,
  }

  const viewModes = [
    { id: 'confidence', label: 'Confidence Levels', icon: BarChart3 },
    { id: 'distribution', label: 'Object Distribution', icon: PieChart },
    { id: 'timeline', label: 'Detection Timeline', icon: Activity }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header with View Mode Selector */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Eye className="w-6 h-6 text-blue-600" />
            <span>Detection Analytics</span>
          </h3>
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === mode.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <mode.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visualization Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {viewMode === 'confidence' && (
            <motion.div
              key="confidence"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Confidence Distribution</h4>
              {Object.entries(confidenceRanges).map(([range, count], index) => {
                const percentage = predictions.length > 0 ? (count / predictions.length) * 100 : 0
                const colors = ['bg-green-500', 'bg-yellow-500', 'bg-red-500']
                
                return (
                  <motion.div
                    key={range}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{range}</span>
                      <span className="text-sm text-gray-600">{count} objects</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className={`h-2 rounded-full ${colors[index]}`}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of detections</div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {viewMode === 'distribution' && (
            <motion.div
              key="distribution"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Object Categories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(objectDistribution).map(([className, count], index) => {
                  const colors = [
                    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500',
                    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
                  ]
                  
                  return (
                    <motion.div
                      key={className}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => setSelectedObject(className)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize">{className}</p>
                          <p className="text-sm text-gray-600">{count} detected</p>
                        </div>
                        <Target className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {viewMode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Detection Timeline</h4>
              <div className="space-y-3">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{prediction.class}</p>
                      <p className="text-sm text-gray-600">
                        Confidence: {(prediction.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`w-3 h-3 rounded-full ${
                        prediction.confidence >= 0.8 
                          ? 'bg-green-500' 
                          : prediction.confidence >= 0.6 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {predictions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Upload an image to see detection analytics</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
