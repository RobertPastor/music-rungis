# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-04-13 21:00
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reservation', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='studio_key',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='reservation.Studio', verbose_name='Studio'),
        ),
    ]
