from django.contrib import admin
from .models import UploadedFile

@admin.action(description='Delete File')
def delete_files_and_records(modeladmin, request, queryset):
    for obj in queryset:
        if obj.file:
            print(f"ลบไฟล์: {obj.file.name}")
            obj.file.delete(save=False)
        obj.delete()

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'file', 'uploaded_by', 'uploaded_at')
    search_fields = ('name',)
    list_filter = ('uploaded_at',)
    actions = [delete_files_and_records]

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions



