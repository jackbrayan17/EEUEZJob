from pathlib import Path
import environ
import os

# Initialisation de environ pour les variables d'environnement
env = environ.Env()
environ.Env.read_env()

# Chemin de base du projet
BASE_DIR = Path(__file__).resolve().parent.parent

# Configuration de sécurité
SECRET_KEY = env('SECRET_KEY', default='django-insecure-kkh)wy2p1685hi%0dp5^izskku&+4pfy&3r7t5huwf3tvy6)v2')
DEBUG = env.bool('DEBUG', default=True)  # True pour développement, False pour production
# Clé API
API_KEY = "xai-wE0vtnp66nEpfptPswNV70iK5k7MWL23NOrh1yDL3CgglsOA8uu90A0hnxKHeKqVkDpYXK1oncqi8fTR"

# Hôtes autorisés
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['127.0.0.1', 'localhost', 'https://eeuezjob.onrender.com'])

# Applications installées
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',  # Application personnalisée
    'tailwind',
    'crispy_forms',
    'crispy_tailwind',
    'rest_framework',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dark',
]

# Configuration pour crispy forms
CRISPY_TEMPLATE_PACK = 'tailwind'

# Configuration pour django-tailwind
TAILWIND_APP_NAME = 'dark'

# Configuration pour django-allauth
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]
ACCOUNT_LOGIN_REDIRECT_URL = '/profile/'  # Redirige vers la vue personnalisée /profile/
ACCOUNT_LOGOUT_REDIRECT_URL = '/'  # Redirige vers la page d'accueil après déconnexion
ACCOUNT_LOGIN_METHODS = {'email', 'username'}  # Remplace ACCOUNT_AUTHENTICATION_METHOD
ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']  # Remplace ACCOUNT_EMAIL_REQUIRED
SITE_ID = 1  # Nécessaire pour django-allauth

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Doit être avant SessionMiddleware pour les fichiers statiques
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

# Configuration des URLs
ROOT_URLCONF = 'eeuezjob.urls'

# Configuration des templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Dossiers de templates personnalisés
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Application WSGI
WSGI_APPLICATION = 'eeuezjob.wsgi.application'

# Configuration de la base de données
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Validation des mots de passe
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalisation
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Fichiers statiques
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'  # Pour production avec Whitenoise

# Fichiers médias
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Clé primaire par défaut
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Paramètres de sécurité supplémentaires
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_SECURE = not DEBUG  # True en production avec HTTPS
SESSION_COOKIE_SECURE = not DEBUG  # True en production avec HTTPS

# Configuration email (optionnel, pour les notifications allauth)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Pour développement, affiche les emails dans la console
# Pour production, configurez avec un backend SMTP (ex. : Sendgrid, Gmail) :
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = env('EMAIL_HOST')
# EMAIL_PORT = env('EMAIL_PORT')
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = env('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')