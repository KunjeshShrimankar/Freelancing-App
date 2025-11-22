# API Documentation

## Base URL
```
http://localhost:8000/api/
```

## Authentication

The API uses JWT (JSON Web Token) Authentication. Include the token in the Authorization header:
```
Authorization: Bearer your_access_token_here
```

### JWT Token Flow
1. **Register/Login** → Get access and refresh tokens
2. **Use access token** → For API requests (expires in 1 hour)
3. **Refresh token** → Get new access token when expired
4. **Logout** → Blacklist refresh token

## Endpoints

### 1. User Registration

**POST** `/users/register/`

Register a new user account.

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123",
    "password_confirm": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "client",
    "phone_number": "+1234567890",
    "address": "123 Main St, City, Country",
    "bio": "I am a client looking for freelancers"
}
```

**Response (201 Created):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "username": "john",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "client",
        "phone_number": "+1234567890",
        "address": "123 Main St, City, Country",
        "bio": "I am a client looking for freelancers",
        "profile_picture": null,
        "date_of_birth": null,
        "is_verified": false,
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "role": "client"
}
```

### 2. User Login

**POST** `/users/login/`

Authenticate a user and get JWT tokens.

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response (200 OK):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "john",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "client",
        "phone_number": "+1234567890",
        "address": "123 Main St, City, Country",
        "bio": "I am a client looking for freelancers",
        "profile_picture": null,
        "date_of_birth": null,
        "is_verified": false,
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "role": "client"
}
```

### 3. Token Refresh

**POST** `/users/token/refresh/`

Get a new access token using refresh token.

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 4. User Logout

**POST** `/users/logout/`

Logout the current user and blacklist refresh token.

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Request Body:**
```json
{
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200 OK):**
```json
{
    "message": "Logout successful"
}
```

### 5. Get User Profile

**GET** `/users/profile/`

Get the current user's profile information.

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Response (200 OK):**
```json
{
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "client",
    "phone_number": "+1234567890",
    "address": "123 Main St, City, Country",
    "bio": "I am a client looking for freelancers",
    "profile_picture": null,
    "date_of_birth": null,
    "is_verified": false,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
}
```

### 6. Update User Profile

**PUT** `/users/profile/`

Update the current user's profile information.

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Request Body:**
```json
{
    "first_name": "John Updated",
    "last_name": "Doe Updated",
    "phone_number": "+1234567891",
    "address": "456 New St, City, Country",
    "bio": "Updated bio information"
}
```

**Response (200 OK):**
```json
{
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "first_name": "John Updated",
    "last_name": "Doe Updated",
    "role": "client",
    "phone_number": "+1234567891",
    "address": "456 New St, City, Country",
    "bio": "Updated bio information",
    "profile_picture": null,
    "date_of_birth": null,
    "is_verified": false,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:30:00Z"
}
```

### 7. Projects

#### Create Project (Client Only)

**POST** `/projects/`

Create a new project.

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Request Body:**
```json
{
    "title": "Website Development",
    "description": "Need a modern website for my business"
}
```

**Response (201 Created):**
```json
{
    "id": 1,
    "client": {
        "id": 1,
        "username": "john",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "role": "client"
    },
    "title": "Website Development",
    "description": "Need a modern website for my business",
    "status": "open",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
}
```

#### List Projects

**GET** `/projects/`

- **Clients**: See their own projects
- **Freelancers**: See all projects with search/filter capabilities
- **Admins**: See all projects

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Query Parameters:**
- `search`: Search in title and description
- `status`: Filter by status (open, in_progress, completed)
- `ordering`: Order by field (created_at, updated_at, title)
- `page`: Page number for pagination

**Example:**
```
GET /api/projects/?search=website&status=open&ordering=-created_at
```

**Response (200 OK):**
```json
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "client": {
                "id": 1,
                "username": "john",
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "role": "client"
            },
            "title": "Website Development",
            "description": "Need a modern website for my business",
            "status": "open",
            "created_at": "2024-01-01T12:00:00Z",
            "updated_at": "2024-01-01T12:00:00Z"
        }
    ]
}
```

#### Search Projects (Freelancer Only)

**GET** `/projects/search/`

Advanced search endpoint for freelancers to find projects.

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Query Parameters:**
- `keyword`: Search keyword in title and description
- `status`: Filter by project status (open, in_progress, completed)

**Example:**
```
GET /api/projects/search/?keyword=website&status=open
```

**Response (200 OK):**
```json
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "client": {
                "id": 1,
                "username": "john",
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "role": "client"
            },
            "title": "Website Development",
            "description": "Need a modern website for my business",
            "status": "open",
            "created_at": "2024-01-01T12:00:00Z",
            "updated_at": "2024-01-01T12:00:00Z",
            "application_count": 3
        }
    ]
}
```

### 8. Applications

#### Apply to Project (Freelancer Only)

