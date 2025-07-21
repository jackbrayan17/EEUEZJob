from django.urls import path
from . import views
from .theme_views import (
    ThemePreferenceView, 
    get_user_theme, 
    set_user_theme, 
    get_theme_for_anonymous,
    ThemeStatsView,
    theme_test_view
)

urlpatterns = [
    path('', views.home, name='home'),
    path('profile/create/', views.candidate_profile_create, name='candidate_profile_create'),
    path('recruiter/profile/create/', views.recruiter_profile_create, name='recruiter_profile_create'),
    path('profile/delete/', views.profile_delete, name='profile_delete'),
    path('jobs/', views.job_offer_list, name='job_offer_list'),
    path('jobs/<int:pk>/', views.job_offer_detail, name='job_offer_detail'),
    path('messages/', views.message_list, name='message_list'),
    path('testimonial/', views.submit_testimonial, name='submit_testimonial'),
    path('profile/', views.profile, name='profile'),
    
    # URLs pour la gestion des thèmes
    path('api/theme/', ThemePreferenceView.as_view(), name='theme_preference'),
    path('api/theme/get/', get_user_theme, name='get_user_theme'),
    path('api/theme/set/', set_user_theme, name='set_user_theme'),
    path('api/theme/anonymous/', get_theme_for_anonymous, name='get_theme_anonymous'),
    path('api/theme/stats/', ThemeStatsView.as_view(), name='theme_stats'),
    path('theme/test/', theme_test_view, name='theme_test'),
]

