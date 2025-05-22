# 🔐 MLBSED Webapp Frontend

A modern authentication and admin management system with React-based dashboard features.

## 🚀 Features

- **🔑 JWT Authentication**  
  Secure user sessions with token-based authentication
- **👥 Role-Based Access Control**  
  Admin/User permissions system with protected routes
- **📊 Real-Time System Monitoring**  
  Live stats dashboard with usage metrics
- **👮 User Management**  
  Admin panel for granular user control (v2 feature)
- **📈 Prediction History**  
  Track spam detection analysis over time

## ⚙️ Installation

```bash
git clone https://github.com/ommagdum/webapp-frontend.git
cd webapp-frontend
npm install
```

## 🔧 Configuration

1. Create `.env` file:
```bash
cp .env.example .env
```
2. Set your API endpoints:
```ini
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_FEATURES=true # Enable admin panel
```

## 🖥️ Running the App
```bash
npm run dev
```

## 🤝 Contributing
```bash
git checkout -b feature/your-feature
# Make changes then
git push origin feature/your-feature
```

## 📄 License
MIT © 2025 Om Magdum
