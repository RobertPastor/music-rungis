# MusicRungis.eu.pythonanywhere.com



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

## List locally installed packages

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



 


