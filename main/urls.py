from django.urls import path
from main.views import views
from main.views import load_files
from main.views import plot_all
from main.views import constants
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.index, name='index'),
    path('login/', auth_views.LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('upload/', views.upload_file, name='upload_file'),
    path('load_files/', load_files.list_uploaded_files, name='load_file'),
    path('delete_file/', views.delete_uploaded_file, name='delete_file'),
    path('analyze-all/', views.showDF_file, name='showDF_file'),
    # path('plot_all/', plot_all.plot_all, name='plot_all'),
    path('analyze/', constants.analyze, name='analyze'),
    path('test/', views.showtest, name='showtest'),
]   + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
