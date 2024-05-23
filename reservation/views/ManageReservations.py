'''
Created on 15 oct. 2022

@author: robert
'''

import locale
from datetime import datetime 

from django.core import serializers
from django.contrib.auth.decorators import login_required
from django.template import loader
from django.http import HttpResponse

from reservation.models import  Reservation
from reservation.versions.versionsFile import VersionsList

French_Locale = ""
encoding = 'utf-8'

def getReservations(displayMode, year, week_number):
    if displayMode.isWeeklyDisplayMode():
        return serializers.serialize('python', getFilteredReservations(year, week_number))
    else:
        return serializers.serialize('python', list(Reservation.objects.all()))
    
    
def getFilteredReservations(isoYear , isoWeekNumber):
    '''
    return only the reservations of the ISO week.
    '''
    #list(Reservation.objects.all().order_by("date_start","studio_key"))
    reservationsList = []
    ''' query reservations ordered by date_start and as second order the studio key '''
    for reservation in Reservation.objects.all().order_by("date_start", "studio_key"):
        #print ' iso year {0} and iso week {1} of the reservation'.format(reservation.date_start.isocalendar()[0] , reservation.date_start.isocalendar()[1])
        if ((reservation.date_start.isocalendar()[0] == isoYear) and (reservation.date_start.isocalendar()[1] == isoWeekNumber)):
            #print reservation
            reservationsList.append(reservation)
            
    return reservationsList


@login_required
def reservations(request):
    locale.setlocale(locale.LC_TIME, French_Locale)

    template = loader.get_template('reservation/reservations.html')
    ''' send the current version to be displayed in the header '''
    versionsList = VersionsList()
    versionsList.fill()

    week_number = datetime.today().isocalendar()[1]
    year = datetime.today().isocalendar()[0]
    ''' provide the latest recorded version '''
    #print 'current version = {0}'.format(versionsList.first())
    
    context = {
        'week_number'       : week_number,
        'year'              : year,
        'current_version'   : versionsList.first()
    }
    return HttpResponse(template.render(context, request))