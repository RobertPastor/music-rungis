#from __future__ import unicode_literals
#from django.utils import timezone

from django.db import models
from django.contrib.auth.models import User
#from django.utils.encoding import python_2_unicode_compatible

# Create your models here.
class Greeting(models.Model):
    when = models.DateTimeField('date created', auto_now_add=True)


#@python_2_unicode_compatible
class SiteMessage(models.Model):
    
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    ''' the content of the message '''
    message = models.CharField(max_length=1500, default="")
    active = models.BooleanField(default=False)
    ''' 13th April 2016 - added after discussing with Antoine '''
    event_date = models.DateField(blank=True, null=True)

    def __str__(self):
        strMessage = 'Site Message created: {0}'.format(self.created)
        strMessage += ' is active: {0}'.format(self.active)
        strMessage += ' by: {0}'.format(self.author)
        strMessage += ' modified: {0}'.format(self.modified)
        strMessage += ' --- {0}'.format(self.message)
        return strMessage 