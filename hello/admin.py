from django.contrib import admin
from hello.models import SiteMessage
# Register your models here.


class SiteMessageAdmin(admin.ModelAdmin):
    list_display = ('author', 'created' , 'event_date', 'message', 'active')
    
admin.site.register(SiteMessage, SiteMessageAdmin)