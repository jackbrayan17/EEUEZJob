from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from core import views

urlpatterns = [
    path('', include('core.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('testimonial/', views.submit_testimonial, name='submit_testimonial'),
    path('profile/', views.profile, name='profile'),
    path('accounts/profile/', RedirectView.as_view(url='/profile/', permanent=True)),  # Redirige /accounts/profile/ vers /profile/
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


