from django.contrib import admin

# Register your models here.
from reservation.models import Studio, Reservation, WeekDay, WeeklyReservation


class ReservationAdmin(admin.ModelAdmin):
    list_display = ('studio_key', 'date_start' , 'date_end', 'song', 'made_by')
    
''' Robert - 30th July 2016 '''
class StudioAdmin(admin.ModelAdmin):
    list_display = ( 'name' , 'status', 'is_piano', 'color')
    
class WeekDayAdmin(admin.ModelAdmin):
    list_display = ( 'name' , )
    
class WeeklyReservationAdmin(admin.ModelAdmin):
    list_display = ( 'created_by', 'created_when', 'studio_key', 'activity', 'weekDay_key' , 'starting_hour', 'starting_minutes', 'ending_hour', 'ending_minutes')
    
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(Studio, StudioAdmin)
admin.site.register(WeekDay, WeekDayAdmin)
admin.site.register(WeeklyReservation, WeeklyReservationAdmin)
