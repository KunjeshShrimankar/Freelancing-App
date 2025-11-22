from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, ApplicationViewSet, ProjectAnalyticsViewSet, client_stats, freelancer_stats, admin_stats, freelancers_applied_to_me, update_project_status, project_analytics, bulk_update_applications

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'project-analytics', ProjectAnalyticsViewSet, basename='project-analytics')

urlpatterns = [
    path('projects/update-project-status/', update_project_status, name='update-project-status'),
    path('projects/analytics/', project_analytics, name='project-analytics'),
    path('applications/bulk-update/', bulk_update_applications, name='bulk-update-applications'),
    path('stats/client/', client_stats, name='client-stats'),
    path('stats/freelancer/', freelancer_stats, name='freelancer-stats'),
    path('stats/admin/', admin_stats, name='admin-stats'),
    path('freelancers/applied_to_me/', freelancers_applied_to_me, name='freelancers-applied-to-me'),
    path('', include(router.urls)),
] 