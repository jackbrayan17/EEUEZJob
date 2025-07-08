from django.urls import path
from . import views

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
]