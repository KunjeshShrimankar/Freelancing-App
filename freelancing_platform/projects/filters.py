import django_filters
from django.db.models import Q
from .models import Project

class ProjectFilter(django_filters.FilterSet):
    """
    Custom filter for Project model
    """
    keyword = django_filters.CharFilter(method='filter_keyword', label='Search by keyword')
    status = django_filters.ChoiceFilter(choices=Project.STATUS_CHOICES, label='Project status')
    min_budget = django_filters.NumberFilter(field_name='budget', lookup_expr='gte', label='Minimum budget')
    max_budget = django_filters.NumberFilter(field_name='budget', lookup_expr='lte', label='Maximum budget')
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte', label='Created after')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte', label='Created before')

    def filter_keyword(self, queryset, name, value):
        """
        Custom filter method to search in title and description
        """
        if value:
            return queryset.filter(
                Q(title__icontains=value) | 
                Q(description__icontains=value)
            )
        return queryset

    class Meta:
        model = Project
        fields = {
            'status': ['exact'],
            'created_at': ['gte', 'lte'],
        } 