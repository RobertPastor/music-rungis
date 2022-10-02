from django.test import TestCase

# Create your tests here.

from reservation.views import getMondayOfWeekYear

if __name__ == '__main__':
    mondayOne = getMondayOfWeekYear(year=2018, week=12)
    print (mondayOne)
    mondayTwo = getMondayOfWeekYear(year=2018, week=13)
    print (mondayTwo)