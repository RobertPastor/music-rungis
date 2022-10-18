'''
Created on 29 mai 2016

@author: PASTOR Robert
Manage the display mode, either weekly or monthly

'''

class DisplayMode(object):
    
    monthlyMode = "monthly"
    weeklyMode = "weekly"
    
    defaultMode = weeklyMode
    displayMode = defaultMode
    
    week_number = 0
    month_number = 0
    year = 0

    def __init__(self):
        self.displayMode = self.defaultMode
        self.week_number = 0
        self.month_number = 0
        self.year = 0
        
    def __str__(self):
        return self.displayMode
        
    def initialise(self, request):
        
        if (request is not None):
            #print 'display Mode - request = {0}'.format(request)
            
            if request.method == 'GET':
                
                #print 'display Mode - request method = {0} - request = {1}'.format(request.method, request.GET)
                try:
                    self.year = int(request.GET['year'])
                except:
                    self.year = 0
                    
                try:
                    self.week_number = int(request.GET['week'])
                    self.displayMode = self.weeklyMode
                    #print 'display Mode = {0} - year = {1} - week number = {2}'.format(self.displayMode, self.year, self.week_number)
                except:
                    self.week_number = 0
                    self.month_number = int(request.GET['month'])
                    self.displayMode = self.monthlyMode
                    #print 'display Mode = {0} - year = {1} - month number = {2}'.format(self.displayMode, self.year, self.month_number)
            
            else:
                
                #print 'display Mode - request method = {0} - request = {1}'.format(request.method, request.POST)
                try:
                    self.year =  int(request.POST['year'])
                except:
                    self.year = 0
                    
                ''' request is a POST '''
                try:
                    self.week_number = int(request.POST['week'])
                    self.displayMode = self.weeklyMode
                    #print 'display Mode = {0} - year = {1} - week number = {2}'.format(self.displayMode, self.year, self.week_number)
                except:
                    self.week_number = 0
                    self.month_number = int(request.POST['month'])
                    self.displayMode = self.monthlyMode
                    #print 'display Mode = {0} - year = {1} - month number = {2}'.format(self.displayMode, self.year, self.month_number)
    
        else:
            #print 'display Mode - request is NONE'
            
            self.displayMode = self.defaultValue
            self.year = 0
            self.week_number = 0
            self.month_number = 0
        
        
    def isWeeklyDisplayMode(self):
        return self.displayMode == self.weeklyMode
            
    def isMonthlyDisplayMode(self):
        return self.displayMode == self.monthlyMode
            
    def getDisplayMode(self):
        return self.displayMode
    
    def getYear(self):
        return self.year
    
    def getWeekNumber(self):
        return self.week_number
    
    def getMonthNumber(self):
        return self.month_number
    
