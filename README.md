# Object Detection Web Application

A modern, full-stack web application for real-time object detection using React, TailwindCSS, Framer Motion, and FastAPI with YOLO.

## 🌟 Features

- **Modern UI**: Clean and responsive design with TailwindCSS
- **Smooth Animations**: Beautiful transitions using Framer Motion
- **Real-time Detection**: Fast object detection using YOLO model
- **Interactive Upload**: Drag-and-drop or click to upload images
- **Detailed Results**: View detected objects with confidence scores and descriptions
- **Mobile Responsive**: Works seamlessly on all device sizes

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern JavaScript framework
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icon library

### Backend
- **FastAPI** - Modern Python web framework
- **YOLO** - State-of-the-art object detection model
- **OpenCV** - Computer vision library
- **Ultralytics** - YOLO implementation
- **Uvicorn** - ASGI server

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Git

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5174`

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Fix NumPy compatibility (if needed):**
   ```bash
   pip install "numpy<2" opencv-python-headless
   ```

4. **Start the FastAPI server:**
   ```bash
   python main.py
   ```

   The backend API will be available at `http://localhost:8000`

### Quick Start (Both Frontend and Backend)

You can start both servers simultaneously:
```bash
npm run start:full
```

## 🎯 Current Status

✅ **Completed Features:**
- Modern React frontend with beautiful UI
- TailwindCSS styling and responsive design
- Framer Motion animations
- Image upload with drag-and-drop support
- FastAPI backend with CORS configuration
- Mock object detection for demonstration
- Error handling and loading states

⚠️ **In Progress:**
- YOLO model integration (currently using mock data)
- Real object detection functionality

🔧 **Known Issues:**
- YOLO model loading requires PyTorch compatibility fixes
- Currently displays mock detection results

## 📁 Project Structure

```
SimpleObjectDetection/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   └── Card.jsx
│   │   ├── UploadCard.jsx
│   │   ├── ResultCard.jsx
│   │   └── Loader.jsx
│   ├── lib/
│   │   └── utils.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── backend/
│   ├── main.py
│   └── requirements.txt
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🎯 Usage

1. **Upload an Image**: Drag and drop an image or click to browse
2. **Preview**: View your image before processing
3. **Detect Objects**: Click "Detect Objects" to analyze the image
4. **View Results**: See detected objects with confidence scores and descriptions
5. **Analyze More**: Upload another image to continue detection

## 🔧 Configuration

### Frontend Configuration

The frontend is configured to communicate with the backend at `http://localhost:8000`. You can modify this in `src/App.jsx`:

```javascript
const response = await axios.post('http://localhost:8000/detect', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
```

### Backend Configuration

The backend can be configured in `backend/main.py`:

- **CORS origins**: Modify `allow_origins` in the CORS middleware
- **Model selection**: Change the YOLO model in the `load_model()` function
- **Server settings**: Adjust host and port in the `uvicorn.run()` call

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for custom colors and animations
- Update component styles in respective `.jsx` files
- Add custom CSS in `src/App.css`

### Object Descriptions
- Edit the `getObjectDescription()` function in `ResultCard.jsx` to add or modify object descriptions

### Animations
- Customize Framer Motion animations in component files
- Add new animation variants in `tailwind.config.js`

## 📊 API Endpoints

### GET `/`
- **Description**: Root endpoint
- **Response**: Welcome message

### GET `/health`
- **Description**: Health check endpoint
- **Response**: API status and model status

### POST `/detect`
- **Description**: Detect objects in an uploaded image
- **Parameters**: 
  - `file`: Image file (multipart/form-data)
- **Response**: 
  ```json
  {
    "status": "success",
    "predictions": [
      {
        "label": "person",
        "confidence": 0.95,
        "bbox": [100, 50, 300, 400]
      }
    ],
    "num_detections": 1
  }
  ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ultralytics](https://github.com/ultralytics/ultralytics) for the YOLO implementation
- [Tailwind Labs](https://tailwindcss.com/) for TailwindCSS
- [Framer](https://www.framer.com/motion/) for Framer Motion
- [FastAPI](https://fastapi.tiangolo.com/) for the amazing web framework

## 🐛 Issues

If you encounter any issues, please report them on the [GitHub Issues](https://github.com/your-username/object-detection-app/issues) page.

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
