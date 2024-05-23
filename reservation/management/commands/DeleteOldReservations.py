'''
Created on 23 mai 2024

@author: robert
'''

import datetime

from django.core.management.base import BaseCommand
from reservation.models import  Reservation

class Command(BaseCommand):
    help = 'delete old reservations'

    def handle(self, *args, **options):
        
        ''' current ISO week '''
        currentYear , currentISOweek , currentWeekDay = datetime.datetime.now().isocalendar()
        print (f' current year = {currentYear} ')
        print (f' current ISO week = {currentISOweek} ' )
        print (f' current ISO week day = {currentWeekDay} ' )
        
        for reservation in Reservation.objects.all():
            print ( reservation.date_start.isocalendar() )
            reservationYear , reservationISOweek , reservationWeekDay = reservation.date_start.isocalendar()
            if ( ( reservationYear == currentYear) and ( reservationISOweek < ( currentISOweek - 4 ) ) ) or ( reservationYear < currentYear ):
                ''' delete this reservation '''
                try:
                    print (f"this old reservation will be deleted = {reservation.studio_key} - {reservation.date_start} ")
                    reservation.delete()
                    
                except Exception as e:
                    print ('exception= {e}'.format(e=e))
                    
            else:
                print ("this old reservation will not be deleted")
