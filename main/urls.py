from django.urls import path
from .views import views
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.index, name='index'),
    path('login/', auth_views.LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('upload/', views.upload_file, name='upload_file'),
    path('delete-file/<int:file_id>/', views.delete_file, name='delete_file'),
    path('analyze-all/', views.showDF_file, name='showDF_file'),
    path('test/', views.showtest, name='showtest'),
]   + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
