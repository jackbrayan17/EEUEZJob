from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from .models import CandidateProfile, RecruiterProfile

class CandidateProfileForm(forms.ModelForm):
    class Meta:
        model = CandidateProfile
        fields = ['full_name', 'skills', 'years_experience', 'education', 'cv_file', 'profile_picture', 'social_links', 'sectors']
        widgets = {
            'full_name': forms.TextInput(attrs={
                'id': 'fullName',
                'class': 'form-input',
                'placeholder': 'Entrez votre nom complet'
            }),
            'skills': forms.TextInput(attrs={
                'id': 'skills',
                'class': 'form-input',
                'placeholder': 'Ex: Python, Gestion de projet'
            }),
            'years_experience': forms.NumberInput(attrs={
                'id': 'experience',
                'class': 'form-input',
                'placeholder': 'Ex: 5'
            }),
            'education': forms.TextInput(attrs={
                'id': 'education',
                'class': 'form-input',
                'placeholder': 'Ex: Master en Informatique'
            }),
            'social_links': forms.TextInput(attrs={
                'id': 'socialLinks',
                'class': 'form-input',
                'placeholder': 'Ex: https://linkedin.com/in/votre-profil'
            }),
            'profile_picture': forms.FileInput(attrs={
                'id': 'profilePicture',
                'class': 'hidden',
                'accept': 'image/jpeg,image/png'
            }),
            'cv_file': forms.FileInput(attrs={
                'id': 'cvFile',
                'class': 'hidden',
                'accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('submit', 'Enregistrer', css_class='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-300'))
        
        # Ajouter des classes et attributs supplémentaires si nécessaire
        self.fields['full_name'].required = True
        self.fields['years_experience'].required = True
        self.fields['sectors'].required = False  # La validation se fera côté JavaScript
class TestimonialForm(forms.Form):
    name = forms.CharField(max_length=100, label="Votre nom")
    review = forms.CharField(widget=forms.Textarea, label="Votre avis")
    rating = forms.IntegerField(min_value=1, max_value=5, label="Note (1-5 étoiles)")

class RecruiterProfileForm(forms.ModelForm):
    company_website = forms.URLField(required=False, label="Site web de l'entreprise")
    company_address = forms.CharField(max_length=200, required=True, label="Adresse de l'entreprise")
    recruiter_name = forms.CharField(max_length=200, required=True, label="Nom complet")
    recruiter_position = forms.CharField(max_length=200, required=True, label="Poste/Fonction")
    recruiter_email = forms.EmailField(required=True, label="Email professionnel")
    recruiter_phone = forms.CharField(max_length=20, required=False, label="Téléphone professionnel")
    linkedin_profile = forms.URLField(required=False, label="Profil LinkedIn")
    company_description = forms.CharField(widget=forms.Textarea(attrs={'rows': 4}), required=True, label="Description de l'entreprise")
    company_size = forms.ChoiceField(
        choices=[
            ('Startup (1-10 employés)', 'Startup (1-10 employés)'),
            ('Petite entreprise (11-50 employés)', 'Petite entreprise (11-50 employés)'),
            ('Moyenne entreprise (51-250 employés)', 'Moyenne entreprise (51-250 employés)'),
            ('Grande entreprise (251-1000 employés)', 'Grande entreprise (251-1000 employés)'),
            ('Très grande entreprise (1000+ employés)', 'Très grande entreprise (1000+ employés)')
        ],
        required=True,
        label="Taille de l'entreprise"
    )
    recruitment_areas = forms.CharField(max_length=200, required=False, label="Zones géographiques de recrutement")
    welcome_message = forms.CharField(widget=forms.Textarea(attrs={'rows': 4}), required=False, label="Message d'accueil pour les candidats")

    class Meta:
        model = RecruiterProfile
        fields = ['company_name', 'company_description']  # Champs du modèle de base

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('submit', 'Enregistrer', css_class='submit-button'))

    def save(self, *args, **kwargs):
        instance = super().save(commit=False)
        instance.company_website = self.cleaned_data.get('company_website')
        instance.company_address = self.cleaned_data.get('company_address')
        instance.recruiter_name = self.cleaned_data.get('recruiter_name')
        instance.recruiter_position = self.cleaned_data.get('recruiter_position')
        instance.recruiter_email = self.cleaned_data.get('recruiter_email')
        instance.recruiter_phone = self.cleaned_data.get('recruiter_phone')
        instance.linkedin_profile = self.cleaned_data.get('linkedin_profile')
        instance.company_size = self.cleaned_data.get('company_size')
        instance.recruitment_areas = self.cleaned_data.get('recruitment_areas')
        instance.welcome_message = self.cleaned_data.get('welcome_message')
        instance.user = self.instance.user
        instance.save()
        return instance