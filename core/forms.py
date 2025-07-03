from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from .models import CandidateProfile

class CandidateProfileForm(forms.ModelForm):
    class Meta:
        model = CandidateProfile
        fields = ['full_name', 'skills', 'years_experience', 'education', 'cv_file', 'profile_picture', 'social_links']
        widgets = {
            'skills': forms.Textarea(attrs={'rows': 4}),
            'education': forms.Textarea(attrs={'rows': 4}),
            'social_links': forms.TextInput(attrs={'placeholder': '{"linkedin": "url", "twitter": "url"}'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('submit', 'Enregistrer', css_class='bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-300'))

class TestimonialForm(forms.Form):
    name = forms.CharField(max_length=100, label="Votre nom")
    review = forms.CharField(widget=forms.Textarea, label="Votre avis")
    rating = forms.IntegerField(min_value=1, max_value=5, label="Note (1-5 étoiles)")