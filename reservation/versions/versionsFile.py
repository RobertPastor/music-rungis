#-*- coding: utf-8 -*-

'''
Created on 6 mai 2016

@author: PASTOR Robert
This class is managing the versions
'''

class VersionsList(object):

    def __init__(self):
        self.versionsList = []

    def add(self, version):
        self.versionsList.append(version)
        
    def __str__(self):
        for version in self.versionsList:
            print (version)
    
    def get(self):
        for version in self.versionsList:
            yield version
            
    def sort(self):
        return sorted(self.versionsList, key=lambda version: version.version_name)
    
    def reverse(self):
        return sorted(self.versionsList, key=lambda version: version.version_name, reverse=True)
    
    def last(self):
        return self.versionsList[-1]
    
    def first(self):
        return self.versionsList[0]
    
    
    def fill(self):
        
        version = Version(version_name='Version 4.3' , version_date='31st October 2022', 
                          change_rationale=''' Hours start from 7 to 19 minutes step by 5 minutes ''')
        self.add(version)
        
        version = Version(version_name='Version 4.2' , version_date='18th October 2022', 
                          change_rationale='''migrate to python anywhere ''')
        self.add(version)
        
        version = Version(version_name='Version 4.1' , version_date='9th January 2022', 
                          change_rationale='''cannot delete old reservations in previous year ''')
        self.add(version)

        version = Version(version_name='Version 4.0' , version_date='10 Mars 2020', 
                          change_rationale='''python 2 to python 3.7 and Django 1.11 to Django 2.2 ''')
        self.add(version)
        
        version = Version(version_name='Version 3.9' , version_date='18 Mai 2019', 
                          change_rationale=''' bouton suppression des réservations n'apparait pas si aucune réservation dans la semaine. ''')
        self.add(version)
        
        version = Version(version_name='Version 3.8' , version_date='5 Mai 2019', 
                          change_rationale=''' Boutons pour réservations périodiques et pour suppression des anciennes réservations. ''')
        self.add(version)
        
        version = Version(version_name='Version 3.7' , version_date='10 Mars 2018', 
                          change_rationale=''' les réservations périodiques ont des heures décalées en cas de changement d'heure hiver-été. ''')
        self.add(version)
        
        version = Version(version_name='Version 3.6' , version_date='16 Décembre 2017', 
                          change_rationale=''' gestion des pattern de réservations répétitives pré-enregistrées. ''')
        self.add(version)
        
        version = Version(version_name='Version 3.5' , version_date='3 Décembre 2017', 
                          change_rationale=''' gestion des réservations répétitives pour staff uniquement. ''')
        self.add(version)
        
        version = Version(version_name='Version 3.4' , version_date='17 Novembre 2017', 
                          change_rationale=''' ajout d'un message pour penser à supprimer les anciennes réservations. ''')
        self.add(version)
        
        version = Version(version_name='Version 3.3' , version_date='12 février 2017', 
                          change_rationale=''' ajout d'un filtre sur nom de l'artiste et titre du morceau. ''')
        self.add(version)
        
        version = Version(version_name='Version 3.2' , version_date='7 février 2017', 
                          change_rationale=''' gestion des URL avec encodeURIComponent dans le javascript et urllib.unquote dans la vue django. ''')
        self.add(version)
        
        version = Version(version_name='Version 3.1' , version_date='18 janvier 2017', 
                          change_rationale=''' gestion des partitions. ''')
        self.add(version)
        
        version = Version(version_name='Version 2.13' , version_date='31 décembre 2016', 
                          change_rationale=''' excel Lisez-moi avec date du jour accentuée. ''')
        self.add(version)
        
        version = Version(version_name='Version 2.12' , version_date='29 décembre 2016', 
                          change_rationale=''' excel mensuel - semaine 52 de l'année 2016. ''')
        self.add(version)
        
        version = Version(version_name='Version 2.11' , version_date='26 décembre 2016', 
                          change_rationale=''' message de bienvenue en français - connexion - déconnexion. ''')
        self.add(version)
        
        version = Version(version_name='Version 2.10' , version_date='23 Septembre 2016', 
                          change_rationale=''' ne pas envoyer au browser les passwords ni les adresses email des utilisateurs ayant créé une réservation. ''')
        self.add(version)
        
        version = Version(version_name='Version 2.9' , version_date='22 Septembre 2016', 
                          change_rationale=''' en mode weekly seules les réservations de la semaine sont envoyées au browser. ''')
        self.add(version)
        
        version = Version(version_name='Version 2.8' , version_date='17 Septembre 2016', 
                          change_rationale=''' first dates of a month as 1er , 2, 3 without a leading zero ''')
        self.add(version)
        
        version = Version(version_name='Version 2.7' , version_date='3 Août 2016', 
                          change_rationale=''' context menu avec copier-coller ''')
        self.add(version)  
        
        version = Version(version_name='Version 2.6' , version_date='31 Juillet 2016', 
                          change_rationale='''version and version date sent to the browser ''')
        self.add(version)  
        
        version = Version(version_name='Version 2.5' , version_date='31 Juillet 2016', 
                          change_rationale='''send to the browser only users having performed a reservation ''')
        self.add(version)        
        
        version = Version(version_name='Version 2.4' , version_date='30 Juillet 2016', 
                          change_rationale=''' Studio has a color with a default value ''')
        self.add(version)
        
        version = Version(version_name='Version 2.3' , version_date='17 Juin 2016', 
                          change_rationale=''' boutons avec effet hover - Excel monthly output 29 fev''')
        self.add(version)
        
        version = Version(version_name='Version 2.2' , version_date='29 Mai 2016', 
                          change_rationale=''' Context menu on reservation.''')
        self.add(version)
        
        version = Version(version_name='Version 2.1' , version_date='27 Mai 2016', 
                          change_rationale=''' bandeau commission musique.''')
        self.add(version)

        version = Version(version_name='Version 2.0' , version_date='24 Mai 2016', 
                          change_rationale=''' use an overlay to highlight ajax loading.''')
        self.add(version)
        
        version = Version(version_name='Version 1.9' , version_date='22 Mai 2016', 
                          change_rationale=''' Jours fériés.''')
        self.add(version)

        version = Version(version_name='Version 1.8' , version_date='21 Mai 2016', 
                          change_rationale=''' help avec informations sur les deux modes de présentation : hebdomadaire et mensuel.''')
        self.add(version)
        
        version = Version(version_name='Version 1.7' , version_date='21 Mai 2016', 
                          change_rationale=''' sortie EXCEL contient heure de début et heure de fin.''')
        self.add(version)
        
        version = Version(version_name='Version 1.6' , version_date='18 Mai 2016', 
                          change_rationale=''' lien mail à un administrateur.''')
        self.add(version)
        
        version = Version(version_name='Version 1.5' , version_date='15 Mai 2016', 
                          change_rationale=''' vue mensuelle.''')
        self.add(version)
        
        version = Version(version_name='Version 1.4' , version_date='11 Mai 2016', 
                          change_rationale=''' tooltip sur événement avec heure de début et fin.''')
        self.add(version)
        
        version = Version(version_name='Version 1.3' , version_date='9 Mai 2016', 
                          change_rationale=''' lien sur le site d'admin dans le bandeau si user=staff ou superuser.''')
        self.add(version)
        
        version = Version(version_name='Version 1.2' , version_date='8 Mai 2016', 
                          change_rationale=''' gestion nouvelle de l'aide par un dialog modal.''')
        self.add(version)
        
        version = Version(version_name='Version 1.1' , version_date='8 Mai 2016', 
                          change_rationale='changement du mot de passe.')
        self.add(version)
        
        version = Version(version_name='Version 1.0' , version_date='6 Mai 2016', 
                          change_rationale='undo resize.')
        self.add(version)
        
        version = Version(version_name='Version 0.9' , version_date='6 Mai 2016', 
                          change_rationale='utilisation de la librairie DayPilot.org.')
        self.add(version)
        
        version = Version(version_name='Version 0.8', version_date='17 Avril 2016', 
                          change_rationale='lien logout ajouté sur la page de réservations - download Excel.')
        self.add(version)
        
        version = Version(version_name='Version 0.7', version_date='13 Avril 2016', 
                          change_rationale="modification de la taille d'une édit box lorsque l'on clique sur le nom d'une chanson.")
        self.add(version)
        
        version = Version(version_name='Version 0.6', version_date='13 Avril 2016',
                          change_rationale='amélioration de la vue administration des réservations et des messages site.')
        self.add(version)
        
        version = Version(version_name='Version 0.5', version_date='9 Avril 2016',
                          change_rationale='modification des couleurs de la page de réservations.')
        self.add(version)
        
        version = Version(version_name='Version 0.4', version_date='7 Avril 2016',
                          change_rationale='busy animation et affichage des jours fériés.')
        self.add(version)
        
        version = Version(version_name='Version 0.3', version_date='5 Avril 2016',
                          change_rationale='seules les réservations de la semaine courante sont transmises au browser.')
        self.add(version)
        
        version = Version(version_name='Version 0.2', version_date='4 Avril 2016',
                          change_rationale='si deux réservations tombent exactement la même heure alors la réservation du studio 1 est visualisée avant celle du studio 2')
        self.add(version)
        
        version = Version(version_name='Version 0.1', version_date='4 Avril 2016',
                          change_rationale=''' gestion du passage à une année antérieure ou passage vers l'année suivante. ''')
        self.add(version)


class Version(object):
    
    def __init__(self, version_name , version_date, change_rationale):
        self.version_name = version_name
        self.version_date = version_date
        self.change_rationale = change_rationale
        
    def getDate(self):
        return self.version_date
    
    def getRationale(self):
        return self.version_rationale
    
    def __cmp__(self, other):
        if hasattr(other, 'version_name'):
            return self.version_name < (other.version_name)
        
    def __repr__(self):
        return '{} - {} - {}'.format(
                                  self.version_name,
                                  self.version_date,
                                  str(self.change_rationale))
     
#============================================
if __name__ == '__main__':
    pass

    versionsList = VersionsList()
    versionsList.fill()

    #print versionsList
    print ('==============')
    for version in (versionsList.get()):
        print (version)
        
    print ('==============')
    for version in versionsList.sort():
        print (version)
    
    print ('==============')
    for version in versionsList.reverse():
        print (version)
        
    print ('==============')
    current_version = versionsList.reverse()[0]
    print (current_version)
    
    print ('======== last ======')
    print (versionsList.last())
    
    print ('======== first ======')
    print (versionsList.first())

