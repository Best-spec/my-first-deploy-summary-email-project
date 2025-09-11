from django.urls import path
from main.views import views
from main.utils import load_files
from main.views import constants
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LogoutView
from django.conf import settings
from django.conf.urls.static import static
from main.services.aggregator.views import AggregateView
from . import debug
# from main.utils.load_data.csv.load_csv import LoadAllCSV


urlpatterns = [
    path('', views.index, name='index'),
    path("debug/db/", debug.db_summary),
    path("debug/db/<str:model_name>/", debug.list_model_data),
    path('login/', auth_views.LoginView.as_view(template_name='auth/login.html'), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('upload/', views.upload_file, name='upload_file'),
    path('load_files/', load_files.list_uploaded_files, name='load_file'),
    path('delete_file/', views.delete_uploaded_file, name='delete_file'),
    path('delete_all_files/', views.delete_all_files, name='delete_all_files'),
    path('analyze/', constants.analyze, name='analyze'),
    path('aggregate', AggregateView.as_view(), name='metrics-aggregate'),
    # path('get_period/', views.period, name='get_period'),
    # path("csv-summary/", LoadAllCSV.as_view(), name="csv-summary"),
]   + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)