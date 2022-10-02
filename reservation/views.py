#-*- coding: utf-8 -*-
import locale
import json
import urllib
import copy

from datetime import datetime , timedelta, date
from pytz import timezone

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from django.core import serializers

from django.http import HttpResponse
from django.template import loader

from django.contrib.auth.models import User

from gettingstarted.settings import TIME_ZONE
from reservation.models import Studio, Reservation

from reservation.BankHolidays import FrenchBankHolidays
from reservation.displayModeFile import DisplayMode
from reservation.StudioUsers import getStudioUsers
from reservation.versions.versionsFile import VersionsList

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


def getMondayOfWeekYear(year, week):
    year = int(year)
    week = int(week)
    paris = timezone(TIME_ZONE)
    ''' utiliser datetime pour pouvoir ajouter des heures '''
    referenceThursday = paris.localize(datetime(year=year, month=1, day=4)) # Le 4 janvier est toujours en semaine 1
    dayInTheFirstWeek = referenceThursday.weekday()
    #print 'day of the 4th of January = {0}'.format(dayInTheFirstWeek)
    jours = 7*(week - 1) - dayInTheFirstWeek
    monday = referenceThursday + timedelta(days=jours)
    return monday
    

def weekDays(year, week):
    ''' utiliser datetime pour pouvoir ajouter des heures '''
    referenceThursday = datetime(year, 1, 4) # Le 4 janvier est toujours en semaine 1
    dayInTheFirstWeek = referenceThursday.weekday()
    #print 'day of the 4th of January = {0}'.format(dayInTheFirstWeek)
    jours = 7*(week - 1) - dayInTheFirstWeek
    lundi = referenceThursday + timedelta(days=jours)
    ''' send days in iso format - then up to javascript to create the french day and month '''
    ''' python 2 to python 3 xrange to range '''
    return [ (lundi + timedelta(days=n)).isoformat() for n in range(7)]


def semaine(annee, sem):
    ''' utiliser datetime pour pouvoir ajouter des heures '''
    ref = datetime(annee, 1, 4) # Le 4 janvier est toujours en semaine 1
    j = ref.weekday()
    jours = 7*(sem - 1) - j
    ''' si ref n'est pas du type datetime impossible de rajouter un timedelta '''
    lundi = ref + timedelta(days=jours)
    ''' python 2 to python 3 xrange to range '''
    return [lundi + timedelta(days=n) for n in range(7)]


def convertEnglish2French(selectedDate):
    if (str(selectedDate).startswith("Monday")):
        return 'lundi'
    elif (str(selectedDate).startswith("Tuesday")):
        return 'mardi'
    elif (str(selectedDate).startswith("Wednesday")):
        return 'mercredi'
    elif (str(selectedDate).startswith("Thursday")):
        return 'jeudi'
    elif (str(selectedDate).startswith("Friday")):
        return 'vendredi'
    elif (str(selectedDate).startswith("Saturday")):
        return 'samedi'
    else:
        return 'dimanche'
   

def computeSelectedDate(selectedDate, week_number, year):
    for day in semaine(year, week_number):
        #print day
        #print day.strftime('%A')
        if str(convertEnglish2French(selectedDate)).startswith(day.strftime('%A')):
            return day
    return None


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
            ''' by default first is always in weekly mode '''
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


