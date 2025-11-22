from rest_framework import viewsets, permissions, status, filters, serializers
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.db import models
from .models import Project, Application
from .serializers import ProjectSerializer, ProjectSearchSerializer, ApplicationSerializer
from .filters import ProjectFilter
from users.models import User
from rest_framework.permissions import IsAuthenticated, BasePermission
from django.views.generic import View
from django.http import HttpResponse
import os
from datetime import datetime
from users.serializers import UserProfileSerializer

class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'client'

class IsFreelancer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'freelancer'

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsClientOrFreelancerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            (getattr(request.user, 'role', None) in ['client', 'freelancer', 'admin'])
        )

class IsAdminOrClientOrFreelancer(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            (getattr(request.user, 'role', None) in ['admin', 'client', 'freelancer'])
        )

class IsProjectOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow admin
        if hasattr(request.user, 'role') and request.user.role == 'admin':
            return True
        # Allow client if they own the project
        return hasattr(obj, 'project') and obj.project.client == request.user

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProjectFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action == 'create':
            return [IsClient()]
        elif self.action in ['list', 'retrieve', 'search']:
            return [IsClientOrFreelancerOrAdmin()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsClient(), IsAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'client':
                return Project.objects.filter(client=user)
            elif user.role in ['freelancer', 'admin']:
                return Project.objects.all()
        return Project.objects.none()

    @action(detail=False, methods=['get'], permission_classes=[IsFreelancer])
    def search(self, request):
        """
        Custom search endpoint for freelancers to search projects
        """
        queryset = self.get_queryset()
        
        # Get search parameters
        keyword = request.query_params.get('keyword', '')
        status_filter = request.query_params.get('status', '')
        
        # Apply search filter
        if keyword:
            queryset = queryset.filter(
                Q(title__icontains=keyword) | 
                Q(description__icontains=keyword)
            )
        
        # Apply status filter
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Order by creation date (newest first)
        queryset = queryset.order_by('-created_at')
        
        # Paginate results
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = ProjectSearchSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProjectSearchSerializer(queryset, many=True)
        return Response(serializer.data)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsFreelancer()]
        elif self.action in ['list', 'retrieve']:
            return [IsAdminOrClientOrFreelancer()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsProjectOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        return super().partial_update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[IsFreelancer])
    def check_application(self, request):
        """
        Check if the current user has already applied to a specific project
        """
        project_id = request.query_params.get('project_id')
        if not project_id:
            return Response({'error': 'project_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            project = Project.objects.get(id=project_id)
            has_applied = Application.objects.filter(user=request.user, project=project).exists()
            return Response({
                'project_id': project_id,
                'has_applied': has_applied,
                'message': 'Already applied to this project' if has_applied else 'Not applied yet'
            })
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'freelancer':
                return Application.objects.filter(user=user)
            elif user.role == 'client':
                return Application.objects.filter(project__client=user)
            elif user.role == 'admin':
                return Application.objects.all()
        return Application.objects.none()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def client_stats(request):
    user = request.user
    if user.role != 'client':
        return Response({'detail': 'Not authorized.'}, status=403)
    projects = Project.objects.filter(client=user)
    total_projects = projects.count()
    total_budget = sum([getattr(p, 'budget', 0) for p in projects])
    active_projects = projects.filter(status='in_progress').count()
    completed_projects = projects.filter(status='completed').count()
    
    print(f"DEBUG: Client {user.id} stats - Total: {total_projects}, Active: {active_projects}, Completed: {completed_projects}")
    print(f"DEBUG: Project statuses: {list(projects.values_list('id', 'status'))}")
    
    return Response({
        'total_projects': total_projects,
        'total_budget': total_budget,
        'active_projects': active_projects,
        'completed_projects': completed_projects,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def freelancer_stats(request):
    user = request.user
    if user.role != 'freelancer':
        return Response({'detail': 'Not authorized.'}, status=403)
    applications = Application.objects.filter(user=user)
    completed_projects = applications.filter(project__status='completed').count()
    active_projects = applications.filter(project__status='in_progress').count()
    total_applications = applications.count()
    # Use 'quote_amount' for earnings, not 'proposed_budget'
    total_earnings = applications.filter(status='accepted').aggregate(
        total=models.Sum('quote_amount'))['total'] or 0
    return Response({
        'total_earnings': total_earnings,
        'completed_projects': completed_projects,
        'active_projects': active_projects,
        'total_applications': total_applications,
    })

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_stats(request):
    # Total users
    total_users = User.objects.count()
    # Total projects
    total_projects = Project.objects.count()
    # Total applications
    total_applications = Application.objects.count()
    # Total transactions (sum of accepted application quote_amounts)
    total_transactions = Application.objects.filter(status='accepted').aggregate(total=models.Sum('quote_amount'))['total'] or 0
    # New users this month
    now = datetime.now()
    new_users_this_month = User.objects.filter(created_at__year=now.year, created_at__month=now.month).count()
    # New projects this month
    new_projects_this_month = Project.objects.filter(created_at__year=now.year, created_at__month=now.month).count()
    # New applications this month
    new_applications_this_month = Application.objects.filter(created_at__year=now.year, created_at__month=now.month).count()
    # Pending approvals (applications with status 'pending')
    pending_approvals = Application.objects.filter(status='pending').count()
    return Response({
        'total_users': total_users,
        'total_projects': total_projects,
        'total_applications': total_applications,
        'total_transactions': total_transactions,
        'new_users_this_month': new_users_this_month,
        'new_projects_this_month': new_projects_this_month,
        'new_applications_this_month': new_applications_this_month,
        'pending_approvals': pending_approvals,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def freelancers_applied_to_me(request):
    user = request.user
    if getattr(user, 'role', None) != 'client':
        return Response({'detail': 'Not authorized.'}, status=403)
    # Get all projects for this client
    projects = Project.objects.filter(client=user)
    # Get all applications to these projects
    applications = Application.objects.filter(project__in=projects)
    # Get unique freelancer users
    freelancer_ids = applications.values_list('user', flat=True).distinct()
    freelancers = User.objects.filter(id__in=freelancer_ids)
    serializer = UserProfileSerializer(freelancers, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_project_status(request):
    """
    Allow freelancers to update project status after being accepted
    """
    user = request.user
    if user.role != 'freelancer':
        return Response({'detail': 'Only freelancers can update project status.'}, status=status.HTTP_403_FORBIDDEN)
    
    project_id = request.data.get('project_id')
    new_status = request.data.get('status')
    
    print(f"DEBUG: User {user.id} ({user.role}) trying to update project {project_id} to status {new_status}")
    
    if not project_id or not new_status:
        return Response({'detail': 'project_id and status are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if new_status not in ['in_progress', 'completed']:
        return Response({'detail': 'Status must be either "in_progress" or "completed".'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check if freelancer has an accepted application for this project
        application = Application.objects.get(
            user=user,
            project_id=project_id,
            status='accepted'
        )
        
        print(f"DEBUG: Found accepted application for project {project_id}")
        
        # Update project status
        project = application.project
        old_status = project.status
        project.status = new_status
        project.save()
        
        print(f"DEBUG: Project status updated from {old_status} to {new_status}")
        
        return Response({
            'message': f'Project status updated to {new_status}',
            'project_id': project_id,
            'status': new_status
        })
        
    except Application.DoesNotExist:
        print(f"DEBUG: No accepted application found for project {project_id}")
        return Response({'detail': 'No accepted application found for this project.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"DEBUG: Error updating project status: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_analytics(request):
    """
    Get detailed analytics for a specific project
    """
    project_id = request.query_params.get('project_id')
    if not project_id:
        return Response({'error': 'project_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        project = Project.objects.get(id=project_id)
        
        # Check if user has permission to view this project
        if request.user.role == 'client' and project.client != request.user:
            return Response({'error': 'Not authorized to view this project'}, status=status.HTTP_403_FORBIDDEN)
        
        # Get analytics data
        total_applications = project.applications.count()
        accepted_applications = project.applications.filter(status='accepted').count()
        pending_applications = project.applications.filter(status='pending').count()
        rejected_applications = project.applications.filter(status='rejected').count()
        
        # Calculate average quote amount
        avg_quote = project.applications.aggregate(
            avg=models.Avg('quote_amount')
        )['avg'] or 0
        
        return Response({
            'project_id': project_id,
            'project_title': project.title,
            'total_applications': total_applications,
            'accepted_applications': accepted_applications,
            'pending_applications': pending_applications,
            'rejected_applications': rejected_applications,
            'average_quote_amount': avg_quote,
            'project_status': project.status,
            'created_at': project.created_at,
        })
        
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_update_applications(request):
    """
    Bulk update application statuses (for clients)
    """
    user = request.user
    if user.role != 'client':
        return Response({'error': 'Only clients can bulk update applications'}, status=status.HTTP_403_FORBIDDEN)
    
    application_ids = request.data.get('application_ids', [])
    new_status = request.data.get('status')
    
    if not application_ids or not new_status:
        return Response({'error': 'application_ids and status are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if new_status not in ['accepted', 'rejected']:
        return Response({'error': 'Status must be either "accepted" or "rejected"'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get applications that belong to user's projects
    applications = Application.objects.filter(
        id__in=application_ids,
        project__client=user
    )
    
    updated_count = applications.update(status=new_status)
    
    return Response({
        'message': f'Successfully updated {updated_count} applications to {new_status}',
        'updated_count': updated_count,
        'status': new_status
    })

class FrontendAppView(View):
    def get(self, request):
        from django.conf import settings
        import os
        index_path = os.path.join(settings.BASE_DIR, 'freelancing-frontend', 'build', 'index.html')
        try:
            with open(index_path) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse(
                "index.html not found! Build your React app and place it in the correct directory.",
                status=501,
            )

class ProjectAnalyticsViewSet(viewsets.ViewSet):
    """
    Custom ViewSet for project analytics
    """
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """
        Get analytics for all projects of the current user
        """
        user = request.user
        if user.role == 'client':
            projects = Project.objects.filter(client=user)
        elif user.role == 'admin':
            projects = Project.objects.all()
        else:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        analytics = []
        for project in projects:
            total_apps = project.applications.count()
            accepted_apps = project.applications.filter(status='accepted').count()
            avg_quote = project.applications.aggregate(
                avg=models.Avg('quote_amount')
            )['avg'] or 0
            
            analytics.append({
                'project_id': project.id,
                'project_title': project.title,
                'total_applications': total_apps,
                'accepted_applications': accepted_apps,
                'average_quote': avg_quote,
                'status': project.status,
            })
        
        return Response(analytics)
    
    def retrieve(self, request, pk=None):
        """
        Get detailed analytics for a specific project
        """
        try:
            project = Project.objects.get(id=pk)
            
            # Check permissions
            if request.user.role == 'client' and project.client != request.user:
                return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
            
            # Get detailed analytics
            applications = project.applications.all()
            total_applications = applications.count()
            accepted_applications = applications.filter(status='accepted').count()
            pending_applications = applications.filter(status='pending').count()
            rejected_applications = applications.filter(status='rejected').count()
            
            # Calculate statistics
            avg_quote = applications.aggregate(avg=models.Avg('quote_amount'))['avg'] or 0
            min_quote = applications.aggregate(min=models.Min('quote_amount'))['min'] or 0
            max_quote = applications.aggregate(max=models.Max('quote_amount'))['max'] or 0
            
            return Response({
                'project': {
                    'id': project.id,
                    'title': project.title,
                    'description': project.description,
                    'budget': project.budget,
                    'status': project.status,
                    'created_at': project.created_at,
                },
                'analytics': {
                    'total_applications': total_applications,
                    'accepted_applications': accepted_applications,
                    'pending_applications': pending_applications,
                    'rejected_applications': rejected_applications,
                    'average_quote': avg_quote,
                    'minimum_quote': min_quote,
                    'maximum_quote': max_quote,
                    'acceptance_rate': (accepted_applications / total_applications * 100) if total_applications > 0 else 0,
                }
            })
            
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
