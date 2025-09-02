from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
# Create your models here.

class UploadedFile(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(default=timezone.now)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-uploaded_at']
