from django.urls import path
from core import views

# URLs pour le thème sombre - préfixées par /dark/
urlpatterns = [
    path('', views.home_dark, name='home_dark'),
    path('profile/create/', views.candidate_profile_create_dark, name='candidate_profile_create_dark'),
    path('recruiter/profile/create/', views.recruiter_profile_create_dark, name='recruiter_profile_create_dark'),
    path('profile/delete/', views.profile_delete_dark, name='profile_delete_dark'),
    path('jobs/', views.job_offer_list_dark, name='job_offer_list_dark'),
    path('jobs/<int:pk>/', views.job_offer_detail_dark, name='job_offer_detail_dark'),
    path('messages/', views.message_list_dark, name='message_list_dark'),
    path('testimonial/', views.submit_testimonial_dark, name='submit_testimonial_dark'),
    path('profile/', views.profile_dark, name='profile_dark'),
]