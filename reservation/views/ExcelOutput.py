#-*- coding: utf-8 -*-

'''
Created on Apr 14, 2016

@author: Robert Pastor
'''

import locale
#import StringIO
import io
import calendar

from xlsxwriter import Workbook
#from xlwt.Formatting import Pattern , Font, Alignment, Borders
#from xlwt.Style import XFStyle
#from xlwt.Style import colour_map

from datetime import datetime , timedelta, date

from reservation.views.arial10 import fitwidth
from reservation.models import Reservation
from reservation.versions.versionsFile import VersionsList

from django.shortcuts import  HttpResponse
from django.utils import timezone

French_Locale = ""

startingHours = 9
endingHours = 20

frenchMonths = [ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];


def semaine(annee, sem):
    ''' utiliser datetime pour pouvoir ajouter des heures '''
    ref = datetime(annee, 1, 4) # Le 4 janvier est toujours en semaine 1
    j = ref.weekday()
    jours = 7*(sem - 1) - j
    ''' si ref n'est pas du type datetime impossible de rajouter un timedelta '''
    lundi = ref + timedelta(days=jours)
    ''' python 2 to python 3 xrange to range '''
    return [lundi + timedelta(days=n) for n in range(7)]


class FitSheetWrapper(object):
    """Try to fit columns to max size of any entry.
    To use, wrap this around a worksheet returned from the 
    workbook's add_sheet method, like follows:

        sheet = FitSheetWrapper(book.add_sheet(sheet_name))

    The worksheet interface remains the same: this is a drop-in wrapper
    for auto-sizing columns.
    """
    def __init__(self, sheet):
        self.sheet = sheet
        self.widths = dict()

    def write(self, r, c, label='', *args, **kwargs):
        self.sheet.write(r, c, label, *args, **kwargs)
        ''' case when we want to set a style in an empty '''
        if not(label is None):
            width = int(fitwidth(label))
            if width > self.widths.get(c, 0):
                self.widths[c] = width
                self.sheet.col(c).width = width

    def __getattr__(self, attr):
        return getattr(self.sheet, attr)


def slotHasReservation(hour, day, year, weekNumber):
    for reservation in Reservation.objects.all():
        ''' to get local time '''
        date_start = timezone.localtime(reservation.date_start)
        if ( (date_start.isocalendar()[0] ==  year) and 
            (date_start.isocalendar()[1] == weekNumber) and
            (date_start.day == day.day) and (date_start.hour == hour)):
            return True
    
    return False


'''def getReservationCellStyle():
    
    styleResa = XFStyle()
    
    fontResa = Font() # Create the Font
    fontResa.name = 'Arial'
    fontResa.height = 10 * 20 # 11 * 20, for 11 point
    styleResa.font = fontResa
    
    borders = Borders()
    borders.bottom = Borders.THIN
    borders.top = Borders.THIN
    borders.left = Borders.THIN
    borders.right = Borders.THIN
    styleResa.borders= borders
    
    patternSlot = Pattern()
    patternSlot.pattern = Pattern.SOLID_PATTERN
    patternSlot.pattern_fore_colour = colour_map['light_green']
    styleResa.pattern = patternSlot
    
    return styleResa


def getHoursCellStyle():
       
    styleHours = XFStyle()
    font = Font() # Create the Font
    font.name = 'Arial'
    font.height = 10 * 20 # 11 * 20, for 11 point
    font.bold = True
    styleHours.font = font # Apply the Font to the Style

    borders = Borders()
    borders.bottom = Borders.THIN
    borders.top = Borders.THIN
    borders.left = Borders.THIN
    borders.right = Borders.THIN
    styleHours.borders= borders
    
    pattern = Pattern()
    pattern.pattern = Pattern.SOLID_PATTERN
    pattern.pattern_fore_colour = colour_map['lavender']
    styleHours.pattern = pattern
    
    return styleHours


def getStyleEntete():
    
    styleEntete = XFStyle()
    
    font = Font() # Create the Font
    font.name = 'Arial'
    font.height = 10 * 20 # 11 * 20, for 11 point
    styleEntete.font = font
    
    borders = Borders()
    borders.bottom = Borders.THIN
    borders.top = Borders.THIN
    borders.left = Borders.THIN
    borders.right = Borders.THIN
    styleEntete.borders= borders
    return styleEntete


def getWeekDaysStyle():
    
    styleWeekDays = XFStyle()
    borders = Borders()
    borders.bottom = Borders.THIN
    borders.top = Borders.THIN
    borders.left = Borders.THIN
    borders.right = Borders.THIN
    styleWeekDays.borders= borders
    
    font = Font() # Create the Font
    font.name = 'Arial'
    font.height = 10 * 20 # 11 * 20, for 11 point
    #font.bold = True
    styleWeekDays.font = font # Apply the Font to the Style
    
    alignment = Alignment()
    alignment.horz = Alignment.HORZ_CENTER    
    styleWeekDays.alignment = alignment
    
    pattern = Pattern()
    pattern.pattern = Pattern.SOLID_PATTERN
    pattern.pattern_fore_colour = colour_map['light_green']
    styleWeekDays.pattern = pattern
    
    return styleWeekDays
    
    def getEmptyCellStyle():
    
    emptyStyle = XFStyle()
    
    fontResa = Font() # Create the Font
    fontResa.name = 'Arial'
    fontResa.height = 10 * 20 # 11 * 20, for 11 point
    emptyStyle.font = fontResa
    
    borders = Borders()
    borders.bottom = Borders.DASHED
    borders.top = Borders.DASHED
    borders.left = Borders.DASHED
    borders.right = Borders.DASHED
    emptyStyle.borders= borders
    
    return emptyStyle


def getSlotCellStyle():
    
    styleSlot = XFStyle()
    
    font = Font() # Create the Font
    font.name = 'Arial'
    font.height = 10 * 20 # 11 * 20, for 11 point
    styleSlot.font = font
    
    borders = Borders()
    borders.bottom = Borders.DASHED
    borders.top = Borders.DASHED
    borders.left = Borders.DASHED
    borders.right = Borders.DASHED
    styleSlot.borders= borders
    
    patternSlot = Pattern()
    patternSlot.pattern = Pattern.SOLID_PATTERN
    patternSlot.pattern_fore_colour = colour_map['light_green']
    styleSlot.pattern = patternSlot
    
    return styleSlot
    
'''

