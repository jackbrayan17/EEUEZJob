from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import JobOffer, Message, CandidateProfile
from .forms import CandidateProfileForm, TestimonialForm
from django.contrib import messages

def home(request):
    return render(request, 'core/index.html')

@login_required
def candidate_profile_create(request):
    if hasattr(request.user, 'candidate_profile'):
        messages.info(request, "Vous avez déjà un profil candidat.")
        return redirect('home')
    if request.method == 'POST':
        form = CandidateProfileForm(request.POST, request.FILES)
        if form.is_valid():
            profile = form.save(commit=False)
            profile.user = request.user
            profile.save()
            messages.success(request, "Profil créé avec succès !")
            return redirect('home')
    else:
        form = CandidateProfileForm()
    return render(request, 'core/candidate_profile_form.html', {'form': form})

def job_offer_list(request):
    job_offers = JobOffer.objects.filter(is_validated=True)
    return render(request, 'core/job_offer_list.html', {'job_offers': job_offers})

def job_offer_detail(request, pk):
    job_offer = JobOffer.objects.get(pk=pk, is_validated=True)
    return render(request, 'core/job_offer_detail.html', {'job_offer': job_offer})

@login_required
def message_list(request):
    messages_received = Message.objects.filter(recipient=request.user)
    return render(request, 'core/message_list.html', {'messages': messages_received})

def submit_testimonial(request):
    if request.method == 'POST':
        form = TestimonialForm(request.POST)
        if form.is_valid():
            # Placeholder: Save to database (e.g., Testimonial model)
            messages.success(request, "Témoignage soumis avec succès !")
            return redirect('home')
    else:
        form = TestimonialForm()
    return render(request, 'core/submit_testimonial.html', {'form': form})

@login_required
def profile(request):
    candidate_profile = getattr(request.user, 'candidate_profile', None)
    return render(request, 'core/profile.html', {'candidate_profile': candidate_profile})