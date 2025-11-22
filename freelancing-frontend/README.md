# Freelancing Platform - Frontend

A modern React-based frontend for a comprehensive freelancing platform that connects clients with talented freelancers worldwide.

## 🚀 Features

### 🏠 Home Page
- **Hero Section**: Eye-catching landing page with call-to-action buttons
- **Responsive Design**: Mobile-first approach with Bootstrap grid system
- **Feature Cards**: Showcase platform capabilities (Post Jobs, Browse Talent, Secure Payments)
- **User-Friendly Navigation**: Intuitive navbar with role-based visibility

### 👥 User Authentication & Authorization
- **Multi-Role System**: Admin, Client, and Freelancer roles
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based access control
- **User Profile Management**: Complete user profile with avatar support

### 🎯 Client Dashboard
- **Project Management**: Create, view, and manage projects
- **Application Tracking**: Review and manage freelancer applications
- **Statistics Dashboard**: Real-time project and budget analytics
- **Post Job Modal**: Quick project creation from navbar
- **Currency Display**: Indian Rupees (₹) formatting
- **Project Filtering**: View only own projects

### 💼 Freelancer Dashboard
- **Project Discovery**: Browse and search available projects
- **Advanced Filtering**: Filter by budget, skills, status, and keywords
- **Application Management**: Track application status and history
- **AI-Powered Proposals**: Generate professional cover letters
- **Real-time Statistics**: Application success rates and earnings
- **Smart Search**: Keyword-based project search

### 🔍 Browse Freelancers
- **Client-Specific View**: Clients see only freelancers who applied to their projects
- **Admin View**: Admins can browse all freelancers
- **Profile Cards**: Detailed freelancer information
- **Application History**: Track freelancer engagement

### 👨‍💼 Admin Panel
- **User Management**: Activate/deactivate users, view all profiles
- **Project Oversight**: Monitor all projects and applications
- **System Statistics**: Comprehensive platform analytics
- **Tabbed Interface**: Organized data presentation
- **Real-time Monitoring**: Track platform activity

### 🎨 UI/UX Features
- **Bootstrap 5**: Modern, responsive design framework
- **React Bootstrap**: Pre-built React components
- **Custom Styling**: Enhanced CSS with animations and hover effects
- **Toast Notifications**: User feedback system
- **Loading States**: Professional loading indicators
- **Error Handling**: Graceful error display

## 🛠️ Technologies Used

### Core Framework
- **React 18.2.0**: Modern JavaScript library for building user interfaces
- **React Router DOM 6.23.0**: Client-side routing
- **React Bootstrap 2.10.2**: Bootstrap components for React

### Styling & UI
- **Bootstrap 5.3.3**: CSS framework for responsive design
- **FontAwesome**: Icon library
- **React Icons 5.5.0**: Additional icon components
- **Custom CSS**: Enhanced styling with animations

### HTTP & State Management
- **Axios 1.6.7**: HTTP client for API communication
- **React Context API**: Global state management
- **Local Storage**: Token and user data persistence

### Development Tools
- **React Scripts 5.0.1**: Development and build tools
- **ESLint**: Code linting and formatting
- **Web Vitals**: Performance monitoring

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelancing-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Project Structure

```
src/
├── auth/
│   └── AuthContext.js          # Authentication context
├── components/
│   ├── FormValidation.js       # Form validation utilities
│   ├── Navbar.js              # Main navigation component
│   ├── NotificationCard.js     # Notification components
│   ├── ProfileCard.js          # User profile display
│   └── StatsCard.js           # Statistics display
├── pages/
│   ├── AdminPanel.js          # Admin dashboard
│   ├── BrowseFreelancers.jsx  # Freelancer browsing
│   ├── ClientDashboard.js     # Client dashboard
│   ├── FreelancerDashboard.js # Freelancer dashboard
│   ├── HomePage.jsx           # Landing page
│   ├── Login.js               # Login page
│   ├── NotFound.js            # 404 page
│   └── Signup.js              # Registration page
├── App.js                     # Main application component
├── index.js                   # Application entry point
└── index.css                  # Global styles
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_BACKEND_URL=http://localhost:8000
```

### API Integration
- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT tokens stored in localStorage
- **CORS**: Configured for cross-origin requests

## 🎯 Key Features Implementation

### Role-Based Access Control
- **Protected Routes**: Different dashboards for each user role
- **Conditional Rendering**: UI elements based on user permissions
- **Navigation Guards**: Automatic redirects for unauthorized access

### Real-time Data Management
- **API Integration**: RESTful API communication
- **State Management**: React Context for global state
- **Error Handling**: Comprehensive error handling and user feedback

### Responsive Design
- **Mobile-First**: Bootstrap grid system
- **Breakpoint Optimization**: Responsive across all devices
- **Touch-Friendly**: Optimized for mobile interactions

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Static Hosting
The build folder can be deployed to:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

## 🔍 Testing

```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please contact the development team.

---

**Built with React and Bootstrap** 