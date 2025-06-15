from django.contrib import admin
from .models import UploadedFile

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('name', 'uploaded_at', 'analyzed')
    list_filter = ('analyzed', 'uploaded_at')
    search_fields = ('name',)
    ordering = ('-uploaded_at',)
