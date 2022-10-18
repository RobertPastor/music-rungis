# -*- coding: utf-8 -*-
'''
Created on Apr 7, 2016

@author: Robert PASTOR

manage a list of french bank holidays depending upon the year

'''
from datetime import datetime , timedelta

class FrenchBankHolidays(object):
    year = 0

    def __init__(self, _year):
        if ( type(_year) == str ):
            self.year = int(_year)
        self.year = _year
        
    def computeDimanchePaques(self):
        """ Calcule la date de Pâques d'une année donnée  (year = nombre entier)"""
        a=self.year // 100
        b=self.year % 100
        c=(3*(a+25))//4
        d=(3*(a+25))%4
        e=(8*(a+11))//25
        f=(5*a+b)%19
        g=(19*f+c-e)%30
        h=(f+11*g)//319
        j=(60*(5-d)+b)//4
        k=(60*(5-d)+b)%4
        m=(2*j-k-g+h)%7
        n=(g-h+m+114)//31
        p=(g-h+m+114)%31
        jour=p+1
        mois=n
        #print ('month: {mois}'.format(mois=mois))
        DimanchePaques = datetime(year=self.year, month=mois , day=jour)
        return DimanchePaques
    
    def computeLundiPaques(self):
        lundiPaques = self.computeDimanchePaques() + timedelta( days = 1 )
        return lundiPaques
    
    def computeLundiPentecote(self):
        ''' Lundi de Pentecôte = Pâques + 50 jours '''
        lundiPentecote = self.computeDimanchePaques() + timedelta( days = 50 )
        return lundiPentecote
    
    def computeJeudiAscension(self):
        ''' Jeudi de l'ascension = Pâques + 39 jours '''
        jeudiAscension = self.computeDimanchePaques() + timedelta( days = 39 )
        return jeudiAscension
    
    def getAllBankHolidays(self):
        frenchBankHolidays = []
        
        dictBankHoliday00 = {}
        dictBankHoliday00['name'] = "Jour de l'an"
        dictBankHoliday00['date'] = datetime(self.year, month=1, day=1).isoformat()
        frenchBankHolidays.append(dictBankHoliday00)
        
        dictBankHoliday01 = {}
        dictBankHoliday01['name'] = "Pâques"
        dictBankHoliday01['date'] = self.computeDimanchePaques().isoformat()
        frenchBankHolidays.append(dictBankHoliday01)
        
        dictBankHoliday02 = {}
        dictBankHoliday02['name'] = "Lundi de Pâques"
        dictBankHoliday02['date'] = self.computeLundiPaques().isoformat()
        frenchBankHolidays.append(dictBankHoliday02)

        dictBankHoliday03 = {}
        dictBankHoliday03['name'] = "Fête du Travail"
        dictBankHoliday03['date'] = datetime(self.year, month=5, day=1).isoformat()
        frenchBankHolidays.append(dictBankHoliday03)
        
        dictBankHoliday04 = {}
        dictBankHoliday04['name'] = "Jeudi de l'Ascension"
        dictBankHoliday04['date'] = self.computeJeudiAscension().isoformat()
        frenchBankHolidays.append(dictBankHoliday04)
  
        dictBankHoliday05 = {}
        dictBankHoliday05['name'] = "Armistice 8 mai 1945"
        dictBankHoliday05['date'] = datetime(self.year, month=5, day=8).isoformat()
        frenchBankHolidays.append(dictBankHoliday05)
        
        dictBankHoliday06 = {}
        dictBankHoliday06['name'] = "Lundi de Pentecôte"
        dictBankHoliday06['date'] = self.computeLundiPentecote().isoformat()
        frenchBankHolidays.append(dictBankHoliday06)

        dictBankHoliday07 = {}
        dictBankHoliday07['name'] = "Fête Nationale"
        dictBankHoliday07['date'] = datetime(self.year, month=7, day=14).isoformat()
        frenchBankHolidays.append(dictBankHoliday07)

        dictBankHoliday08 = {}
        dictBankHoliday08['name'] = "Assomption - 15 Août"
        dictBankHoliday08['date'] = datetime(self.year, month=8, day=15).isoformat()
        frenchBankHolidays.append(dictBankHoliday08)
        
        dictBankHoliday09 = {}
        dictBankHoliday09['name'] = "Toussaint"
        dictBankHoliday09['date'] = datetime(self.year, month=11, day=1).isoformat()
        frenchBankHolidays.append(dictBankHoliday09)

        dictBankHoliday10 = {}
        dictBankHoliday10['name'] = "Armistice 11 Novembre 1918"
        dictBankHoliday10['date'] = datetime(self.year, month=11, day=11).isoformat()
        frenchBankHolidays.append(dictBankHoliday10)
        
        dictBankHoliday11 = {}
        dictBankHoliday11['name'] = "Noël"
        dictBankHoliday11['date'] = datetime(self.year, month=12, day=25).isoformat()
        frenchBankHolidays.append(dictBankHoliday11)
        
        dictBankHoliday12 = {}
        dictBankHoliday12['name'] = "Jour de l'an"
        # jour de l'an de l'année suivante
        dictBankHoliday12['date'] = datetime(self.year+1, month=1, day=1).isoformat()
        frenchBankHolidays.append(dictBankHoliday12)

        return frenchBankHolidays
        
    
#============================================
if __name__ == '__main__':
    
    strftimeFormat = ('%A %d-%B-%Y')
    
    for year in range(2010, 2050, 1):
        print ('=================================')
        print ('main french Bank Holidays starting - year = {year}'.format(year=year))
        frenchBankHolidays =  FrenchBankHolidays(year)
        print ('Dimanche de Paques = {0}'.format(frenchBankHolidays.computeDimanchePaques().strftime(strftimeFormat)))
        print ('Lundi de Paques = {0}'.format(frenchBankHolidays.computeLundiPaques().strftime(strftimeFormat)))
        print ('Lundi de Pentecôte = {0}'.format(frenchBankHolidays.computeLundiPentecote().strftime(strftimeFormat)))
        print ("Jeudi de l'Ascension = {0}".format(frenchBankHolidays.computeJeudiAscension().strftime(strftimeFormat)))
        print ('-----------------')
        print (frenchBankHolidays.getAllBankHolidays())