@login_required
@csrf_exempt
def addBooking(request):
    
    displayMode = DisplayMode()
    locale.setlocale(locale.LC_TIME, French_Locale)

    #print 'add booking user = {user}'.format(user=request.user)
    if request.method == 'POST':
        
        displayMode.initialise(request)
        #print 'method is POST {0}'.format(request.POST)
        
        #print 'Date and Hour of the slot: {theDate}'.format(theDate=theDate)
        year = displayMode.getYear()
        week_number = displayMode.getWeekNumber()
        month_number = displayMode.getMonthNumber()
        ''' python 2 to python 3 '''
        song = urllib.parse.unquote(request.POST['song'])
        studio_key = request.POST['studio']
        
        ''' date has the following format YYYY-MM-DDThh:mm:ss'''
        paris = timezone(TIME_ZONE)
        date_start = paris.localize(datetime.strptime(request.POST['date'] , '%Y-%m-%dT%H:%M:%S'))
        date_start = date_start.replace(
                                            hour= int(str(request.POST['start']).split(':')[0]),
                                            minute=int(str(request.POST['start']).split(':')[1]),
                                            second = 0)
        #print date_start
        
        ''' date has the following format YYYY-MM-DDThh:mm:ss '''
        date_end = date_start.replace(
                                    hour=int(str(request.POST['end']).split(':')[0]), 
                                    minute=int(str(request.POST['end']).split(':')[1]),
                                    second=0 )
        #print date_end
        ''' check specific case where dates are inversed  '''
        if (date_end <= date_start):
            if (date_start.minute<59):
                ''' if date are inversed add 15 minutes to start in order to get end '''
                date_end = date_start.replace(minute=max(date_start.minute+15, 59))
            else:
                ''' if date_start.minute == 59 then add ONE hour '''
                date_end = date_start.replace(hour=date_start.hour+1, minute=15)
        
        #print date_end.strftime("%A %d-%B-%Y %H:%M:%S")
        ''' management of repetitive reservations '''
        try:
            repetition = request.POST['repetition']
            #print 'reservation is repetitive !!!'
            if str(repetition).isdigit():
                repetition = int(repetition)
            else:
                repetition = 1
            #print 'number of repetitions = {repetition}'.format(repetition=repetition)
        except Exception as e:
            #print 'reservation is unique !!!'
            repetition = 1
            #print 'number of repetitions = {repetition}'.format(repetition=repetition)

        for weekIndex in range(0, repetition):
            ''' create repetitive reservations '''
            try:
                reservation = Reservation (
                            made_by     = request.user,
                            studio_key  = Studio.objects.get(pk=studio_key),
                            made_when   = paris.localize(datetime.now()),
                            date_start  = date_start + timedelta(days=7*weekIndex),
                            date_end    = date_end + timedelta(days=7*weekIndex),
                            song        = song,
                            author      = "inconnu")
                ''' record the new reservation '''
                reservation.save()
            except Exception as e:
                print ('exception= {e}'.format(e=e))
            
        ''' filter the user fields as we do not want to sent the password '''
        #users = serializers.serialize('json', list(User.objects.all()), fields=('username','first_name','last_name','email','is_superuser','is_active', 'is_staff'))
        ''' retrieve only users having done a reservation '''
        users = getStudioUsers(current_user=request.user)
        
        studios = serializers.serialize('json', list(Studio.objects.all()))
        
        ''' always return reservations depending upon the display mode weekly or monthly '''
        reservations = getReservations(displayMode, year, week_number)

        response_data = {
                    'current_user_id': request.user.id,
                    'year': year,
                    'week_number': week_number,
                    'month_number': month_number,
                    'users': users,
                    'studios': studios,
                    'reservations': reservations,
                    'frenchBankHolidays': FrenchBankHolidays(year).getAllBankHolidays(),
                    }
        ''' need to encode french months like février '''
        ''' python 2 to python 3 - no more encoding '''
        return HttpResponse(json.dumps(response_data, cls=JSONDateTimeEncoder), content_type="application/json")

    
@login_required
@csrf_exempt
def deleteBooking(request):
    
    displayMode = DisplayMode()
    locale.setlocale(locale.LC_TIME, French_Locale)

    #print 'delete booking - user= {user}'.format(user=request.user)
    if (request.method == 'POST'):
        
        displayMode.initialise(request)
        
        #print 'method id POST {0}'.format(request.POST)
        year = displayMode.getYear()
        week_number = displayMode.getWeekNumber()
        month_number = displayMode.getMonthNumber()

        ''' get the reservation with the provided primary key '''
        reservation = Reservation.objects.get(pk=request.POST['pk'])
        if (reservation is not None):
            user_id = reservation.made_by.id
            #print ' user who mades the reservation = {0}'.format(reservation.made_by)
            ''' check if current user is the owner of the reservation or staff or super-user '''
            if ((request.user == User.objects.get(pk=user_id)) or (request.user.is_staff) or (request.user.is_superuser)) :
                #print 'the current user is the owner of the reservation or belongs to staff '
                #print 'proceed with the deletion of the reservation '
                try:
                    reservation.delete()
                    
                except Exception as e:
                    print ('exception= {e}'.format(e=e))
                    
            else:
                print (' the current user is not the owner of the reservation ')
            
        ''' retrieve only users having done a reservation '''
        #users = serializers.serialize('json', list(User.objects.all()), fields=('username','first_name','last_name','email','is_superuser','is_active', 'is_staff'))
        users = getStudioUsers(current_user=request.user)
        studios = serializers.serialize('json', list(Studio.objects.all()))
        ''' the following order is needed before sending data to the templates '''
        ''' always return reservations depending upon the display mode weekly or monthly '''
        reservations = getReservations(displayMode, year, week_number)

        response_data = {
                    'current_user_id': request.user.id,
                    'year': year,
                    'week_number': week_number,
                    'month_number': month_number,
                    'users': users,
                    'studios': studios,
                    'reservations': reservations,
                    'frenchBankHolidays': FrenchBankHolidays(year).getAllBankHolidays(),
                    }
        ''' python 2 to python 3 - no more encoding in json.dumps '''
        return HttpResponse(json.dumps(response_data, cls=JSONDateTimeEncoder), content_type="application/json")
        
        
