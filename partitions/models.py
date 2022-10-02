#-*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

''' partition type = tablature '''
TABLATURE = 'TAB'
''' partition PVG (piano, vocal et guitare) '''
PVG = 'PVG'

PARTITION_TYPES = (
        (TABLATURE, 'Tablature'),
        (PVG, 'PVG'),
    )

class Partition(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    artist = models.CharField(max_length=250, null=False, blank=False)
    ''' name of the partition '''
    name = models.CharField(max_length=1500, null=False, blank=False)
    ''' disponible en support papier '''
    paper = models.BooleanField()
    ''' partition disponible en support électronique '''
    electronic = models.BooleanField()
    ''' type of a partition '''
    partitionType = models.CharField(max_length=3, choices=PARTITION_TYPES, default=TABLATURE, )
    comments = models.TextField(null=True, blank=True)
    url = models.URLField(max_length=1500, null=True, blank=True)