def writeReadMe(workbook, year, monthNumber, weekNumber):
    
    wsReadMe = (workbook.add_worksheet("Lisez-moi"))
    styleEntete = workbook.add_format({'bold': False, 'border':True})
    styleLavender = workbook.add_format({'bold': True, 'border':True, 'bg_color': 'yellow'})
    
    row = 0
    wsReadMe.write(row, 0 , "Commission Musique - Rungis", styleLavender)
    wsReadMe.write(row, 1 , "Réservations de studios", styleEntete)
    row += 1
    wsReadMe.write(row, 0, "Année", styleLavender)
    wsReadMe.write(row, 1, str(year), styleEntete)
    row += 1
    if (monthNumber>0):
        wsReadMe.write(row, 0, "Mois", styleLavender)
        wsReadMe.write(row, 1, frenchMonths[monthNumber-1] , styleEntete)
    else:
        wsReadMe.write(row, 0, "Semaine", styleLavender)
        wsReadMe.write(row, 1, str(weekNumber) , styleEntete)
        
    row += 1
    wsReadMe.write(row, 0, "Date de l'export", styleLavender)
    strDay = datetime.today().strftime("%A")
    strDay += ' ' + datetime.today().strftime("%d")
    ''' month between 1 and 12 inclusive '''
    strDay += ' ' + frenchMonths[datetime.today().month-1]
    strDay += ' ' + datetime.today().strftime("%Y")
    strDay += ' ' + datetime.today().strftime("%Hh%Mm%S")
    wsReadMe.write(row, 1, strDay, styleEntete)
    
    row += 1
    ''' get the history of versions '''
    versionsList = VersionsList()
    versionsList.fill()
    wsReadMe.write(row, 0, "Version", styleLavender)
    wsReadMe.write(row, 1, versionsList.first().version_name, styleEntete)

    row += 1
    wsReadMe.write(row, 0, "Date de la version", styleLavender)
    wsReadMe.write(row, 1, versionsList.first().version_date, styleEntete)
    
    ''' set width of each column '''
    wsReadMe.set_column(0 , 1 , len("Commission Musique - Rungis"))


def writeDaysOfTheWeek(workbook, ws, year, weekNumber):
    
    #styleWeekDays = getWeekDaysStyle()
    styleWeekDays = workbook.add_format({'bold': True, 'border':True, 'bg_color': 'cyan'})

    ''' write days of the week '''
    row = 0
    col = 1
    maxLength = 0
    dayCount = 1
    for day in semaine(annee=year , sem=weekNumber):
        ''' unicode latin-1 is needed otherwise got encode error '''
        strDay = day.strftime("%A")
        strDay += ' ' + day.strftime("%d")
        ''' month between 1 and 12 inclusive '''
        strDay += ' ' + frenchMonths[day.month-1]
        strDay += ' ' + day.strftime("%Y")
        if (len(strDay)>maxLength):
            maxLength = len(strDay)
        ws.write (row, col , strDay , styleWeekDays)
        #ws.write (row, col , unicode(day.strftime("%A %d %B %Y"), 'latin-1'), styleWeekDays)
        col += 1
        dayCount += 1
        if (dayCount>5):
            ''' write only until friday '''
            break
    ''' store max columns to be used when we fill with empty cells having only a border '''
    maxColumns = col
    ''' set column width '''
    ws.set_column(1, col, maxLength)
    return maxColumns



