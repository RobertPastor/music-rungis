'''
Created on 2 oct. 2022

@author: robert
'''

from django.core.management.base import BaseCommand
from reservation.models import Studio

class Command(BaseCommand):
    help = 'load the Studio table'

    def handle(self, *args, **options):
        
        Studio.objects.all().delete()
        
        studio = Studio ( name = "Piano" , status = "actif" , is_piano = True , color = "yellow" )
        studio.save()
        print ( studio )
        
        studio = Studio ( name = "Galabru" , status = "actif" , is_piano = False , color = "red" )
        studio.save()
        print ( studio )
        
        studio = Studio ( name = "Studio 1" , status = "actif" , is_piano = False , color = "blue" )
        studio.save()
        print ( studio )
        
        studio = Studio ( name = "Studio 2" , status = "actif" , is_piano = False , color = "green" )
        studio.save()
        print ( studio )