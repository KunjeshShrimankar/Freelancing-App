from django.db import models
from users.models import User

class Project(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects', limit_choices_to={'role': 'client'})
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    skills_required = models.CharField(max_length=255, blank=True)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def status_display(self):
        return dict(self.STATUS_CHOICES).get(str(self.status), self.status)

    def __str__(self):
        return f"{self.title} ({self.status_display()})"

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications', limit_choices_to={'role': 'freelancer'})
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='applications')
    message = models.TextField()
    quote_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def status_display(self):
        return dict(self.STATUS_CHOICES).get(str(self.status), self.status)

    def __str__(self):
        return f"{self.user} - {self.project} ({self.status_display()})"
