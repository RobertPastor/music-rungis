from django.conf.urls import re_path

from reservation.views import modifyPeriod, addBooking, deleteBooking, modifyBooking, reservations, deleteOldBookings
from reservation.WeeklyReservationsViews import generateWeeklyReservations
from reservation.ExcelOutput import createExcelOutput 
#from django.views.decorators.csrf import csrf_exempt

app_name = "reservation"

urlpatterns = [
    re_path(r'^$', reservations, name='reservations'),
    
    re_path(r'^modifyPeriod$', modifyPeriod , name = 'modifyPeriod'),
    re_path(r'^addBooking$', addBooking , name = 'addBooking'),
    re_path(r'^deleteBooking$', deleteBooking , name = 'deleteBooking'),
    re_path(r'^modifyBooking$', modifyBooking , name = 'modifyBooking'),
    re_path(r'^generateWeeklyReservations$', generateWeeklyReservations , name = 'generateWeeklyReservations'),
    re_path(r'^deleteOldBookings$', deleteOldBookings , name = 'deleteOldBookings'),
    
]

''' view to create an EXCEL file '''
urlpatterns += [
    re_path(r'^excel/$', createExcelOutput , name='createExcel'),
]