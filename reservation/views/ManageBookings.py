#-*- coding: utf-8 -*-
'''
Created on 15 oct. 2022

@author: robert
'''


import locale
import urllib
import json
import copy

from django.http import HttpResponse

from pytz import timezone
from datetime import datetime , timedelta

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.contrib.auth.models import User

from reservation.views.displayModeFile import DisplayMode

from gettingstarted.settings import TIME_ZONE

from reservation.models import Studio, Reservation
from reservation.views.StudioUsers import getStudioUsers
from reservation.views.ManageReservations import getReservations, getFilteredReservations
from reservation.views.ManagePeriods import JSONDateTimeEncoder
from reservation.views.BankHolidays import FrenchBankHolidays


French_Locale = ""
encoding = 'utf-8'

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
