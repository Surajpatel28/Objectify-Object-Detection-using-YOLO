import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, Zap, Clock, TrendingUp, Activity, Gauge } from 'lucide-react'

export default function PerformanceMonitor({ isProcessing, processingTime, results }) {
  const [performanceData, setPerformanceData] = useState({
    fps: 0,
    throughput: 0,
    efficiency: 0,
    cpuUsage: 0
  })

  useEffect(() => {
    if (results && processingTime > 0) {
      const objectCount = results.objects?.length || 0
      const efficiency = objectCount > 0 ? (objectCount / processingTime) * 100 : 0
      const fps = processingTime > 0 ? 1 / processingTime : 0
      const throughput = objectCount / (processingTime / 1000) // objects per second
      
      setPerformanceData({
        fps: Math.min(fps, 60), // Cap at 60 FPS
        throughput: throughput,
        efficiency: Math.min(efficiency, 100),
        cpuUsage: Math.random() * 30 + 20 // Simulated CPU usage
      })
    }
  }, [results, processingTime])

  const getPerformanceColor = (value, thresholds) => {
    if (value >= thresholds.excellent) return 'text-green-600'
    if (value >= thresholds.good) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceColorBg = (value, thresholds) => {
    if (value >= thresholds.excellent) return 'bg-green-50 border-green-200'
    if (value >= thresholds.good) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const metrics = [
    {
      icon: Zap,
      label: 'Processing Speed',
      value: `${processingTime.toFixed(2)}s`,
      score: processingTime <= 2 ? 100 : processingTime <= 5 ? 70 : 40,
      thresholds: { excellent: 80, good: 60 }
    },
    {
      icon: TrendingUp,
      label: 'Efficiency',
      value: `${performanceData.efficiency.toFixed(1)}%`,
      score: performanceData.efficiency,
      thresholds: { excellent: 80, good: 60 }
    },
    {
      icon: Activity,
      label: 'Throughput',
      value: `${performanceData.throughput.toFixed(1)}/s`,
      score: Math.min(performanceData.throughput * 20, 100),
      thresholds: { excellent: 80, good: 60 }
    },
    {
      icon: Cpu,
      label: 'Resource Usage',
      value: `${performanceData.cpuUsage.toFixed(1)}%`,
      score: 100 - performanceData.cpuUsage,
      thresholds: { excellent: 70, good: 50 }
    }
  ]

  if (!results && !isProcessing) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Gauge className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Performance Monitor</h3>
            <p className="text-sm text-gray-600">Real-time AI processing metrics</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
          <span className="text-sm font-medium text-gray-600">
            {isProcessing ? 'Processing' : 'Ready'}
          </span>
        </div>
      </div>

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="w-5 h-5 text-blue-600" />
            </motion.div>
            <div>
              <div className="font-medium text-blue-900">AI Processing Active</div>
              <div className="text-sm text-blue-700">Neural network analyzing image data...</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              getPerformanceColorBg(metric.score, metric.thresholds)
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <metric.icon className={`w-5 h-5 ${getPerformanceColor(metric.score, metric.thresholds)}`} />
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                metric.score >= metric.thresholds.excellent ? 'bg-green-100 text-green-700' :
                metric.score >= metric.thresholds.good ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {metric.score >= metric.thresholds.excellent ? 'Excellent' :
                 metric.score >= metric.thresholds.good ? 'Good' : 'Poor'}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-600">{metric.label}</div>
              <div className={`text-xl font-bold ${getPerformanceColor(metric.score, metric.thresholds)}`}>
                {metric.value}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(metric.score, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full rounded-full ${
                  metric.score >= metric.thresholds.excellent ? 'bg-green-500' :
                  metric.score >= metric.thresholds.good ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gray-50 rounded-xl"
        >
          <div className="text-sm text-gray-600 mb-2">Overall Performance Score</div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length, 100)}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length)}%
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
