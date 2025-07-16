import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Camera, Zap, Target, Brain, Sparkles, ArrowRight, Upload, GitCompare, Eye, BarChart3, TrendingUp, CheckCircle } from 'lucide-react'

export default function ComparisonTool({ results }) {
  const [showComparison, setShowComparison] = useState(false)
  const [selectedObject, setSelectedObject] = useState(null)

  if (!results || !results.objects || results.objects.length === 0) {
    return null
  }

  const topObjects = results.objects
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)

  const confidenceCategories = {
    high: results.objects.filter(obj => obj.confidence >= 0.8),
    medium: results.objects.filter(obj => obj.confidence >= 0.6 && obj.confidence < 0.8),
    low: results.objects.filter(obj => obj.confidence < 0.6)
  }

  const uniqueClasses = [...new Set(results.objects.map(obj => obj.class))]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">AI Insights</h3>
            <p className="text-gray-600">Advanced analysis of detected objects</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors duration-200"
        >
          <GitCompare className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">
            {showComparison ? 'Hide Details' : 'Show Details'}
          </span>
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-blue-600 mb-1">{results.objects.length}</div>
          <div className="text-sm text-blue-700 font-medium">Total Objects</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-green-600 mb-1">{uniqueClasses.length}</div>
          <div className="text-sm text-green-700 font-medium">Unique Classes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-purple-600 mb-1">{confidenceCategories.high.length}</div>
          <div className="text-sm text-purple-700 font-medium">High Confidence</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {(results.objects.reduce((sum, obj) => sum + obj.confidence, 0) / results.objects.length * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-orange-700 font-medium">Avg Confidence</div>
        </motion.div>
      </div>

      {/* Top Detected Objects */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
          Top Detected Objects
        </h4>
        <div className="space-y-3">
          {topObjects.map((object, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedObject(selectedObject === index ? null : index)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  object.confidence >= 0.8 ? 'bg-green-100' :
                  object.confidence >= 0.6 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Target className={`w-4 h-4 ${
                    object.confidence >= 0.8 ? 'text-green-600' :
                    object.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 capitalize">{object.class}</div>
                  <div className="text-sm text-gray-500">
                    Position: ({Math.round(object.bbox[0])}, {Math.round(object.bbox[1])})
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{(object.confidence * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-500">confidence</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Analysis */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 pt-8"
          >
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Eye className="w-5 h-5 text-purple-600 mr-2" />
              Confidence Distribution
            </h4>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* High Confidence */}
              <div className="bg-green-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-green-900">High Confidence</h5>
                  <div className="bg-green-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-green-700">≥80%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{confidenceCategories.high.length}</div>
                <div className="space-y-2">
                  {confidenceCategories.high.slice(0, 3).map((obj, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-green-800 capitalize">{obj.class}</span>
                      <span className="text-green-600 font-medium">{(obj.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                  {confidenceCategories.high.length > 3 && (
                    <div className="text-sm text-green-600">+{confidenceCategories.high.length - 3} more</div>
                  )}
                </div>
              </div>

              {/* Medium Confidence */}
              <div className="bg-yellow-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-yellow-900">Medium Confidence</h5>
                  <div className="bg-yellow-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-yellow-700">60-79%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">{confidenceCategories.medium.length}</div>
                <div className="space-y-2">
                  {confidenceCategories.medium.slice(0, 3).map((obj, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-yellow-800 capitalize">{obj.class}</span>
                      <span className="text-yellow-600 font-medium">{(obj.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                  {confidenceCategories.medium.length > 3 && (
                    <div className="text-sm text-yellow-600">+{confidenceCategories.medium.length - 3} more</div>
                  )}
                </div>
              </div>

              {/* Low Confidence */}
              <div className="bg-red-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-red-900">Low Confidence</h5>
                  <div className="bg-red-100 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-red-700">&lt;60%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-2">{confidenceCategories.low.length}</div>
                <div className="space-y-2">
                  {confidenceCategories.low.slice(0, 3).map((obj, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-red-800 capitalize">{obj.class}</span>
                      <span className="text-red-600 font-medium">{(obj.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                  {confidenceCategories.low.length > 3 && (
                    <div className="text-sm text-red-600">+{confidenceCategories.low.length - 3} more</div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 text-blue-600 mr-2" />
                AI Recommendations
              </h5>
              <div className="space-y-3">
                {confidenceCategories.high.length >= 3 && (
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Excellent Detection Quality</div>
                      <div className="text-sm text-gray-600">Most objects detected with high confidence. The image quality and lighting are optimal.</div>
                    </div>
                  </div>
                )}
                
                {confidenceCategories.low.length > 0 && (
                  <div className="flex items-start space-x-3">
                    <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Consider Image Quality</div>
                      <div className="text-sm text-gray-600">Some objects have lower confidence. Try better lighting or higher resolution for improved results.</div>
                    </div>
                  </div>
                )}

                {uniqueClasses.length >= 5 && (
                  <div className="flex items-start space-x-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Rich Scene Complexity</div>
                      <div className="text-sm text-gray-600">Great variety of objects detected! This indicates a complex and interesting scene.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
