from django.shortcuts import render, redirect
from django.http import JsonResponse
import requests
import json
from django.contrib.auth.decorators import login_required
from django.conf import settings  # Pour accéder à API_KEY
from .models import JobOffer, Message, CandidateProfile, Testimonial, Category, RecruiterProfile
from .forms import CandidateProfileForm, TestimonialForm, RecruiterProfileForm
from django.contrib import messages
from django.utils import timezone

def home(request):
    """Affiche la page d'accueil."""
    return render(request, 'core/index.html')

@login_required
def candidate_profile_create(request):
    """Crée ou met à jour le profil candidat."""
    has_candidate_profile = hasattr(request.user, 'candidate_profile')
    has_recruiter_profile = hasattr(request.user, 'recruiter_profile')
    
    if has_candidate_profile and has_recruiter_profile:
        messages.error(request, "Vous avez déjà un profil candidat et un profil recruteur. Vous ne pouvez en avoir qu'un seul.")
        return redirect('home')
    elif has_recruiter_profile:
        messages.error(request, "Vous avez déjà un profil recruteur. Vous ne pouvez pas créer un profil candidat.")
        return redirect('home')
    elif request.method == 'POST':
        form = CandidateProfileForm(request.POST, request.FILES)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            messages.success(request, "Profil créé avec succès !")
            return redirect('home')
        else:
            messages.error(request, f"Erreur dans le formulaire : {form.errors}")
            print(form.errors)  # Débogage
    else:
        form = CandidateProfileForm()
    return render(request, 'core/candidate_profile_form.html', {'form': form})

@login_required
@login_required
def recruiter_profile_create(request):
    """Crée ou met à jour le profil recruteur."""
    has_candidate_profile = hasattr(request.user, 'candidate_profile')
    has_recruiter_profile = hasattr(request.user, 'recruiter_profile')
    
    if has_candidate_profile and has_recruiter_profile:
        messages.error(request, "Vous avez déjà un profil candidat et un profil recruteur. Vous ne pouvez en avoir qu'un seul.")
        return redirect('home')
    elif has_candidate_profile:
        messages.error(request, "Vous avez déjà un profil candidat. Vous ne pouvez pas créer un profil recruteur.")
        return redirect('home')
    elif request.method == 'POST':
        form = RecruiterProfileForm(request.POST, request.FILES)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            # Sauvegarde des données supplémentaires (ex. secteurs via JSON)
            selected_sectors = request.POST.get('selectedSectors', '[]')
            profile.sectors.set(json.loads(selected_sectors))  # Sauvegarde des secteurs
            profile.save()
            messages.success(request, "Profil recruteur créé avec succès !")
            return redirect('home')
        else:
            messages.error(request, f"Erreur dans le formulaire : {form.errors}")
            print(form.errors)
    else:
        form = RecruiterProfileForm()
    return render(request, 'core/recruiter_profile_form.html', {'form': form})

@login_required
def profile_delete(request):
    """Supprime le profil existant (candidat ou recruteur) de l'utilisateur."""
    has_candidate_profile = hasattr(request.user, 'candidate_profile')
    has_recruiter_profile = hasattr(request.user, 'recruiter_profile')

    if not (has_candidate_profile or has_recruiter_profile):
        messages.error(request, "Vous n'avez aucun profil à supprimer.")
        return redirect('home')

    if request.method == 'POST':
        if has_candidate_profile:
            request.user.candidate_profile.delete()
            messages.success(request, "Votre profil candidat a été supprimé avec succès. Vous pouvez maintenant créer un profil recruteur.")
        elif has_recruiter_profile:
            request.user.recruiter_profile.delete()
            messages.success(request, "Votre profil recruteur a été supprimé avec succès. Vous pouvez maintenant créer un profil candidat.")
        return redirect('home')

    return render(request, 'core/profile_delete_confirm.html', {
        'has_candidate_profile': has_candidate_profile,
        'has_recruiter_profile': has_recruiter_profile
    })

