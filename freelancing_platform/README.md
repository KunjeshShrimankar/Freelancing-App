# Freelancing Platform - Backend

A robust Django REST API backend for a comprehensive freelancing platform that handles user management, project creation, and application processing.

## 🚀 Features

### 👥 User Management System
- **Multi-Role Authentication**: Admin, Client, and Freelancer roles
- **JWT Token Authentication**: Secure token-based authentication
- **Custom User Model**: Extended Django User model with role-based fields
- **User Registration & Login**: Complete authentication flow
- **Profile Management**: User profiles with bio, skills, and verification status
- **Role-Based Permissions**: Granular permission system

### 📋 Project Management
- **Project CRUD Operations**: Create, read, update, delete projects
- **Project Status Tracking**: Open, In Progress, Completed states
- **Budget Management**: Decimal field for precise budget tracking
- **Skills Requirements**: Tag-based skills system
- **Deadline Management**: Project timeline tracking
- **Client-Project Association**: Projects linked to specific clients

### 💼 Application System
- **Application Processing**: Freelancers can apply to projects
- **Status Management**: Pending, Accepted, Rejected states
- **Quote Amount**: Freelancer's proposed budget
- **Cover Letter**: Detailed application messages
- **Application Tracking**: Complete application lifecycle

### 🔍 Advanced Search & Filtering
- **Project Search**: Keyword-based project search
- **Advanced Filters**: Budget range, skills, status, date filters
- **Freelancer Search**: Role-based freelancer browsing
- **Application Filtering**: Status-based application filtering

### 📊 Analytics & Statistics
- **Client Statistics**: Project counts, budget totals, completion rates
- **Freelancer Statistics**: Application counts, success rates, earnings
- **Admin Dashboard**: Platform-wide analytics and monitoring
- **Real-time Data**: Live statistics and metrics

### 🔐 Security & Permissions
- **Custom Permission Classes**: Role-based access control
- **Object-Level Permissions**: Project and application ownership
- **API Security**: JWT token validation and refresh
- **CORS Configuration**: Cross-origin request handling

### 🌐 API Endpoints

#### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - User profile

#### Projects
- `GET /api/projects/` - List projects (role-filtered)
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}/` - Get project details
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project
- `GET /api/projects/search/` - Search projects (freelancers)

#### Applications
- `GET /api/applications/` - List applications (role-filtered)
- `POST /api/applications/` - Create application
- `GET /api/applications/{id}/` - Get application details
- `PUT /api/applications/{id}/` - Update application status
- `GET /api/applications/check_application/` - Check if applied

#### Users
- `GET /api/users/users/` - List all users (admin)
- `GET /api/users/users/by_role/` - Filter users by role
- `GET /api/users/users/{id}/` - Get user profile

#### Statistics
- `GET /api/stats/client/` - Client dashboard statistics
- `GET /api/stats/freelancer/` - Freelancer dashboard statistics
- `GET /api/stats/admin/` - Admin panel statistics

#### Freelancer Management
- `GET /api/freelancers/applied_to_me/` - Freelancers who applied to client's projects

## 🛠️ Technologies Used

### Core Framework
- **Django 4.2.7**: High-level Python web framework
- **Django REST Framework 3.14.0**: Powerful API development toolkit
- **Django Filter 23.5**: Advanced filtering capabilities

### Authentication & Security
- **Django REST Framework Simple JWT 5.3.0**: JWT authentication
- **Django CORS Headers 4.3.1**: Cross-origin resource sharing
- **Custom Permission Classes**: Role-based access control

### Database
- **MySQL 2.2.0**: Relational database management system
- **Django ORM**: Object-relational mapping
- **Database Migrations**: Version-controlled schema changes

### Configuration & Environment
- **Python Decouple 3.8**: Environment variable management
- **Django Settings**: Modular configuration system

## 📦 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- MySQL database server
- pip package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd freelancing_platform
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE freelancing_platform;
   ```

5. **Environment setup**
   Create a `.env` file:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   DATABASE_URL=mysql://user:password@localhost/freelancing_platform
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

6. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

## 🏗️ Project Structure

```
freelancing_platform/
├── freelancing_platform/
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   ├── asgi.py              # ASGI configuration
│   └── wsgi.py              # WSGI configuration
├── users/
│   ├── models.py            # Custom User model
│   ├── views.py             # User management views
│   ├── serializers.py       # User serializers
│   ├── urls.py              # User URL patterns
│   └── admin.py             # Admin interface
├── projects/
│   ├── models.py            # Project and Application models
│   ├── views.py             # Project management views
│   ├── serializers.py       # Project serializers
│   ├── filters.py           # Custom filters
│   ├── urls.py              # Project URL patterns
│   └── admin.py             # Admin interface
├── manage.py                # Django management script
└── requirements.txt         # Python dependencies
```

## 🔧 Configuration

### Database Configuration
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'freelancing_platform',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### JWT Configuration
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
```

### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## 🔐 Security Features

### Authentication System
- **JWT Tokens**: Access and refresh token system
- **Token Blacklisting**: Secure logout mechanism
- **Role-Based Access**: Custom permission classes
- **Object Permissions**: Project and application ownership

### Data Protection
- **Input Validation**: Comprehensive form validation
- **SQL Injection Prevention**: Django ORM protection
- **XSS Protection**: Built-in Django security
- **CSRF Protection**: Cross-site request forgery prevention

## 📊 API Documentation

### Authentication Flow
1. **Registration**: `POST /api/auth/register/`
2. **Login**: `POST /api/auth/login/`
3. **Token Refresh**: `POST /api/auth/token/refresh/`
4. **Logout**: `POST /api/auth/logout/`

### Project Management Flow
1. **Create Project**: `POST /api/projects/`
2. **List Projects**: `GET /api/projects/`
3. **Update Project**: `PUT /api/projects/{id}/`
4. **Delete Project**: `DELETE /api/projects/{id}/`

### Application Flow
1. **Apply to Project**: `POST /api/applications/`
2. **List Applications**: `GET /api/applications/`
3. **Update Status**: `PUT /api/applications/{id}/`

## 🚀 Deployment

### Production Settings
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
STATIC_ROOT = '/path/to/static/files'
```

### Environment Variables
```bash
export SECRET_KEY=your-production-secret-key
export DATABASE_URL=mysql://user:password@host/database
export DJANGO_SETTINGS_MODULE=freelancing_platform.settings
```

### WSGI Configuration
```python
# wsgi.py
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'freelancing_platform.settings')
application = get_wsgi_application()
```

## 🧪 Testing

```bash
python manage.py test
```

## 📝 API Testing

Use tools like:
- **Postman**: API testing and documentation
- **Django REST Framework browsable API**: Built-in API browser
- **curl**: Command-line API testing

## 🔍 Monitoring & Logging

### Django Admin
- Access at `/admin/`
- User management interface
- Project and application monitoring

### Custom Management Commands
```bash
python manage.py test_setup
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions, please contact the development team.

---

**Built with Django and Django REST Framework**