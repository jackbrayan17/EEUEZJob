from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from core import views

# Liste des URL patterns
urlpatterns = [
    # Page d'accueil redirigée vers les routes de l'application core
    path('', include('core.urls')),

    # Interface d'administration
    path('admin/', admin.site.urls),

    # Gestion des comptes avec allauth
    path('accounts/', include('allauth.urls')),

    # Redirection de /accounts/profile/ vers /profile/
    path('accounts/profile/', RedirectView.as_view(url='/profile/', permanent=True)),

    # Soumission de témoignage
    path('testimonial/', views.submit_testimonial, name='submit_testimonial'),

    # Affichage du profil utilisateur
    path('profile/', views.profile, name='profile'),

    # Interface du chatbot IA
    path('chatbot/', views.ai_chatbot, name='ai_chatbot'),

    # Liste des offres d'emploi avec tri par IA
    path('jobs/', views.job_offer_list, name='job_offer_list'),

    # Détail d'une offre d'emploi
    path('jobs/<int:pk>/', views.job_offer_detail, name='job_offer_detail'),

    # Création ou modification du profil candidat
    path('profile/create/', views.candidate_profile_create, name='candidate_profile_create'),

    # Liste des messages (section privée)
    path('messages/', views.message_list, name='message_list'),
]

# Ajout des URL pour les fichiers média en mode développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
