import locale
import urllib

from django.contrib.auth.decorators import login_required
from django.template import loader
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from partitions.models import Partition, PVG, TABLATURE

# Create your views here.
French_Locale = ""

@login_required
def partitions(request):
    locale.setlocale(locale.LC_TIME, French_Locale)
    print ('starting partitions')
    
    if request.method == 'GET':
        print ('starting partitions - Get received')
        
        template = loader.get_template('partitions/partitions.html')
        partitions = Partition.objects.all()
        context = {
                'partitions'        : partitions,
            }
        return HttpResponse(template.render(context, request))
    
@login_required
@csrf_exempt
def recordNewPartition(request):
    locale.setlocale(locale.LC_TIME, French_Locale)
    print ('record new partition')
    
    if request.method == 'POST':
        print ('record new partition - POST received')
        print ('method is POST {0}'.format(request.POST))

        artist = ""
        name = ""
        comments = ""
        url = ""
        paper = False
        electronic = False
        partitionType = PVG
        try:
            name = request.POST['name']
            artist = request.POST['artist']
            paper = True if request.POST['paper'] == 'true' else False
            electronic = True if request.POST['electronic'] == 'true' else False
            partitionType = request.POST['type']
            comments = request.POST['comments']
            ''' in javascript we have used encodeURIComponent - need to user urllib.unquote '''
            ''' python 2 to python 3 '''
            url = urllib.parse.unquote(request.POST['url'])
            owner = request.user
            partition = Partition (owner=owner, artist=artist, name=name, paper=paper, electronic=electronic, partitionType=partitionType, comments=comments, url=url)
            ''' record the new reservation '''
            partition.save()
            
        except Exception as e:
            print ("record new partition - exception= {e}".format(e=e))
            
        template = loader.get_template('partitions/partitions.html')
        partitions = Partition.objects.all()
        context = {
                'partitions'        : partitions,
            }
        return HttpResponse(template.render(context, request))


@login_required
@csrf_exempt
def deletePartition(request):
    locale.setlocale(locale.LC_TIME, French_Locale)
    print ('delete partitions')
    
    if request.method == 'POST':
        print ('delete partition - POST received')
        print ('method is POST {0}'.format(request.POST))
        
        primary_key = 0
        try:
            primary_key = request.POST['pk']
            ''' get the partition with the provided primary key '''
            partition = Partition.objects.get(pk=int(primary_key))
            if (partition is not None) and (partition.owner == request.user):
                partition.delete()
                    
        except Exception as e:
            print ("delete partition - exception= {e}".format(e=e))
                
        template = loader.get_template('partitions/partitions.html')
        partitions = Partition.objects.all()
        context = {
                'partitions'        : partitions,
            }
        return HttpResponse(template.render(context, request))


@login_required
@csrf_exempt
def modifyPartition(request):
    locale.setlocale(locale.LC_TIME, French_Locale)
    print ('modify partition')
    
    if request.method == 'POST':
        print ('modify partition - POST received')
        print ('method is POST {0}'.format(request.POST))
        
        primary_key = 0
        try:
            primary_key = request.POST['pk']
            ''' get the partition with the provided primary key '''
            partition = Partition.objects.get(pk=int(primary_key))
            if (partition is not None) and (partition.owner == request.user):
                ''' modify it '''
                try:
                    artist = request.POST['artist']
                    partition.artist = artist
                    print ('partition artist has changed')
                except:
                    print ('partition artist remains unchanged')
                    
                try:
                    name = request.POST['name']
                    partition.name = name
                except:
                    print ('partition name remains unchanged')
                    
                try:
                    paper = request.POST['paper']
                    partition.paper = True if paper == 'true' else False
                except:
                    print ('partition paper remains unchanged')
                    
                try:
                    electronic = request.POST['electronic']
                    partition.electronic = True if electronic == 'true' else False
                except:
                    print ('partition electronic remains unchanged')
                    
                try:
                    partitionType = request.POST['type']
                    print ('partition type = {0}'.format(partitionType))
                    if (partitionType == TABLATURE):
                        print ('partition type is TABLATURE')
                        partition.partitionType = TABLATURE
                    elif (partitionType == PVG ):
                        print ('partition type is PVG')
                        partition.partitionType = PVG
                    
                except Exception as e:
                    print ('partition type remains unchanged - {e}'.format(e=e))
                    
                try:
                    comments = request.POST['comments']
                    partition.comments = comments
                except:
                    print ('partition comments remains unchanged')
                    
                try:
                    url = request.POST['url']
                    ''' python 2 to python 3 '''
                    partition.url = urllib.parse.unquote(url)
                except: 
                    print ('partition url remains unchanged')
            
                ''' save the changes '''
                partition.save()
            
        except Exception as e:
            print ("modify partition - exception= {e}".format(e=e))

                
        template = loader.get_template('partitions/partitions.html')
        partitions = Partition.objects.all()
        context = {
                'partitions'        : partitions,
            }
        return HttpResponse(template.render(context, request))