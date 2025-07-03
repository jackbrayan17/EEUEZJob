from django.contrib import admin
from .models import Category, CandidateProfile, RecruiterProfile, JobOffer, Application, Message, Notification, Guide, Testimonial

admin.site.register(Category)
admin.site.register(CandidateProfile)
admin.site.register(RecruiterProfile)
admin.site.register(JobOffer)
admin.site.register(Application)
admin.site.register(Message)
admin.site.register(Notification)
admin.site.register(Guide)
admin.site.register(Testimonial)