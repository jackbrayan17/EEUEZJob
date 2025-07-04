from django.core.management.base import BaseCommand
from core.models import Category

class Command(BaseCommand):
    help = 'Popule la base de données avec 35 catégories (secteurs d\'activité).'

    def handle(self, *args, **options):
        # Liste des secteurs d'activité
        sectors = [
            "Agriculture", "Électronique", "Informatique", "Droit", "Marketing",
            "Santé", "Éducation", "Construction", "Finance", "Ressources humaines",
            "Vente", "Logistique", "Télécommunications", "Énergie", "Tourisme",
            "Mode", "Artisanat", "Médias", "Recherche", "Immobilier",
            "Transport", "Alimentation", "Biotechnologie", "Sécurité", "Design",
            "Jeux vidéo", "Automobile", "Aéronautique", "Environnement", "Commerce",
            "Assurance", "Publicité", "Événementiel", "Pharmaceutique", "Sport"
        ]

        # Population des catégories
        for sector in sectors:
            category, created = Category.objects.get_or_create(name=sector, defaults={'description': ''})
            if created:
                self.stdout.write(self.style.SUCCESS(f'Créée catégorie: {sector}'))
            else:
                self.stdout.write(self.style.WARNING(f'Catégorie {sector} existe déjà, ignorée.'))

        self.stdout.write(self.style.SUCCESS('Les catégories ont été ajoutées avec succès !'))