@login_required
@csrf_exempt
def modifyBooking(request):
    
    displayMode = DisplayMode()
    locale.setlocale(locale.LC_TIME, French_Locale)

    #print 'modify booking user= {0}'.format(request.user)
    if (request.method == 'POST'):
        
        displayMode.initialise(request)
        
        #print 'method id POST {0}'.format(request.POST)
        week_number = displayMode.getWeekNumber()
        month_number = displayMode.getMonthNumber()
        year = displayMode.getYear()
        
        reservation = Reservation.objects.get(pk=request.POST['pk'])
        if (reservation is not None):
            ''' get the user who mades the reservation '''
            user_id = reservation.made_by.id
            
            ''' date has the following format YYYY-MM-DDThh:mm:ss'''
            paris = timezone(TIME_ZONE)
            date_start = paris.localize(datetime.strptime(request.POST['date'] , '%Y-%m-%dT%H:%M:%S'))
            date_start = date_start.replace(
                                            hour= int(str(request.POST['start']).split(':')[0]),
                                            minute=int(str(request.POST['start']).split(':')[1]),
                                            second = 0)
            
            #print date_start
            ''' date has the following format Tuesday-16h00 '''
            date_end = date_start.replace(
                                        hour=int(str(request.POST['end']).split(':')[0]), 
                                        minute=int(str(request.POST['end']).split(':')[1]),
                                        second=0 )
            #print date_end
            ''' check specific case where dates are inversed  '''
            if (date_end <= date_start):
                if (date_start.minute<59):
                    date_end = date_start.replace(minute=max(date_start.minute+15, 59))
                else:
                    date_end = date_start.replace(hour=date_start.hour+1, minute=15)
                
            #print ' user who mades the reservation = {0}'.format(reservation.made_by)
            ''' check if current user is the owner of the reservation or staff or superuser '''
            if ((request.user == User.objects.get(pk=user_id)) or (request.user.is_staff) or (request.user.is_superuser)):
                
                reservation.date_start = date_start
                reservation.date_end = date_end
                #print 'the current user is the owner of the reservation '
                reservation.made_when = paris.localize(datetime.now())
                #print ''' proceed with the modification of the reservation '''
                ''' python 2 to python 3 '''
                song = urllib.parse.unquote(request.POST['song'])
                if ((song is not None) and (len(song)>0)):
                    reservation.song = song
                studio_key = request.POST['studio']
                try:
                    if (int(studio_key) > 0):
                        reservation.studio_key = Studio.objects.get(pk=studio_key)
                    reservation.save()
                except Exception as e:
                    print ('exception= {e}'.format(e=e))
            else:
                print (' the current user is not the owner of the reservation ')
            
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
                    'month_number': month_number,
                    'users': users,
                    'studios': studios,
                    'reservations': reservations,
                    'frenchBankHolidays': FrenchBankHolidays(year).getAllBankHolidays(),
                    }
        ''' python 2 to python 3 - no more encoding in json.dumps '''
        return HttpResponse(json.dumps(response_data, cls=JSONDateTimeEncoder), content_type="application/json")


@login_required
@csrf_exempt
def deleteOldBookings(request):
    
    #print "delete old bookings"
    displayMode = DisplayMode()
    locale.setlocale(locale.LC_TIME, French_Locale)
    
    displayMode.initialise(request)
        
    #print 'method id POST {0}'.format(request.POST)
    ''' this is the week that is displayed - not necessarily the current week '''
    week_number = displayMode.getWeekNumber()
    #print 'displayed week= {0}'.format(week_number)
    
    month_number = displayMode.getMonthNumber()
    year = displayMode.getYear()
    #print 'displayed year= {0}'.format(year)

    deletedReservations = []
    #print 'modify booking user= {0}'.format(request.user)
    if (request.method == 'POST'):
        #print "method is POST"
        ''' check if current user belongs to staff or is superuser '''
        if ( (request.user.is_staff) or (request.user.is_superuser) ):
            #print "user is staff or is super user"
            
            ''' get the reservations of the displayed week '''
            reservationsList = getFilteredReservations(year , week_number)
            for reservation in reservationsList:
                #print reservation
                ''' deep copy - preserve the reservation primary key '''
                deletedReservation = copy.deepcopy(reservation)
                try:
                    deletedReservations.append(deletedReservation)
                    reservation.delete()
                    
                except Exception as e:
                    print ('Delete old reservations - exception= {e}'.format(e=e))
                
                
    ''' retrieve only users owning a reservation '''
    users = getStudioUsers(current_user=request.user)
        
    studios = serializers.serialize('json', list(Studio.objects.all()))
    ''' the following order is needed before sending data to the templates '''
    ''' always return reservations depending upon the display mode weekly or monthly '''
    reservations = getReservations(displayMode, year, week_number)
    ''' deleted reservations '''
    deletedReservations = serializers.serialize('python', list(deletedReservations))

    response_data = {
                    'current_user_id': request.user.id,
                    'year': year,
                    'week_number': week_number,
                    'month_number': month_number,
                    'users': users,
                    'studios': studios,
                    'reservations': reservations,
                    'deletedReservations': deletedReservations,
                    'frenchBankHolidays': FrenchBankHolidays(year).getAllBankHolidays(),
                    }
    ''' python 2 to python 3 - json.dumps no more encoding '''
    return HttpResponse(json.dumps(response_data, cls=JSONDateTimeEncoder), content_type="application/json")
