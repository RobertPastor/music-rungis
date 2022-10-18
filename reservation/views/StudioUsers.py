'''
Created on 30 juil. 2016

Purpose : to retrieve only users that are owner of a reservation

@author: PASTOR Robert
'''

from reservation.models import Reservation
from django.core import serializers

def getStudioUsers(current_user):
    ''' use a set to avoid duplicates '''
    studio_users_list = set()
    for reservation in Reservation.objects.all():
        #print reservation.made_by
        studio_users_list.add(reservation.made_by)

    ''' add the current user '''
    studio_users_list.add(current_user)
    ''' serialize : 23 September 2016 - do not send email nor passwords '''
    studio_users = serializers.serialize('json', list(studio_users_list), fields=('username','first_name','last_name','is_superuser','is_active', 'is_staff'))
    #print studio_users
    return studio_users

