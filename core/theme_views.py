"""
Vues pour la gestion des thèmes utilisateur
"""

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views import View
import json
import logging
from django.conf import settings
from django.db import models

from .models import UserThemePreference

logger = logging.getLogger(__name__)

class ThemePreferenceView(View):
    """
    Vue pour gérer les préférences de thème utilisateur
    """
    
    @method_decorator(login_required)
    def get(self, request):
        """
        Récupère la préférence de thème de l'utilisateur
        """
        try:
            preference, created = UserThemePreference.objects.get_or_create(
                user=request.user,
                defaults={'theme': 'light'}
            )
            
            return JsonResponse({
                'success': True,
                'theme': preference.theme,
                'created': created
            })
            
        except Exception as e:
            logger.error(f"Erreur lors de la récupération du thème pour {request.user.username}: {e}")
            return JsonResponse({
                'success': False,
                'error': 'Erreur lors de la récupération du thème',
                'theme': 'light'  # Thème par défaut en cas d'erreur
            })
    
    @method_decorator(login_required)
    @method_decorator(csrf_exempt)
    def post(self, request):
        """
        Met à jour la préférence de thème de l'utilisateur
        """
        try:
            # Récupérer les données JSON
            data = json.loads(request.body)
            theme = data.get('theme', 'light')
            
            # Valider le thème
            valid_themes = ['light', 'dark', 'auto']
            if theme not in valid_themes:
                return JsonResponse({
                    'success': False,
                    'error': f'Thème invalide. Thèmes valides: {", ".join(valid_themes)}'
                })
            
            # Créer ou mettre à jour la préférence
            preference, created = UserThemePreference.objects.get_or_create(
                user=request.user,
                defaults={'theme': theme}
            )
            
            if not created:
                preference.theme = theme
                preference.save()
            
            logger.info(f"Thème mis à jour pour {request.user.username}: {theme}")
            
            return JsonResponse({
                'success': True,
                'theme': preference.theme,
                'message': 'Préférence de thème mise à jour avec succès'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Données JSON invalides'
            })
        except Exception as e:
            logger.error(f"Erreur lors de la mise à jour du thème pour {request.user.username}: {e}")
            return JsonResponse({
                'success': False,
                'error': 'Erreur lors de la mise à jour du thème'
            })

@login_required
@require_http_methods(["GET"])
def get_user_theme(request):
    """
    Vue simple pour récupérer le thème de l'utilisateur connecté
    """
    try:
        preference = UserThemePreference.objects.get(user=request.user)
        theme = preference.theme
    except UserThemePreference.DoesNotExist:
        # Créer une préférence par défaut
        preference = UserThemePreference.objects.create(
            user=request.user,
            theme='light'
        )
        theme = 'light'
    
    return JsonResponse({
        'success': True,
        'theme': theme
    })

@login_required
@require_http_methods(["POST"])
@csrf_exempt
def set_user_theme(request):
    """
    Vue simple pour définir le thème de l'utilisateur connecté
    """
    try:
        data = json.loads(request.body)
        theme = data.get('theme', 'light')
        
        # Valider le thème
        if theme not in ['light', 'dark', 'auto']:
            return JsonResponse({
                'success': False,
                'error': 'Thème invalide'
            })
        
        # Mettre à jour ou créer la préférence
        preference, created = UserThemePreference.objects.get_or_create(
            user=request.user,
            defaults={'theme': theme}
        )
        
        if not created:
            preference.theme = theme
            preference.save()
        
        return JsonResponse({
            'success': True,
            'theme': theme,
            'message': 'Thème mis à jour'
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la définition du thème: {e}")
        return JsonResponse({
            'success': False,
            'error': 'Erreur serveur'
        })

def get_theme_for_anonymous(request):
    """
    Vue pour les utilisateurs non connectés - retourne le thème par défaut
    """
    return JsonResponse({
        'success': True,
        'theme': 'light',
        'is_anonymous': True
    })

class ThemeStatsView(View):
    """
    Vue pour obtenir des statistiques sur l'utilisation des thèmes
    """
    
    @method_decorator(login_required)
    def get(self, request):
        """
        Retourne les statistiques d'utilisation des thèmes
        (accessible uniquement aux administrateurs)
        """
        if not request.user.is_staff:
            return JsonResponse({
                'success': False,
                'error': 'Accès non autorisé'
            })
        
        try:
            from django.db.models import Count
            
            stats = UserThemePreference.objects.values('theme').annotate(
                count=Count('theme')
            ).order_by('theme')
            
            total_users = UserThemePreference.objects.count()
            
            theme_stats = {}
            for stat in stats:
                theme_stats[stat['theme']] = {
                    'count': stat['count'],
                    'percentage': round((stat['count'] / total_users) * 100, 2) if total_users > 0 else 0
                }
            
            return JsonResponse({
                'success': True,
                'stats': theme_stats,
                'total_users': total_users
            })
            
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des statistiques: {e}")
            return JsonResponse({
                'success': False,
                'error': 'Erreur lors de la récupération des statistiques'
            })

# Context processor pour injecter le thème dans tous les templates
def theme_context_processor(request):
    """
    Context processor pour ajouter le thème utilisateur à tous les templates
    """
    if request.user.is_authenticated:
        try:
            preference = UserThemePreference.objects.get(user=request.user)
            user_theme = preference.theme
        except UserThemePreference.DoesNotExist:
            user_theme = 'light'
    else:
        user_theme = 'light'
    
    return {
        'user_theme': user_theme,
        'theme_choices': UserThemePreference.THEME_CHOICES
    }

# Middleware pour définir automatiquement le thème
class ThemeMiddleware:
    """
    Middleware pour définir automatiquement le thème dans les réponses
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Traitement avant la vue
        if request.user.is_authenticated:
            try:
                preference = UserThemePreference.objects.get(user=request.user)
                request.user_theme = preference.theme
            except UserThemePreference.DoesNotExist:
                request.user_theme = 'light'
        else:
            request.user_theme = 'light'
        
        response = self.get_response(request)
        
        # Traitement après la vue
        # Ajouter des en-têtes personnalisés si nécessaire
        if hasattr(request, 'user_theme'):
            response['X-User-Theme'] = request.user_theme
        
        return response

# Décorateur pour forcer un thème spécifique sur certaines vues
def force_theme(theme):
    """
    Décorateur pour forcer un thème spécifique sur une vue
    """
    def decorator(view_func):
        def wrapper(request, *args, **kwargs):
            request.forced_theme = theme
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

# Vue pour tester les thèmes (développement uniquement)
def theme_test_view(request):
    """
    Vue de test pour visualiser les différents thèmes
    (à utiliser uniquement en développement)
    """
    if not settings.DEBUG:
        return JsonResponse({
            'error': 'Cette vue n\'est disponible qu\'en mode développement'
        })
    
    theme = request.GET.get('theme', 'light')
    
    context = {
        'test_theme': theme,
        'available_themes': ['light', 'dark', 'auto']
    }
    
    return render(request, 'core/theme_test.html', context)

