'''
Created on 4 oct. 2022

@author: robert
for python anywhere
'''

import os
import sys

path = os.path.expanduser('~/music-rungis')
if path not in sys.path:
    sys.path.insert(0, path)
    
os.environ['DJANGO_SETTINGS_MODULE'] = 'gettingstarted.settings'
from django.core.wsgi import get_wsgi_application
from django.contrib.staticfiles.handlers import StaticFilesHandler
application = StaticFilesHandler(get_wsgi_application())