from rest_framework import serializers
from users.models import User
from users.serializers import UserProfileSerializer
from .models import Project, Application

class ProjectSerializer(serializers.ModelSerializer):
    client = UserProfileSerializer(read_only=True)
    client_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='client'), source='client', write_only=True, required=False)

    class Meta:
        model = Project
        fields = ['id', 'client', 'client_id', 'title', 'description', 'budget', 'skills_required', 'deadline', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'client', 'created_at', 'updated_at']

class ProjectSearchSerializer(serializers.ModelSerializer):
    """
    Serializer for project search results with additional metadata
    """
    client = UserProfileSerializer(read_only=True)
    application_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'client', 'title', 'description', 'status', 'created_at', 'updated_at', 'application_count']
        read_only_fields = ['id', 'client', 'status', 'created_at', 'updated_at', 'application_count']
    
    def get_application_count(self, obj):
        return obj.applications.count()

class ApplicationSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role='freelancer'), source='user', write_only=True, required=False)
    project = ProjectSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project', write_only=True)

    class Meta:
        model = Application
        fields = ['id', 'user', 'user_id', 'project', 'project_id', 'message', 'quote_amount', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'project', 'created_at', 'updated_at']

    def validate(self, attrs):
        """
        Validate that the user hasn't already applied to this project
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            project = attrs.get('project')
            
            if project and Application.objects.filter(user=user, project=project).exists():
                raise serializers.ValidationError({
                    'project_id': 'You have already applied to this project.'
                })
        
        return attrs 