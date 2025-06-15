from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', views.upload_file, name='upload_file'),
    path('delete-file/<int:file_id>/', views.delete_file, name='delete_file'),
    path('analyze-all/', views.showDF_file, name='showDF_file'),
    path('test/', views.showtest, name='showtest'),
]