def writeReservations(workbook, ws, year, weekNumber, maxColumns):
    ''' filling the worksheet with the reservations data '''
    styleHours = workbook.add_format({'bold': True, 'border':True, 'bg_color': 'yellow'})
    styleSlot = workbook.add_format({'border':True})
    styleResa = workbook.add_format({'border':True})
    emptyStyle = workbook.add_format({'border':True})
    
    ''' need to have an ordered list of all Hours-Minutes '''
    orderedReservations = []
    ''' build the ordered list of Hours Minutes to be used when building the first vertical columns '''
    for reservation in Reservation.objects.all():
        ''' get the local time '''
        date_start = timezone.localtime(reservation.date_start)
        
        if ((reservation.date_start.isocalendar()[0] == year) 
            and (reservation.date_start.isocalendar()[1] == weekNumber)):
            
            #print "--- local time {0}".format(date_start)
            #print '{hour:02d}'.format(hour=date_start.hour)
            #print '{minute:02d}'.format(minute=date_start.minute)
            ''' hours minutes and primary key '''
            hourMinutes = '{hour:02d}{minute:02d}-{studioId}-{id}'.format(hour=date_start.hour, 
                                                               minute=date_start.minute,
                                                               studioId=reservation.studio_key.id,
                                                               id=reservation.id)
            #print ' reservation - {0}'.format(date_start.strftime("%Y-%m-%d %H:%M:%S"))
            orderedReservations.append(hourMinutes)
        
    #print sorted(orderedReservations)
    
    row = 1
    ''' fill empty cells '''
    initialRow = row
    ''' xlwt constraints cannot write twice the same cell content '''
    dictOfWrittenCells = {}
    ''' build the column with the hours '''
    for hour in range(startingHours, endingHours): 
        ''' write header line in first column = col = ZERO '''
        ws.write(row, 0, '{hour:02d}h00'.format(hour=hour), styleHours)
        row += 1
        currentHour = '{hour:02d}00'.format(hour=hour)
        nextHour = '{hour:02d}00'.format(hour=hour+1)
        for resa in sorted(orderedReservations):
            if (int(resa[0:4]) >= int(currentHour)) and (int(resa[0:4]) < int(nextHour)):
                ''' in column ONE we write the Hour-Minute line '''
                ws.write(row , 0, str(resa[0:2])+'h'+str(resa[2:4]) , styleSlot)
                ''' reservation primary key '''
                pk = resa.split("-")[-1]
                ''' get the reservation with its primary key '''
                reservation = Reservation.objects.get(pk=pk)
                strCellContent = ""
                if (reservation):
                    date_start = timezone.localtime(reservation.date_start)
                    date_end = timezone.localtime(reservation.date_end)
                    ''' prepare content of the cell '''
                    strCellContent = reservation.studio_key.name
                    strCellContent += " - " + date_start.strftime("%Hh%M")
                    strCellContent += " - " + date_end.strftime("%Hh%M")
                    strCellContent += " - " + reservation.song
                else:
                    date_start = timezone.localtime(datetime.now())
                    
                ws.write(row, date_start.weekday() + 1, strCellContent , styleResa)
                ''' store the cells that have been written '''
                key = '{row:02d}{col:02d}'.format(row=row, col=date_start.weekday() + 1)
                dictOfWrittenCells[key] = {'pk': pk}
                row += 1
                

    ''' fill all empty cells '''
    #print dictOfWrittenCells
    lastRow = row
    row = initialRow
    for row in range(initialRow, lastRow):
        for col in range(1, maxColumns):
            key = '{row:02d}{col:02d}'.format(row=row, col=col)
            if (not(key in dictOfWrittenCells)):
                ws.write(row , col, None, emptyStyle)
                

