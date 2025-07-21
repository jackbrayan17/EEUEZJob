"""
Context processors pour l'application EEUEZJob
"""

from .models import UserThemePreference

def theme_context_processor(request):
    """
    Context processor pour ajouter le thème utilisateur à tous les templates
    """
    if request.user.is_authenticated:
        try:
            preference = UserThemePreference.objects.get(user=request.user)
            user_theme = preference.theme
        except UserThemePreference.DoesNotExist:
            # Créer une préférence par défaut si elle n'existe pas
            preference = UserThemePreference.objects.create(
                user=request.user,
                theme='light'
            )
            user_theme = 'light'
    else:
        user_theme = 'light'
    
    return {
        'user_theme': user_theme,
        'theme_choices': UserThemePreference.THEME_CHOICES,
        'is_dark_theme': user_theme == 'dark'
    }

def app_context_processor(request):
    """
    Context processor général pour l'application
    """
    return {
        'app_name': 'EEUEZJob',
        'app_version': '1.0.0',
        'support_email': 'support@eeuezjob.com'
    }

