#-*- coding: utf-8 -*-
'''
Created on 15 oct. 2022

@author: robert
'''


from django.contrib.auth.decorators import login_required
import locale
from django.http import HttpResponse
import json


from datetime import datetime , timedelta, date
from pytz import timezone
from django.core import serializers

from reservation.views.StudioUsers import getStudioUsers
from reservation.models import Studio

from reservation.views.displayModeFile import DisplayMode
from reservation.views.ManageReservations import getReservations
from reservation.views.BankHolidays import FrenchBankHolidays

from gettingstarted.settings import TIME_ZONE


French_Locale = ""
encoding = 'utf-8'


class JSONDateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        paris = timezone(TIME_ZONE)
        #fmt = '%Y-%m-%d %H:%M:%S %Z%z'
        fmt = '%Y-%m-%dT%H:%M:%S'
        if isinstance(obj, (date, datetime)):
            loc_dt = obj.astimezone(paris)
            #print(loc_dt.strftime(fmt))
            return loc_dt.strftime(fmt)
        else:
            return json.JSONEncoder.default(self, obj)


def lastISOWeekNumberOfPreviousYear(year):
    referenceFourthJanuary = datetime(year, 1, 4)
    #print 'reference 4th of January {0}'.format(referenceFourthJanuary)
    ''' week day returns 0 if monday '''
    dayIndexInTheFirstWeek = referenceFourthJanuary.weekday()
    ''' compute minus 5 days to be sure to move to previous year '''
    lastDayInPreviousYear = referenceFourthJanuary + timedelta(days=(-dayIndexInTheFirstWeek-1))
    #print 'last day of the previous ISO year = {0}'.format(lastDayInPreviousYear)
    #print 'previous ISO year= {0}'.format(lastDayInPreviousYear.isocalendar()[0])
    #print 'last ISO week of previous year= {0}'.format(lastDayInPreviousYear.isocalendar()[1])
    return lastDayInPreviousYear.isocalendar()[1]


@login_required
def modifyPeriod(request):
    locale.setlocale(locale.LC_TIME, French_Locale)

    displayMode = DisplayMode()
    
    #print 'modify period - user = {user}'.format(user=request.user)
    #print request
    if (request.method == 'GET'):
        
        displayMode.initialise(request)
        year = 0
        week_number = 0
        month_number = 0
        if request.GET['action'] == 'first':
            ''' by default first page is always displayed in weekly mode '''
            week_number = datetime.today().isocalendar()[1]
            month_number = datetime.today().month
            #print 'modify period - month number = {0}'.format(month_number)
            year = datetime.today().isocalendar()[0]
            #print 'modify week first - year= {year} - week number= {week_number}'.format(year=year, week_number=week_number)
        
        elif request.GET['action'] == 'inc':
            ''' action = increment '''
            year = int(request.GET['year'])
            try:
                week_number = int(request.GET['week'])
                if (week_number):
                    if (week_number == lastISOWeekNumberOfPreviousYear(year+1)):
                        week_number = 1
                        year = year + 1
                    else:
                        week_number = week_number + 1
                    
                    ''' need to check whether a year changes occur here '''
            except:
                # there is no such week parameter in the get query
                week_number = 0
                try:
                    month_number = int(request.GET['month'])
                    if (month_number == 12):
                        year = year + 1
                except:
                    month_number = 0
        
        elif request.GET['action'] == 'dec':
            ''' action = decrement '''
            year = int(request.GET['year'])
            try:
                week_number = int(request.GET['week'])
                if (week_number):
                    if (week_number == 1):
                        week_number = lastISOWeekNumberOfPreviousYear(year)
                        year = year - 1
                    else:
                        week_number = week_number - 1
                        
                    #print 'modify week dec - year= {year} - week number= {week_number}'.format(year=year, week_number=week_number)

            except:
                week_number = 0
                try:
                    month_number = int(request.GET['month'])
                    if (month_number == 1):
                        year = year - 1
                except:
                    month_number = 0                   
            
        else:
            week_number = datetime.today().isocalendar()[1]
            month_number = datetime.today.month + 1
            year = datetime.today().isocalendar()[0]
            #print 'modify week first - year= {year} - week number= {week_number}'.format(year=year, week_number=week_number)
            
        #print 'modified week number = {0}'.format(week_number)
        ''' retrieve only users having done a reservation '''
        #users = serializers.serialize('json', list(User.objects.all()), fields=('username','first_name','last_name','email','is_superuser','is_active', 'is_staff'))
        users = getStudioUsers(current_user=request.user)
        studios = serializers.serialize('json', list(Studio.objects.all()))
        ''' if 2 reservations on the same date time slot then studio 1 before studio 2 '''

        ''' always return reservations depending upon the display mode weekly or monthly '''
        reservations = getReservations(displayMode, year, week_number)
        
        response_data = {
                    'current_user_id': request.user.id,
                    'week_number': week_number,
                    'month_number': month_number,
                    'year': year,
                    'users': users,
                    'studios': studios,
                    'reservations': reservations,
                    'frenchBankHolidays': FrenchBankHolidays(year).getAllBankHolidays(),
                    }
        ''' as we send dates in ISO format no need to format here '''
        ''' python 2 to python 3 - no more encoding '''
        return HttpResponse(json.dumps(response_data, cls=JSONDateTimeEncoder), content_type="application/json")
