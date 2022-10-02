from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.core import serializers

from hello.models import Greeting
from hello.models import SiteMessage

# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    template = loader.get_template('./index.html')

    siteMessages = []
    for siteMessage in SiteMessage.objects.all().order_by("event_date"):
        if siteMessage.active == True:
            siteMessages.append(siteMessage)
            
    siteMessages = serializers.serialize('json', siteMessages)
    
    context = {'siteMessages' : siteMessages}
    return HttpResponse(template.render(context, request))


def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()
    return render(request, 'db.html', {'greetings': greetings})


def tests(request):
    template = loader.get_template('./tests.html')
    context = {}
    return HttpResponse(template.render(context, request))
