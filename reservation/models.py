#from __future__ import unicode_literals


from django.db import models
from django.contrib.auth.models import User
#from django.utils import timezone
from django.core.exceptions import ValidationError

# Create your models here.
    
class Studio(models.Model):
    name = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    is_piano = models.BooleanField(default=False)
    ''' Robert - 30 July 2016 '''
    color = models.CharField(max_length=50, default='yellow')
    
    def __str__(self):
        return self.name


class Reservation(models.Model):
    made_by = models.ForeignKey(User, on_delete=models.CASCADE)
    ''' verbose name is used in the admin site '''
    studio_key = models.ForeignKey(Studio, verbose_name='Studio', on_delete=models.CASCADE)
    ''' date when the reservation has been made '''
    made_when = models.DateTimeField()
    ''' start date time of the reservation '''
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    ''' name of the song that will be interpreted '''
    song = models.CharField(max_length=250, default="")
    ''' name of the author of the song '''
    author = models.CharField(max_length=250, default="")
    
    
    def __str__(self):
        return self.song.encode('utf8')
    
        #strMsg = 'reservation of studio: {0}'.format(self.studio_key.__str__())
        #strMsg += ' --- made= {0}'.format(self.made_when.strftime('%d/%m/%Y'))
        ''' show local time '''
        #strMsg += ' --- starting= {0}'.format(timezone.localtime(self.date_start))
        #strMsg += ' --- finishing= {0}'.format(timezone.localtime(self.date_end))
        #strMsg += ' --- song= {0}'.format(self.song)
        #return  strMsg
    

class WeekDay(models.Model):
    ''' Monday / Lundi, Tuesday / Mardi, etc. '''
    name = models.CharField(max_length=250, default="Lundi")
    
    class Meta:
        ordering = ['id']
        
    def __str__(self):
        return str(self.name)
    
    def isMonday(self):
        if str(self.name).lower() == 'lundi' or str(self.name).lower() == 'monday':
            return True
        return False
    
    def isTuesday(self):
        if str(self.name).lower() == 'mardi' or str(self.name).lower() == 'tuesday':
            return True
        return False
    
    def isWednesday(self):
        if str(self.name).lower() == 'mercredi' or str(self.name).lower() == 'wednesday':
            return True
        return False
    
    def isThursday(self):
        if str(self.name).lower() == 'jeudi' or str(self.name).lower() == 'thursday':
            return True
        return False
    
    def isFriday(self):
        if str(self.name).lower() == 'vendredi' or str(self.name).lower() == 'friday':
            return True
        return False
    
    def getDeltaDays(self):
        if self.isMonday():
            return 0
        elif self.isTuesday():
            return 1
        elif self.isWednesday():
            return 2
        elif self.isThursday():
            return 3
        elif self.isFriday():
            return 4
        else:
            return 0    
    
def validate_hour(hour):
    if hour < 0 or hour > 23 :  # Your conditions here
        raise ValidationError('Hour of the weekly reservation must be greater or equal to ZERO and lower to 24 - hour={hour}'.format(hour=hour))
    
    
def validate_minutes(minutes):
    if minutes < 0 or minutes > 59:
        raise ValidationError('Minutes of the weekly reservation must be greater or equal to ZERO and lower or equal 59 - minutes={minutes}'.format(minutes=minutes))
    
    
class WeeklyReservation(models.Model):
    ''' user who has created the weekly reservation '''
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    ''' date where the weekly reservation was created '''
    created_when = models.DateTimeField()
    ''' verbose name is used in the admin site '''
    studio_key = models.ForeignKey(Studio, verbose_name='Studio', on_delete=models.CASCADE)
    ''' name of the activity: chorale - chant - atelier guitare '''
    activity = models.CharField(max_length=250, default="")
    ''' day of the week '''
    weekDay_key = models.ForeignKey(WeekDay, verbose_name='WeekDay', on_delete=models.CASCADE)
    ''' starting hour '''
    starting_hour = models.IntegerField(validators=[validate_hour])
    starting_minutes = models.IntegerField(validators=[validate_minutes])
    ''' ending hour and ending minutes '''
    ending_hour = models.IntegerField(validators=[validate_hour])
    ending_minutes = models.IntegerField(validators=[validate_minutes])
    
    
    