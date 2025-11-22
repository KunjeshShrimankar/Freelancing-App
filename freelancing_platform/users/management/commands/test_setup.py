from django.core.management.base import BaseCommand
from django.db import connection
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Test the Django setup and database connection'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Testing Django setup...'))
        
        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                self.stdout.write(self.style.SUCCESS('✓ Database connection successful'))
            
            # Test User model
            user_count = User.objects.count()
            self.stdout.write(self.style.SUCCESS(f'✓ User model working (Total users: {user_count})'))
            
            # Test Django REST Framework
            from rest_framework import VERSION
            self.stdout.write(self.style.SUCCESS(f'✓ Django REST Framework {VERSION} installed'))
            
            # Test environment variables
            from django.conf import settings
            self.stdout.write(self.style.SUCCESS(f'✓ SECRET_KEY configured: {bool(settings.SECRET_KEY)}'))
            self.stdout.write(self.style.SUCCESS(f'✓ DEBUG mode: {settings.DEBUG}'))
            self.stdout.write(self.style.SUCCESS(f'✓ Database engine: {settings.DATABASES["default"]["ENGINE"]}'))
            
            self.stdout.write(self.style.SUCCESS('\n🎉 All tests passed! Django setup is working correctly.'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error during testing: {str(e)}'))
            raise 