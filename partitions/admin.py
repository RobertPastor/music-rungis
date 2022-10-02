from django.contrib import admin

# Register your models here.
from partitions.models import Partition

class PartitionAdmin(admin.ModelAdmin):
    list_display = ('owner', 'artist' , 'name', 'paper', 'electronic', 'partitionType', 'comments', 'url')
    
    
admin.site.register(Partition, PartitionAdmin)
