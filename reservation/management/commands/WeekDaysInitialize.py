'''
Created on 2 oct. 2022

@author: robert
'''


from django.core.management.base import BaseCommand
from reservation.models import WeekDay

class Command(BaseCommand):
    help = 'load the Studio table'

    def handle(self, *args, **options):
        
        WeekDay.objects.all().delete()
        
        names = ["lundi" , "mardi" , "mercredi" , "jeudi" , "vendredi"]
        for name in names:
            weekDay = WeekDay( name = name )
            weekDay.save()
            print ( weekDay )