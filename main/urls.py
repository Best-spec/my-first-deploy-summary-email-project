from django.urls import path
from main.views import views
from main.views import index_views
from main.views import file_views
from main.views import analysis_views
from django.contrib.auth import views as django_auth_views
from django.conf import settings
from django.conf.urls.static import static
from main.services.aggregator.views import AggregateView
from main.views import auth_views as jwt_auth_views
from . import debug
# from main.utils.load_data.csv.load_csv import LoadAllCSV


urlpatterns = [
    # legacy api
    path('', views.index, name='index'),
    path("debug/db/", debug.db_summary),
    path("debug/db/<str:model_name>/", debug.list_model_data),
    path('login/', django_auth_views.LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('aggregate', AggregateView.as_view(), name='metrics-aggregate'),

    # new refector api for frontend integration
    path('api/index/', index_views.index, name='api_index'),
    path('api/auth/login/', jwt_auth_views.login_view, name='api_login'),
    path('api/auth/refresh/', jwt_auth_views.refresh_view, name='api_refresh'),
    path('api/auth/logout/', jwt_auth_views.logout_view, name='api_logout'),
    path('upload/', views.upload_file, name='upload_file'),
    path('load_files/', file_views.list_uploaded_files, name='load_file'),
    path('delete_file/', views.delete_uploaded_file, name='delete_file'),
    path('delete_all_files/', views.delete_all_files, name='delete_all_files'),
    path('analyze/', analysis_views.analyze, name='analyze'),

]   + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)