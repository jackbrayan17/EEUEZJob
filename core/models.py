from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Modèle pour les catégories d'offres d'emploi (ex: Technologie, Santé)
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"

# Modèle pour les préférences de thème utilisateur
class UserThemePreference(models.Model):
    THEME_CHOICES = [
        ('light', 'Clair'),
        ('dark', 'Sombre'),
        ('auto', 'Automatique'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='theme_preference')
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='light')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Thème de {self.user.username}: {self.get_theme_display()}"

    class Meta:
        verbose_name = "Préférence de thème"
        verbose_name_plural = "Préférences de thème"

# Modèle pour les profils candidats
class CandidateProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidate_profile')
    full_name = models.CharField(max_length=200)
    skills = models.TextField(blank=True)  # Compétences séparées par des virgules
    years_experience = models.PositiveIntegerField(default=0)
    education = models.TextField(blank=True)  # Formations
    cv_file = models.FileField(upload_to='cvs/', blank=True, null=True)  # Fichier CV
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    social_links = models.JSONField(blank=True, null=True)  # Liens réseaux sociaux
    is_sponsored = models.BooleanField(default=False)  # Profil sponsorisé
    created_at = models.DateTimeField(default=timezone.now)
    sectors = models.ManyToManyField(Category, blank=True)  # Ajout de ce champ

    def __str__(self):
        return f"Profil de {self.full_name}"

    class Meta:
        verbose_name = "Profil Candidat"
        verbose_name_plural = "Profils Candidats"

# Modèle pour les comptes recruteurs
class RecruiterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    company_name = models.CharField(max_length=200)
    company_description = models.TextField(blank=True)
    is_validated = models.BooleanField(default=False)  # Validation par EEUEZJob
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Recruteur: {self.company_name}"

    class Meta:
        verbose_name = "Profil Recruteur"
        verbose_name_plural = "Profils Recruteurs"

# Modèle pour les offres d'emploi
class JobOffer(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    location = models.CharField(max_length=100)
    salary = models.CharField(max_length=100, blank=True)  # Ex: "50,000 FCFA/mois"
    experience_required = models.CharField(max_length=100, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_offers')
    is_validated = models.BooleanField(default=False)  # Validation par personnel
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Offre d'emploi"
        verbose_name_plural = "Offres d'emploi"

# Modèle pour les candidatures
class Application(models.Model):
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='applications')
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, choices=[
        ('pending', 'En attente'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Rejetée'),
    ], default='pending')
    applied_at = models.DateTimeField(default=timezone.now)
    feedback = models.TextField(blank=True)

    def __str__(self):
        return f"Candidature de {self.candidate.full_name} pour {self.job_offer.title}"

    class Meta:
        verbose_name = "Candidature"
        verbose_name_plural = "Candidatures"

# Modèle pour les messages
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    sent_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message de {self.sender.username} à {self.recipient.username}"

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"

# Modèle pour les notifications
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    related_offer = models.ForeignKey(JobOffer, on_delete=models.SET_NULL, null=True, blank=True)
    related_application = models.ForeignKey(Application, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Notification pour {self.user.username}"

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

# Modèle pour les guides/accompagnement
class Guide(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=100, choices=[
        ('cv', 'Rédaction de CV'),
        ('interview', 'Préparation aux entretiens'),
        ('career', 'Orientation professionnelle'),
    ])
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Guide"
        verbose_name_plural = "Guides"

# Modèle pour les témoignages
class Testimonial(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='testimonials')
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Témoignage de {self.user.username}"

    class Meta:
        verbose_name = "Témoignage"
        verbose_name_plural = "Témoignages"

# Modèle pour les statistiques d'utilisation
class UsageStatistics(models.Model):
    date = models.DateField(auto_now_add=True)
    total_users = models.PositiveIntegerField(default=0)
    total_job_offers = models.PositiveIntegerField(default=0)
    total_applications = models.PositiveIntegerField(default=0)
    total_messages = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Statistiques du {self.date}"

    class Meta:
        verbose_name = "Statistique d'utilisation"
        verbose_name_plural = "Statistiques d'utilisation"

