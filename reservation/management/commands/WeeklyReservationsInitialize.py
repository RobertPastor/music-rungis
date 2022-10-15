'''
Created on 14 oct. 2022

@author: robert
'''

from django.core.management.base import BaseCommand
from reservation.models import WeekDay , WeeklyReservation, Studio
from django.contrib.auth.models import User 
from datetime import date

class Command(BaseCommand):
    help = 'load the weekly reservations table'
    
    superuser = User.objects.filter(is_superuser=True).first()
    
    weeklyReservationsList = [
        { "studio" : "Piano" ,    "activity" : "Cours de Piano"            , "jour" : "Lundi"    , "starting hour" : 11 , "starting minutes" : 40 , "ending hour" : 14 , "ending minutes" : 20 } , \
        { "studio" : "Studio 1" , "activity" : "Atelier Basse"             , "jour" : "Lundi"    , "starting hour" : 12 , "starting minutes" :  0 , "ending hour" : 14 , "ending minutes" :  0 } , \
        { "studio" : "Studio 1" , "activity" : "Atelier Guitare"           , "jour" : "Mercredi" , "starting hour" : 12 , "starting minutes" :  0 , "ending hour" : 14 , "ending minutes" :  0 } , \
        { "studio" : "Studio 1" , "activity" : "Appendre à jouer ensemble" , "jour" : "Mercredi" , "starting hour" : 12 , "starting minutes" : 30 , "ending hour" : 13 , "ending minutes" : 15 } , \
        { "studio" : "Studio 1" , "activity" : "Atelier Jazz"              , "jour" : "Mercredi" , "starting hour" : 13 , "starting minutes" : 15 , "ending hour" : 14 , "ending minutes" :  0 } , \
        { "studio" : "Studio 1" , "activity" : "Répétitions Encadrées"     , "jour" : "Mardi"    , "starting hour" : 12 , "starting minutes" : 20 , "ending hour" : 13 , "ending minutes" : 40 } , \
        { "studio" : "Studio 1" , "activity" : "Atelier Batterie"          , "jour" : "Jeudi"    , "starting hour" : 12 , "starting minutes" :  0 , "ending hour" : 14 , "ending minutes" :  0 } , \
        { "studio" : "Studio 2" , "activity" : "Atelier Guitare"           , "jour" : "Vendredi" , "starting hour" : 12 , "starting minutes" :  0 , "ending hour" : 14 , "ending minutes" :  0 } , \
        { "studio" : "Studio 2" , "activity" : "Coaching Vocal"            , "jour" : "Jeudi"    , "starting hour" : 12 , "starting minutes" :  0 , "ending hour" : 14 , "ending minutes" :  0 } , \
        { "studio" : "Studio 2" , "activity" : "Chorale"                   , "jour" : "Lundi"    , "starting hour" : 12 , "starting minutes" : 40 , "ending hour" : 13 , "ending minutes" : 40} \
        ]
    
    def handle(self, *args, **options):
        
        WeeklyReservation.objects.all().delete()
        
        for weeklyReservationDict in self.weeklyReservationsList:
            studio = Studio.objects.filter(name = weeklyReservationDict["studio"]).first()
            weekDay = WeekDay.objects.filter(name = weeklyReservationDict["jour"]).first()
            weeklyReservation = WeeklyReservation ( created_by = self.superuser, created_when = date.today(), \
                                                    studio_key = studio , activity = weeklyReservationDict["activity"] , \
                                                    weekDay_key = weekDay , \
                                                    starting_hour = weeklyReservationDict["starting hour"] , starting_minutes = weeklyReservationDict["starting minutes"] , \
                                                    ending_hour   = weeklyReservationDict["ending hour"] ,   ending_minutes   = weeklyReservationDict["ending minutes"]  )
            weeklyReservation.save()
        