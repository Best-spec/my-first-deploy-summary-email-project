from django.contrib import admin
from .models import UploadedFile


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'file', 'uploaded_by', 'uploaded_at')
    search_fields = ('name',)
    list_filter = ('uploaded_at',)

