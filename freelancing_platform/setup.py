#!/usr/bin/env python
"""
Setup script for Freelancing Platform Django project
This script helps automate the initial setup process
"""

import os
import sys
import subprocess
from pathlib import Path


def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False


def check_python_version():
    """Check if Python version is compatible"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True


def check_mysql_connection():
    """Check if MySQL is accessible"""
    print("🗄️  Checking MySQL connection...")
    try:
        import mysql.connector
        from decouple import config
        
        # Try to connect to MySQL
        connection = mysql.connector.connect(
            host=config('DB_HOST', default='localhost'),
            user=config('DB_USER', default='root'),
            password=config('DB_PASSWORD', default=''),
            port=config('DB_PORT', default=3306, cast=int)
        )
        connection.close()
        print("✅ MySQL connection successful")
        return True
    except Exception as e:
        print(f"❌ MySQL connection failed: {e}")
        print("Please make sure MySQL is running and credentials are correct in .env file")
        return False


def create_database():
    """Create the database if it doesn't exist"""
    print("🗄️  Creating database...")
    try:
        import mysql.connector
        from decouple import config
        
        connection = mysql.connector.connect(
            host=config('DB_HOST', default='localhost'),
            user=config('DB_USER', default='root'),
            password=config('DB_PASSWORD', default=''),
            port=config('DB_PORT', default=3306, cast=int)
        )
        
        cursor = connection.cursor()
        db_name = config('DB_NAME', default='freelancing_db')
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        connection.close()
        print("✅ Database created successfully")
        return True
    except Exception as e:
        print(f"❌ Database creation failed: {e}")
        return False


def main():
    """Main setup function"""
    print("🚀 Freelancing Platform Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check if we're in the right directory
    if not Path("manage.py").exists():
        print("❌ Please run this script from the project root directory")
        sys.exit(1)
    
    # Install dependencies
    if not run_command("pip install -r requirements.txt", "Installing dependencies"):
        sys.exit(1)
    
    # Check MySQL connection
    if not check_mysql_connection():
        print("⚠️  MySQL connection failed. Please check your .env file and MySQL server.")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Create database
    if not create_database():
        print("⚠️  Database creation failed. Please check your MySQL configuration.")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Run migrations
    if not run_command("python manage.py makemigrations", "Creating migrations"):
        sys.exit(1)
    
    if not run_command("python manage.py migrate", "Applying migrations"):
        sys.exit(1)
    
    # Test the setup
    if not run_command("python manage.py test_setup", "Testing setup"):
        print("⚠️  Setup test failed, but the project might still work")
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Create a superuser: python manage.py createsuperuser")
    print("2. Run the development server: python manage.py runserver")
    print("3. Access the admin interface at: http://localhost:8000/admin/")
    print("4. Test the API at: http://localhost:8000/api/users/")
    print("\nFor more information, see README.md and API_DOCUMENTATION.md")


if __name__ == "__main__":
    main() 