**POST** `/applications/`

Apply to a project. **Note**: You can only apply once to each project.

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Request Body:**
```json
{
    "project_id": 1,
    "message": "I have experience in web development and would love to work on this project.",
    "quote_amount": "1500.00"
}
```

**Response (201 Created):**
```json
{
    "id": 1,
    "user": {
        "id": 2,
        "username": "jane",
        "email": "jane@example.com",
        "first_name": "Jane",
        "last_name": "Smith",
        "role": "freelancer"
    },
    "project": {
        "id": 1,
        "client": {
            "id": 1,
            "username": "john",
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "role": "client"
        },
        "title": "Website Development",
        "description": "Need a modern website for my business",
        "status": "open"
    },
    "message": "I have experience in web development and would love to work on this project.",
    "quote_amount": "1500.00",
    "status": "pending",
    "created_at": "2024-01-01T13:00:00Z",
    "updated_at": "2024-01-01T13:00:00Z"
}
```

**Response (400 Bad Request) - Already Applied:**
```json
{
    "project_id": ["You have already applied to this project."]
}
```

#### Check Application Status (Freelancer Only)

**GET** `/applications/check_application/?project_id=1`

Check if you have already applied to a specific project.

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Response (200 OK) - Already Applied:**
```json
{
    "project_id": "1",
    "has_applied": true,
    "message": "Already applied to this project"
}
```

**Response (200 OK) - Not Applied:**
```json
{
    "project_id": "1",
    "has_applied": false,
    "message": "Not applied yet"
}
```

#### List Applications

**GET** `/applications/`

- **Freelancers**: See their own applications
- **Clients**: See applications for their projects
- **Admins**: See all applications

**Headers:**
```
Authorization: Bearer your_access_token_here
```

### 9. Admin Endpoints

#### List All Users (Admin Only)

**GET** `/users/users/`

**Headers:**
```
Authorization: Bearer admin_access_token_here
```

**Response (200 OK):**
```json
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "username": "john",
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "role": "client"
        },
        {
            "id": 2,
            "username": "jane",
            "email": "jane@example.com",
            "first_name": "Jane",
            "last_name": "Smith",
            "role": "freelancer"
        }
    ]
}
```

#### Get Users by Role (Admin Only)

**GET** `/users/users/by_role/?role=client`

**Headers:**
```
Authorization: Bearer admin_access_token_here
```

## Role-Based Access Control

### Client Role
- ✅ Create projects
- ✅ View own projects
- ✅ View applications for own projects
- ✅ Update own projects
- ❌ Apply to projects
- ❌ View other clients' projects

### Freelancer Role
- ✅ View all projects with search/filter capabilities
- ✅ Search projects by keyword and status
- ✅ Apply to projects
- ✅ View own applications
- ❌ Create projects
- ❌ View other freelancers' applications

### Admin Role
- ✅ View all users, projects, and applications
- ✅ Manage all users, projects, and applications
- ✅ Access admin interface

## Error Responses

### 400 Bad Request
```json
{
    "error": "Invalid input data",
    "details": {
        "field_name": ["Error message"]
    }
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
    "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
    "error": "Internal server error"
}
```

## JWT Token Management

### Token Expiration
- **Access Token**: 1 hour
- **Refresh Token**: 7 days

### Token Refresh Process
1. When access token expires, use refresh token to get new access token
2. Send POST request to `/users/token/refresh/` with refresh token
3. Receive new access token
4. Continue using new access token

### Security Best Practices
- Store refresh tokens securely
- Never expose refresh tokens in client-side code
- Implement token rotation
- Use HTTPS in production
- Implement rate limiting

## Testing

You can test the API using tools like:
- cURL
- Postman
- Insomnia
- Django REST Framework's built-in browsable API

### Example cURL Commands

**Register:**
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "password_confirm": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "client"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Create Project (with JWT):**
```bash
curl -X POST http://localhost:8000/api/projects/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token_here" \
  -d '{
    "title": "Website Development",
    "description": "Need a modern website"
  }'
```

**Search Projects (Freelancer):**
```bash
curl -X GET "http://localhost:8000/api/projects/search/?keyword=website&status=open" \
  -H "Authorization: Bearer your_access_token_here"
```

**Filter Projects:**
```bash
curl -X GET "http://localhost:8000/api/projects/?search=development&status=open&ordering=-created_at" \
  -H "Authorization: Bearer your_access_token_here"
```

**Apply to Project:**
```bash
curl -X POST http://localhost:8000/api/applications/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token_here" \
  -d '{
    "project_id": 1,
    "message": "I have experience in web development",
    "quote_amount": "1500.00"
  }'
```

**Check Application Status:**
```bash
curl -X GET "http://localhost:8000/api/applications/check_application/?project_id=1" \
  -H "Authorization: Bearer your_access_token_here"
``` 