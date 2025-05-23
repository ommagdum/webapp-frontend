# ML-Based Spam Email Detection Web App (Frontend)

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

## Overview

A modern, responsive web application for detecting spam emails using machine learning. The frontend is built with React (Vite), Tailwind CSS, and integrates with a backend API for real-time spam detection and user management.

## ✨ Features

### Authentication & User Management
- 🔐 JWT-based authentication
- 👤 User registration with email verification
- 🔄 OAuth 2.0 support (Google)
- 🔄 Session management with token refresh
- 👥 Role-based access control (Admin/User)

### Spam Detection
- 📧 Real-time email content analysis
- 📊 Confidence scoring for predictions
- 📝 Detailed analysis results with explanations
- 🔄 History of past predictions with search/filter

### Dashboard
- 📈 User-specific statistics and analytics
- 📋 Interactive data visualizations
- 🔍 Search and filter prediction history
- 📱 Responsive design for all devices

### Admin Features
- 👥 User management interface
- 📊 System-wide statistics
- ⚙️ Application configuration

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Data Visualization**: Chart.js
- **Authentication**: JWT, OAuth 2.0
- **UI Components**: Headless UI, Heroicons

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Backend API server (see backend documentation)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd webapp-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your environment variables:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open **http://localhost:5173** in your browser.

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Auth/          # Authentication components
│   ├── admin/         # Admin-specific components
│   └── common/        # Shared components
├── context/           # React context providers
├── services/          # API services
└── utils/             # Utility functions
```

## 🔄 API Integration

The frontend communicates with the backend using the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify email
- `GET /oauth2/authorization/google` - Google OAuth

### Spam Detection
- `POST /api/predict` - Analyze email content
- `GET /api/predict/history` - Get prediction history
- `POST /api/feedback` - Submit feedback on predictions

### User Management (Admin)
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## 🧑‍💻 Development

- Use feature branches for new features
- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Update documentation when adding new features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the **LICENSE** file for details.

## 📬 Contact

For any questions or feedback, please open an issue or contact the maintainers.
