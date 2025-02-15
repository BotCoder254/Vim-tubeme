# 🎬 YouTube Clone

A modern YouTube clone built with React! 🚀 This project replicates YouTube's core functionalities, including video playback, search, comments, and more!

## ✨ Features

✅ Watch YouTube videos 📺  
✅ Search for videos 🔍  
✅ View video details and descriptions 📝  
✅ Like/Dislike and comment on videos 👍👎  
✅ Responsive design for all devices 📱💻  
✅ Download videos and audio (MP4/MP3) ⬇️  
✅ Infinite scroll for video lists 📜  
✅ Real-time download progress tracking 📊  
✅ Suggested videos with infinite loading 🔄  
✅ Multi-language support 🌐  
✅ Docker containerization 🐳  

## 🛠️ Technologies Used

- ⚛️ **React** - UI development
- 🎨 **Tailwind CSS** - Styling
- 🔥 **React Router** - Navigation
- 📡 **Axios** - API requests
- 🎥 **React Player** - Video playback
- 🐳 **Docker** - Containerization
- 🌐 **Nginx** - Web server
- 📦 **ytdl-core** - Video processing

## 📂 Project Structure
```
📁 src
 ┣ 📂 api          # API requests
 ┣ 📂 components   # Reusable UI components
 ┣ 📂 pages        # Page components (Home, Detail, Search)
 ┣ 📂 styles       # CSS & Tailwind styles
 ┣ 📜 App.js       # Main application file
 ┗ 📜 index.js     # Entry point
```

## 🚀 Deployment Guide

### 🐳 Using Docker (Local Development)

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-clone
```

2. Start the application using Docker Compose:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- Backend: http://localhost:5000

### ☁️ Deploying to Render

1. Fork/Clone the repository to your GitHub account

2. Create a Render account at https://render.com

3. In Render Dashboard:
   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub repository
   - Click "Apply"

4. Render will automatically:
   - Deploy the frontend static site
   - Deploy the backend service
   - Set up environment variables
   - Configure networking

5. Access your deployed application:
   - Frontend: https://youtube-clone-frontend.onrender.com
   - Backend: https://youtube-clone-backend.onrender.com

### 🔧 Environment Variables

Frontend:
```env
VITE_API_URL=<backend-url>
```

Backend:
```env
NODE_ENV=production
PORT=5000
```

## 📸 Demo

![youtube-clone-demo](https://github.com/user-attachments/assets/93a24ac4-445b-41b8-bd1a-a572ffc05de8)


