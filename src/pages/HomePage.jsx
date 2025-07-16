import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, Target, Zap, Brain, Sparkles, ArrowRight, Play, Users, Award, Eye, Scan, Upload } from 'lucide-react'
import { useRef } from 'react'

export default function HomePage() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.5])

  const features = [
    {
      icon: Eye,
      title: "Real-time Detection",
      description: "Instantly identify and locate objects in any image with sub-second processing",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Brain,
      title: "80+ Object Classes",
      description: "From people and vehicles to animals and everyday items",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Zap,
      title: "High Accuracy",
      description: "95%+ precision powered by the latest YOLO v8 neural network",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ]

  const stats = [
    { number: "80+", label: "Object Types", icon: Award, color: "text-orange-600" },
    { number: "95%+", label: "Detection Accuracy", icon: Target, color: "text-green-600" },
    { number: "<2s", label: "Processing Time", icon: Zap, color: "text-blue-600" },
    { number: "YOLO v8", label: "AI Model", icon: Brain, color: "text-purple-600" }
  ]

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section ref={ref} className="relative flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
        {/* Background Elements */}
        <motion.div
          style={{ y, opacity }}
          className="absolute top-8 right-8 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]), opacity }}
          className="absolute bottom-8 left-8 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
        />

        <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Powered by YOLO v8 AI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              AI Object Detection
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
              Upload any image and watch our advanced AI instantly identify and locate objects with 
              professional-grade accuracy. No setup required.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/detect">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Try Detection Now</span>
                  <ArrowRight className="w-3 h-3" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Watch Demo</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-xl shadow-2xl p-4 sm:p-6 border border-gray-100">
              {/* Mock Detection Interface */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Detection Results</h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">Processing</span>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg h-40 sm:h-48 overflow-hidden relative">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src="/homepagephoto.jpg" 
                      alt="Object Detection Preview" 
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                    
                    {/* Bounding boxes positioned to exactly match the objects in the image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative" style={{ width: '85%', height: '75%' }}>
                        {/* Car bounding box - positioned to cover the red car exactly */}
                        <div 
                          className="absolute border-2 border-green-500 bg-green-500/10 rounded"
                          style={{
                            left: '18%',     // Shift left more to accommodate larger size
                            top: '28%',      // Move up more for larger vertical size
                            width: '54%',    // Increased from 45% (about 20% more)
                            height: '66%'    // Increased from 55% (about 20% more)
                          }}
                        >
                          <div className="bg-green-500 text-white text-xs px-1 py-0.5 rounded absolute -top-5 left-0 whitespace-nowrap">
                            Car 87.8%
                          </div>
                        </div>
                        
                        {/* Person bounding box - positioned to cover the person exactly */}
                        <div 
                          className="absolute border-2 border-blue-500 bg-blue-500/10 rounded"
                          style={{
                            left: '66%',     // Slightly adjust for better positioning
                            top: '8%',       // Start even higher for more vertical stretch
                            width: '22%',    // Increased from 18% (about 20% more)
                            height: '90%'    // Increased from 75% (about 20% more)
                          }}
                        >
                          <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded absolute -top-5 left-0 whitespace-nowrap">
                            Person 94.2%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Person</span>
                    </div>
                    <span className="text-blue-600 font-semibold text-sm">94.2%</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Car</span>
                    </div>
                    <span className="text-green-600 font-semibold text-sm">87.8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
            >
              <Eye className="w-4 h-4" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -bottom-2 -left-2 bg-purple-600 text-white p-2 rounded-lg shadow-lg"
            >
              <Brain className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Powerful <span className="text-blue-600">AI Capabilities</span>
            </h2>
            <p className="text-gray-600">Technical specifications and features</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${stat.color}`} />
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 text-xs sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered detection system makes object identification effortless and accurate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                  <feature.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Experience AI Detection?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
              Upload your first image and see the magic happen in real-time
            </p>
            
            <Link to="/detect">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3"
              >
                <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Start Detecting Now</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