def createExcelWorkbook(memoryFile, year, monthNumber, weekNumber):
    ''' create the EXCEL workbook '''
    ''' create the workbook '''
    wb = Workbook(memoryFile)
    ''' write the readme sheet '''
    writeReadMe(workbook=wb, year=year, monthNumber=monthNumber, weekNumber=weekNumber)
    
    if (monthNumber > 0):
        ''' the display mode is monthly '''
        for year_weekNumber in computeListOfWeeks(year, monthNumber):
            
            year = int(year_weekNumber.split('-')[0])
            weekNumber = int(year_weekNumber.split('-')[1])
            
            ''' create another sheet - use special class with cell width adjusting feature '''
            ws = (wb.add_worksheet('Année'+"-"+str(year)+"-Semaine-"+ str(weekNumber)))
            try:
                ''' write first row containing the days of the week '''
                maxColumns = writeDaysOfTheWeek(workbook=wb, ws=ws, year=year, weekNumber=weekNumber)
                ''' write the reservations in the EXCEL file '''
                writeReservations(workbook=wb, ws=ws, year=year, weekNumber=weekNumber, maxColumns=maxColumns)
                #''' manage exception '''
            except Exception as e:
                ws.write(r=1, c=0, label='{e}'.format(e=e))
    else:
        ''' month number is null we create only ONE week sheet '''
        ''' create another sheet - use special class with cell width adjusting feature '''
        ws = (wb.add_worksheet('Année'+"-"+str(year)+"-Semaine-"+ str(weekNumber)))
        try:
            ''' write first row containing the days of the week '''
            maxColumns = writeDaysOfTheWeek(workbook=wb, ws=ws, year=year, weekNumber=weekNumber)
            ''' write the reservations in the EXCEL file '''
            writeReservations(workbook=wb, ws=ws, year=year, weekNumber=weekNumber, maxColumns=maxColumns)
                #''' manage exception '''
        except Exception as e:
            ws.write(r=1, c=0, label='{e}'.format(e=e))
       
    return wb


def computeListOfWeeks(year, month):
    setOfWeeks = set()
    nbDaysInMonth = calendar.monthrange(year=year, month=month)[1]
    print ('Excel Output - number of days in the month = {0}'.format(nbDaysInMonth))
    for day in range(1, nbDaysInMonth+1):
        internalDate = date(year=year, month=month, day=day)
        #use iso calendar to get the ISO week numbers
        setOfWeeks.add(str(internalDate.isocalendar()[0])+'-'+str(internalDate.isocalendar()[1]))

    # return a sorted list - ['2016-52', '2017-1', '2017-2', '2017-3', '2017-4', '2017-5']
    #print sorted(list(setOfWeeks))
    return sorted(list(setOfWeeks))


def createExcelOutput(request):
    ''' this is the main view entry '''
    locale.setlocale(locale.LC_TIME, French_Locale)

    year = 0
    monthNumber = 0
    weekNumber = 0
    if request.method == 'GET':
        #print "GET received"
        try:
            year = request.GET['year']
        except:
            year = datetime.today().isocalendar()[0]
        #print "year = {year}".format(year = year )
        
        try:
            monthNumber = request.GET['month']
        except:
            ''' it is a weekly request '''
            monthNumber = 0
        
        if (int(monthNumber) == 0):
            try:
                # we should have a week
                weekNumber = request.GET['week']
            except:
                weekNumber = datetime.today().isocalendar()[1]
            
            #print "week number = {weekNumber}".format( weekNumber = weekNumber )
        
        ''' Robert - python2 to python 3 '''
        memoryFile = io.BytesIO() # create a file-like object 

        # warning : we get strings from the URL query
        wb = createExcelWorkbook(memoryFile, year=int(year), monthNumber=int(monthNumber), weekNumber=int(weekNumber))
        wb.close()
        
        if (int(monthNumber)>0):
            filename = 'Reservations-{0}-mois-{1}-date-{2}.xlsx'.format(year, date(int(year), int(monthNumber), 1).strftime('%B') , datetime.now().strftime("%d-%B-%Y-%Hh%Mm%S"))
        else:
            filename = 'Reservations-{0}-Semaine-{1}-date-{2}.xlsx'.format(year, weekNumber, datetime.now().strftime("%d-%B-%Y-%Hh%Mm%S"))
        #print filename
        
        response = HttpResponse( memoryFile.getvalue() )
        response['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8'
        #response['Content-Type'] = 'application/vnd.ms-excel'
        response["Content-Transfer-Encoding"] = "binary"
        response['Set-Cookie'] = 'fileDownload=true; path=/'
        response['Content-Disposition'] = 'attachment; filename={filename}'.format(filename=filename)
        response['Content-Length'] = memoryFile.tell()
        return response


#============================================
if __name__ == '__main__':
    pass
    listOfWeeks = computeListOfWeeks(year=2020, month=1)
    print (listOfWeeks)