#-*- coding: utf-8 -*-
'''
Created on 10 mars 2018

@author: PASTOR Robert

Specific views for the management of periodic reservations
'''
import json
import locale

from pytz import timezone

from datetime import datetime , timedelta, date

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.http import HttpResponse

from reservation.models import Studio, Reservation, WeeklyReservation, WeekDay
from reservation.views.displayModeFile import DisplayMode
from reservation.views.StudioUsers import getStudioUsers
from reservation.views.ManageReservations import getReservations
from reservation.views.BankHolidays import FrenchBankHolidays

from gettingstarted.settings import TIME_ZONE

French_Locale = ""
encoding = 'utf-8'


''' bug 10 March 2018 - if reservation is in the future in another Day Saving Time
- hour of the reservation is shifted for example one hour ahead '''
class JsonDateTimeEncoderUTC(json.JSONEncoder):
    def default(self, obj):
        #fmt = '%Y-%m-%d %H:%M:%S %Z%z'
        fmt = '%Y-%m-%dT%H:%M:%S'
        paris = timezone(TIME_ZONE)
        if isinstance(obj, (date, datetime)):
            loc_dt = obj.astimezone(paris)
            #loc_dt = paris.localize(obj)j
            #loc_dt = obj.astimezone(utc)
            #print 'JsonDateTimeEncoderUTC - loc_dt= {loc_dt}'.format(loc_dt=loc_dt)
            return loc_dt.strftime(fmt)
        else:
            return json.JSONEncoder.default(self, obj)
        

def getMondayOfWeekYear(year, week):
    ''' Paris time zone localized dates '''
    year = int(year)
    week = int(week)
    ''' time zone is Paris '''
    paris = timezone(TIME_ZONE)
    #utc = timezone('UTC')
    ''' utiliser datetime pour pouvoir ajouter des heures '''
    #referenceThursday = paris.localize(datetime(year=year, month=1, day=4)) # Le 4 janvier est toujours en semaine 1
    referenceThursday = paris.localize(datetime(year=year, month=1, day=4)) # Le 4 janvier est toujours en semaine 1
    dayInTheFirstWeek = referenceThursday.weekday()
    #print 'day of the 4th of January = {0}'.format(dayInTheFirstWeek)
    jours = 7*(week - 1) - dayInTheFirstWeek
    monday = referenceThursday + timedelta(days=jours)
    ''' Return a datetime object with new tzinfo attribute tz, adjusting the date and time data so the result is the same UTC time as self, but in tz�s local time '''
    monday = monday.astimezone(paris)
    return monday


def computeDateStart(weeklyReservation, year, week_number):
    monday = getMondayOfWeekYear(year, week_number)
    #print 'computeDateStart - date_end - monday= {monday}'.format(monday=monday)
    paris = timezone(TIME_ZONE)
    #utc = timezone('UTC')
    if isinstance ( weeklyReservation.weekDay_key , WeekDay ):
        
        #print 'compute date start - monday= {monday}'.format(monday=monday)
        date_start = monday.replace(hour=weeklyReservation.starting_hour, minute=weeklyReservation.starting_minutes)
        #print 'compute date start - date_start= {date_start}'.format(date_start=date_start)
        #print date_start
        if ( weeklyReservation.weekDay_key.getDeltaDays() > 0 ):
            date_start = date_start + timedelta(days=weeklyReservation.weekDay_key.getDeltaDays())
            #print date_start
        ''' correction due to Daylight Saving Times '''
        date_start = date_start.astimezone(paris)
        
    else:
        date_start = paris.localize(datetime.strptime(datetime.today() , '%Y-%m-%dT%H:%M:%S'))
        #date_start = utc.localize(datetime.strptime(datetime.today() , '%Y-%m-%dT%H:%M:%S'))

    #print 'computeDateStart - date_start= {date_start}'.format(date_start=date_start)
    return date_start


def computeDateEnd(weeklyReservation, year, week_number):
    monday = getMondayOfWeekYear(year, week_number)
    #print 'computeDateEnd - date_end - monday= {monday}'.format(monday=monday)
    paris = timezone(TIME_ZONE)
    #utc = timezone('UTC')
    if isinstance ( weeklyReservation.weekDay_key , WeekDay ):
        date_end = monday.replace(hour=weeklyReservation.ending_hour, minute=weeklyReservation.ending_minutes)
        if ( weeklyReservation.weekDay_key.getDeltaDays() > 0 ):
            date_end = date_end + timedelta(days=weeklyReservation.weekDay_key.getDeltaDays())
            
        ''' correction due to Daylight Saving Times '''
        date_end = date_end.astimezone(paris)
        
    else:
        date_end = paris.localize(datetime.strptime(datetime.today() , '%Y-%m-%dT%H:%M:%S'))
        #date_end = utc.localize(datetime.strptime(datetime.today() , '%Y-%m-%dT%H:%M:%S'))
        
    #print 'computeDateEnd - date_end= {date_end}'.format(date_end=date_end)
    return date_end


@login_required
@csrf_exempt
def generateWeeklyReservations(request):
    #print '===========  generateWeeklyReservations ====================='
    #print 'generate Weekly Reservations - timezone= {timezone}'.format(timezone=timezone(TIME_ZONE))
    displayMode = DisplayMode()
    #print 'generateWeeklyReservations - displayMode= {displayMode}'.format(displayMode=displayMode)
    locale.setlocale(locale.LC_TIME, French_Locale)

    #print 'generateWeeklyReservations - booking user= {0}'.format(request.user)
    if (request.method == 'POST'):
        #print 'generateWeeklyReservations - method id POST {0}'.format(request.POST)
        
        week_number = int(request.POST['week'])
        year = int(request.POST['year'])
        #print 'generateWeeklyReservations - week= {week_number} -- year= {year}'.format(week_number=week_number, year=year)
        
        weeklyReservations = WeeklyReservation.objects.all()
        for weeklyReservation in weeklyReservations:
            
            ''' date has the following format YYYY-MM-DDThh:mm:ss'''
            paris = timezone(TIME_ZONE)
            
            try:
                reservation = Reservation (
                    made_by     = request.user,
                    studio_key  = weeklyReservation.studio_key,
                    made_when   = paris.localize(datetime.now()),
                    date_start  = computeDateStart(weeklyReservation, year, week_number),
                    date_end    = computeDateEnd(weeklyReservation, year, week_number),
                    song        = weeklyReservation.activity,
                    author      = "inconnu")
                ''' record the new reservation '''
                reservation.save()
                
            except Exception as e:
                print ('Generate Weekly Reservation - exception= {e}'.format(e=e))
        
        ''' retrieve only users owning a reservation '''
        users = getStudioUsers(current_user=request.user)
        
        studios = serializers.serialize('json', list(Studio.objects.all()))
        ''' the following order is needed before sending data to the templates '''
        ''' always return reservations depending upon the display mode weekly or monthly '''
        reservations = getReservations(displayMode, year, week_number)

        response_data = {
                    'current_user_id': request.user.id,
                    'year': year,
                    'week_number': week_number,
                    'users': users,
                    'studios': studios,
                    'reservations': reservations,
                    'frenchBankHolidays': FrenchBankHolidays(year).getAllBankHolidays(),
                    }
        
        ''' bug 10 March 2018 - if reservation is in the future with another Day Saving Time - hour of the reservation is shifted for example one hour ahead '''
        ''' python 2 to python 3 - json dumps no more encoding '''
        return HttpResponse(json.dumps(response_data, cls=JsonDateTimeEncoderUTC), content_type="application/json")
   
