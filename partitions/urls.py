from django.conf.urls import re_path

#from django.views.decorators.csrf import csrf_exempt
from partitions.views import partitions, recordNewPartition, deletePartition, modifyPartition

app_name = "partitions"

urlpatterns = [
               
    re_path(r'^$', partitions, name='partitions'),
    re_path(r'^recordNewPartition$', recordNewPartition , name = 'recordNewPartition'),
    re_path(r'^deletePartition$', deletePartition , name = 'deletePartition'),
    re_path(r'^modifyPartition$', modifyPartition , name = 'modifyPartition'),

]