@login_required
def ai_chatbot(request):
    """Gère les interactions avec le chatbot IA."""
    if request.method == "POST":
        user_message = request.POST.get("message", "")
        profile = request.user.candidate_profile

        if not profile:
            return JsonResponse({"response": "Veuillez créer votre profil d'abord."})

        headers = {
            "Authorization": f"Bearer {settings.API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "grok-3",
            "messages": [
                {
                    "role": "system",
                    "content": "Vous êtes une IA conçue uniquement pour guider l'utilisateur dans l'application EEUEZJob. Répondez uniquement aux questions liées à la création de profil, à l'amélioration du CV, à la recherche d'offres d'emploi, ou à l'utilisation de l'application. Ignorez toute question hors sujet. Si l'utilisateur demande une amélioration de CV, proposez des suggestions basées sur ses compétences, formations, années d'expérience et secteurs d'activité, et incluez un exemple de texte à intégrer."
                },
                {
                    "role": "user",
                    "content": f"Profil: {profile.full_name}, Compétences: {profile.skills}, Expérience: {profile.years_experience} ans, Éducation: {profile.education}, Secteurs: {[c.name for c in profile.sectors.all()]}. Question: {user_message}"
                }
            ]
        }

        response = requests.post("https://api.xai.com/v1/chat", headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            ai_response = response.json().get("choices", [{}])[0].get("message", {}).get("content", "Désolé, je n'ai pas compris.")
            return JsonResponse({"response": ai_response})
        return JsonResponse({"response": "Erreur lors de la communication avec l'IA."})

    return render(request, 'core/ai_chatbot.html')

@login_required
def job_offer_list(request):
    """Affiche la liste des offres d'emploi avec tri par IA si profil existe."""
    job_offers = JobOffer.objects.filter(is_validated=True)
    profile = getattr(request.user, 'candidate_profile', None)

    if profile:
        headers = {
            "Authorization": f"Bearer {settings.API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "grok-3",
            "messages": [
                {
                    "role": "system",
                    "content": "Vous êtes une IA pour EEUEZJob. Classez les offres d'emploi par pertinence pour un profil donné (compétences, expérience, secteurs). Retournez une liste d'IDs d'offres triées."
                },
                {
                    "role": "user",
                    "content": f"Profil: Compétences: {profile.skills}, Expérience: {profile.years_experience} ans, Secteurs: {[c.name for c in profile.sectors.all()]}. Offres: {[o.id for o in job_offers]}"
                }
            ]
        }
        response = requests.post("https://api.xai.com/v1/chat", headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            ai_response = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
            try:
                ranked_ids = [int(id.strip()) for id in ai_response.split(',') if id.strip().isdigit()]
                job_offers = sorted(job_offers, key=lambda x: ranked_ids.index(x.id) if x.id in ranked_ids else len(ranked_ids))
            except (ValueError, IndexError):
                pass

    return render(request, 'core/job_offer_list.html', {
        'job_offers': job_offers,
        'other_offers': job_offers[len(job_offers) // 2:] if profile and len(job_offers) > 6 else []
    })

def job_offer_detail(request, pk):
    """Affiche les détails d'une offre d'emploi spécifique."""
    job_offer = JobOffer.objects.get(pk=pk, is_validated=True)
    return render(request, 'core/job_offer_detail.html', {'job_offer': job_offer})

@login_required
def message_list(request):
    """Affiche la liste des messages reçus par l'utilisateur."""
    messages_received = Message.objects.filter(recipient=request.user)
    return render(request, 'core/message_list.html', {'messages': messages_received})

def submit_testimonial(request):
    """Gère la soumission d'un témoignage."""
    if request.method == 'POST':
        form = TestimonialForm(request.POST)
        if form.is_valid():
            testimonial = Testimonial(
                user=request.user,
                content=form.cleaned_data['review'],
                created_at=timezone.now()
            )
            testimonial.save()
            messages.success(request, "Témoignage soumis avec succès !")
            return redirect('home')
    else:
        form = TestimonialForm()
    return render(request, 'core/submit_testimonial.html', {'form': form})

@login_required
def profile(request):
    """Affiche le profil de l'utilisateur connecté."""
    candidate_profile = getattr(request.user, 'candidate_profile', None)
    return render(request, 'core/profile.html', {'candidate_profile': candidate_profile})