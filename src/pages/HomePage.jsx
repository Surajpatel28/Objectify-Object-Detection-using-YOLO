import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Camera, Target, Zap, Brain, Sparkles, ArrowRight, Play, Star, TrendingUp, Users, Award, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Target,
      title: "95%+ Accuracy",
      description: "State-of-the-art YOLO model with industry-leading precision",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Lightning-fast detection in under 2 seconds per image",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Brain,
      title: "Deep Learning AI",
      description: "Advanced neural networks trained on millions of images",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Sparkles,
      title: "80+ Object Classes",
      description: "Detect people, vehicles, animals, and everyday objects",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ]

  const stats = [
    { number: "1M+", label: "Images Analyzed", icon: Camera },
    { number: "99.9%", label: "Uptime", icon: TrendingUp },
    { number: "50K+", label: "Happy Users", icon: Users },
    { number: "80+", label: "Object Types", icon: Award }
  ]

  const capabilities = [
    "Person and face detection",
    "Vehicle identification (cars, trucks, motorcycles)",
    "Animal recognition (dogs, cats, birds, etc.)",
    "Sports equipment detection",
    "Household objects identification",
    "Traffic signs and lights",
    "Food and beverage recognition",
    "Electronic devices detection"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo and Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Camera className="w-16 h-16 text-white" />
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight"
            >
              Next-Generation
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Object Detection
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Harness the power of advanced AI to identify, analyze, and understand objects in your images with 
              <span className="font-bold text-blue-600"> unprecedented accuracy</span> and 
              <span className="font-bold text-purple-600"> lightning speed</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <Link to="/detect">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-4 text-xl"
                >
                  <Camera className="w-8 h-8" />
                  <span>Start Detecting</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-bold py-6 px-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-4 text-xl"
              >
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className={`flex items-center space-x-3 ${feature.bgColor} backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50 shadow-lg cursor-pointer`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  <span className="font-semibold text-gray-800">{feature.title}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 py-16 bg-white/60 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Powered by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Advanced AI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our cutting-edge deep learning models deliver unmatched performance across a wide range of object detection tasks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Can We Detect?</h2>
            <p className="text-xl text-blue-100 mb-12">
              Our AI recognizes 80+ different object classes with exceptional accuracy
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                  <span className="text-white font-medium">{capability}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Upload your first image and see our AI in action. No registration required.
            </p>
            
            <Link to="/detect">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 px-16 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-4 mx-auto text-xl"
              >
                <Sparkles className="w-8 h-8" />
                <span>Try It Now - It's Free!</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="w-6 h-6" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
