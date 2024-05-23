# MusicRungis.eu.pythonanywhere.com

# log on python anywhere

https://eu.pythonanywhere.com/user/musicrungis/
account = MusicRungis
password = same as usual

## set virtual environment

16:52 ~ $ source .virtualenvs/music-rungis/bin/activate
(music-rungis) 16:52 ~ $ 

## install django 3.2

(music-rungis) 17:01 ~ $ pip install django==3.2
Looking in links: /usr/share/pip-wheels
Collecting django==3.2
  Downloading Django-3.2-py3-none-any.whl (7.9 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 7.9/7.9 MB 30.3 MB/s eta 0:00:00
Collecting asgiref<4,>=3.3.2
  Downloading asgiref-3.7.2-py3-none-any.whl (24 kB)
Requirement already satisfied: sqlparse>=0.2.2 in ./.virtualenvs/music-rungis/lib/python3.7/site-packages (from django==3.2) (0.4.3)
Requirement already satisfied: pytz in ./.virtualenvs/music-rungis/lib/python3.7/site-packages (from django==3.2) (2022.4)
Collecting typing-extensions>=4
  Downloading typing_extensions-4.7.1-py3-none-any.whl (33 kB)
Installing collected packages: typing-extensions, asgiref, django
  Attempting uninstall: django
    Found existing installation: Django 2.2
    Uninstalling Django-2.2:
      Successfully uninstalled Django-2.2
Successfully installed asgiref-3.7.2 django-3.2 typing-extensions-4.7.1
(music-rungis) 17:02 ~ $ 

## Clone 

14:06 ~ $ git clone https://github.com/RobertPastor/music-rungis.git
Cloning into 'music-rungis'...
remote: Enumerating objects: 216, done.
remote: Counting objects: 100% (216/216), done.
remote: Compressing objects: 100% (169/169), done.
remote: Total 216 (delta 42), reused 207 (delta 33), pack-reused 0
Receiving objects: 100% (216/216), 569.21 KiB | 1.21 MiB/s, done.
Resolving deltas: 100% (42/42), done.
Updating files: 100% (159/159), done.
14:11 ~ $ 

## Check your python version in the local environment

PS C:\Users\rober> python --version
Python 3.7.7
PS C:\Users\rober> django --version

## Create a virtual environment with the appropriate Python version

14:11 ~ $ mkvirtualenv music-rungis --python=/usr/bin/python3.7

14:11 ~ $ mkvirtualenv music-rungis --python=/usr/bin/python3.7
created virtual environment CPython3.7.13.final.0-64 in 10292ms
  creator CPython3Posix(dest=/home/MusicRungis/.virtualenvs/music-rungis, clear=False, no_vcs_ignore=False, global=False)
  seeder FromAppData(download=False, pip=bundle, setuptools=bundle, wheel=bundle, via=copy, app_data_dir=/home/MusicRungis/.local/share/virtualenv)
    added seed packages: pip==22.1.2, setuptools==62.6.0, wheel==0.37.1
  activators BashActivator,CShellActivator,FishActivator,NushellActivator,PowerShellActivator,PythonActivator
virtualenvwrapper.user_scripts creating /home/MusicRungis/.virtualenvs/music-rungis/bin/predeactivate
virtualenvwrapper.user_scripts creating /home/MusicRungis/.virtualenvs/music-rungis/bin/postdeactivate
virtualenvwrapper.user_scripts creating /home/MusicRungis/.virtualenvs/music-rungis/bin/preactivate
virtualenvwrapper.user_scripts creating /home/MusicRungis/.virtualenvs/music-rungis/bin/postactivate
virtualenvwrapper.user_scripts creating /home/MusicRungis/.virtualenvs/music-rungis/bin/get_env_details
(music-rungis) 14:12 ~ $ which python
/home/MusicRungis/.virtualenvs/music-rungis/bin/python
(music-rungis) 14:13 ~ $ python --version
Python 3.7.13
(music-rungis) 14:13 ~ $ 

## Check Django version in your local environment

PS C:\Users\rober\Documents\02 - Commission Musique\music-rungis> python -m django --version
2.2.11
PS C:\Users\rober\Documents\02 - Commission Musique\music-rungis>

## Install Django 2.2 in the virtual environment

(music-rungis) 14:13 ~ $ pip install django==2.2
Looking in links: /usr/share/pip-wheels
Collecting django==2.2
  Downloading Django-2.2-py3-none-any.whl (7.4 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 7.4/7.4 MB 33.7 MB/s eta 0:00:00
Collecting sqlparse
  Downloading sqlparse-0.4.3-py3-none-any.whl (42 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 42.8/42.8 kB 1.2 MB/s eta 0:00:00
Collecting pytz
  Downloading pytz-2022.4-py2.py3-none-any.whl (500 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 500.8/500.8 kB 11.9 MB/s eta 0:00:00
Installing collected packages: pytz, sqlparse, django
Successfully installed django-2.2 pytz-2022.4 sqlparse-0.4.3
(music-rungis) 14:32 ~ $ 

## Install xlsxwriter in the virtual environment

(music-rungis) 14:32 ~ $ pip install xlsxwriter
Looking in links: /usr/share/pip-wheels
Collecting xlsxwriter
  Downloading XlsxWriter-3.0.3-py3-none-any.whl (149 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 150.0/150.0 kB 5.1 MB/s eta 0:00:00
Installing collected packages: xlsxwriter
Successfully installed xlsxwriter-3.0.3
(music-rungis) 14:34 ~ $ 

## Install whitenoise in the virtual environment

(music-rungis) 14:35 ~ $ pip install whitenoise
Looking in links: /usr/share/pip-wheels
Collecting whitenoise
  Downloading whitenoise-6.2.0-py3-none-any.whl (19 kB)
Installing collected packages: whitenoise
Successfully installed whitenoise-6.2.0
(music-rungis) 14:35 ~ $ 

## Install mysqlclient

(music-rungis) 16:01 ~/music-rungis (master)$ pip install mysqlclient
Looking in links: /usr/share/pip-wheels
Collecting mysqlclient
  Downloading mysqlclient-2.1.1.tar.gz (88 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 88.1/88.1 kB 3.1 MB/s eta 0:00:00
  Preparing metadata (setup.py) ... done
Building wheels for collected packages: mysqlclient
  Building wheel for mysqlclient (setup.py) ... done
  Created wheel for mysqlclient: filename=mysqlclient-2.1.1-cp37-cp37m-linux_x86_64.whl size=109884 sha256=e328b5c2014c36f2206d8a336cd6b7ebfa21c45697a3ce0d54068775306b601b
  Stored in directory: /home/MusicRungis/.cache/pip/wheels/95/2d/67/2cb3f82e435fc8e055cb2761a15a0812bf086068f6fb835462
Successfully built mysqlclient
Installing collected packages: mysqlclient
Successfully installed mysqlclient-2.1.1
(music-rungis) 16:02 ~/music-rungis (master)$ 

## List packages installed in the virtual environment

(music-rungis) 14:35 ~ $ python -m pip freeze
Django==2.2
pytz==2022.4
sqlparse==0.4.3
whitenoise==6.2.0
XlsxWriter==3.0.3
(music-rungis) 14:37 ~ $ 

## locate the virtual environment (to be used later)

(music-rungis) 14:39 ~ $ ls -al .virtualenvs/music-rungis/
total 24
drwxrwxr-x 4 MusicRungis registered_users 4096 Oct 14 14:12 .
drwxrwxr-x 3 MusicRungis registered_users 4096 Oct 14 14:12 ..
-rw-rw-r-- 1 MusicRungis registered_users   40 Oct 14 14:12 .gitignore
drwxrwxr-x 3 MusicRungis registered_users 4096 Oct 14 14:34 bin
drwxrwxr-x 3 MusicRungis registered_users 4096 Oct 14 14:12 lib
-rw-rw-r-- 1 MusicRungis registered_users  223 Oct 14 14:12 pyvenv.cfg
(music-rungis) 14:39 ~ $ 

## enter the path to your virtual environment in the web tab
path is 
/home/MusicRungis/.virtualenvs/music-rungis/

## create the MySQL database
follow pythonanywhere instructions

## check git remote
(music-rungis) 16:06 ~/music-rungis (master)$ git remote -v
origin  https://github.com/RobertPastor/music-rungis.git (fetch)
origin  https://github.com/RobertPastor/music-rungis.git (push)
(music-rungis) 16:06 ~/music-rungis (master)$ 

## update MySQL database settings - run git pull

(music-rungis) 16:06 ~/music-rungis (master)$ git pull
remote: Enumerating objects: 8, done.
remote: Counting objects: 100% (8/8), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 5 (delta 3), reused 5 (delta 3), pack-reused 0
Unpacking objects: 100% (5/5), 2.19 KiB | 25.00 KiB/s, done.
From https://github.com/RobertPastor/music-rungis
   151416f..a8d02bd  master     -> origin/master
Updating 151416f..a8d02bd
Fast-forward
 README.md => ReadMe-Heroku.md |   0
 ReadMe-PythonAnyWhere.md      | 139 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 gettingstarted/settings.py    |  10 ++++++----
 3 files changed, 145 insertions(+), 4 deletions(-)
 rename README.md => ReadMe-Heroku.md (100%)
 create mode 100644 ReadMe-PythonAnyWhere.md
(music-rungis) 16:07 ~/music-rungis (master)$ 

# make migrations

(music-rungis) 16:07 ~/music-rungis (master)$ python manage.py makemigrations                                                                                                                               
No changes detected
(music-rungis) 16:07 ~/music-rungis (master)$ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, hello, partitions, reservation, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying hello.0001_initial... OK
  Applying hello.0002_sitemessage... OK
  Applying hello.0003_sitemessage_event_date... OK
  Applying hello.0004_auto_20160413_2148... OK
  Applying hello.0005_auto_20200216_1300... OK
  Applying partitions.0001_initial... OK
  Applying partitions.0002_auto_20170115_1438... OK
  Applying reservation.0001_initial... OK
  Applying reservation.0002_auto_20160413_2300... OK
  Applying reservation.0003_studio_color... OK
  Applying reservation.0004_weekday_weeklyreservation... OK
  Applying reservation.0005_auto_20171216_1439... OK
  Applying reservation.0006_auto_20171216_1558... OK
  Applying sessions.0001_initial... OK
(music-rungis) 16:09 ~/music-rungis (master)$ 

## create super user

(music-rungis) 16:09 ~/music-rungis (master)$ python manage.py createsuperuser
Username (leave blank to use 'musicrungis'): MusicRungis
Email address: robert.pastor0691@gmail.com
Password: .....................................Bobby1&&&xxx .................................
Password (again): 
Superuser created successfully.
(music-rungis) 16:11 ~/music-rungis (master)$ 

## go to the pythonanywhere web tab and reload the site .... It should be working now

## create the Studios and the Week days

(music-rungis) 16:15 ~/music-rungis (master)$ python manage.py StudiosInitialize
Piano
Galabru
Studio 1
Studio 2
(music-rungis) 16:16 ~/music-rungis (master)$ python manage.py WeekDaysInitialize
lundi
mardi
mercredi
jeudi
vendredi
(music-rungis) 16:16 ~/music-rungis (master)$ 

## create the Weekly reservations

## set current directory to the project folder

go to the projet folder (the one containing the .git repo) -> the prompt shows the git branch master

09:38 ~ $ cd music-rungis/
09:38 ~/music-rungis (master)$

## set the existing virtual environment

locate the virtual environment -> it contains the activate file

09:38 ~/music-rungis (master)$ ls -al ../.virtualenvs/music-rungis/bin/
total 108
drwxrwxr-x 3 MusicRungis registered_users 4096 Oct 14 14:34 .
drwxrwxr-x 4 MusicRungis registered_users 4096 Oct 14 14:12 ..
drwxrwxr-x 2 MusicRungis registered_users 4096 Oct 14 14:34 __pycache__
-rw-rw-r-- 1 MusicRungis registered_users 2162 Oct 14 14:12 activate

... source it -> now the prompt shows (1st the name of the virtual environment, the current directory and the name of the master branch
09:49 ~/music-rungis (master)$ source ../.virtualenvs/music-rungis/bin/activate
(music-rungis) 09:49 ~/music-rungis (master)$ 

## perform a git pull

(music-rungis) 09:55 ~/music-rungis (master)$ git pull
remote: Enumerating objects: 31, done.
remote: Counting objects: 100% (31/31), done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 17 (delta 12), reused 17 (delta 12), pack-reused 0
Unpacking objects: 100% (17/17), 1.92 KiB | 7.00 KiB/s, done.
From https://github.com/RobertPastor/music-rungis
   a0ed6f8..658a67d  master     -> origin/master
Updating a0ed6f8..658a67d
Fast-forward
 ReadMe-PythonAnyWhere.md                      |  1 -
 gettingstarted/settings.py                    | 17 ++---------------
 reservation/static/reservation/css/site.css   |  9 ++++++++-
 reservation/static/reservation/css/styles.css |  4 +++-
 reservation/static/reservation/js/site.js     | 61 +++++++++++++++++++++++++++++++++++++++++--------------------
 reservation/versions/versionsFile.py          |  4 ++++
 6 files changed, 58 insertions(+), 38 deletions(-)
(music-rungis) 09:55 ~/music-rungis (master)$ 

## return to the python anywhere web tab and reload the application


