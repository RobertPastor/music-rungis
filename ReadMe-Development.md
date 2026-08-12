
## set the current directory having the git repository cloned from github
## (master) within parenthesis provides de name of the current git branch

$ pwd
/c/Users/rober/git/music-rungis
rober@RobertPastor MINGW64 ~/git/music-rungis (master)
$

## check the content

$ ls -al
total 62
drwxr-xr-x 1 rober 197609     0 Aug 12 16:49 ./
drwxr-xr-x 1 rober 197609     0 Aug  6 12:32 ../
drwxr-xr-x 1 rober 197609     0 Aug 12 15:51 .git/
-rw-r--r-- 1 rober 197609    76 Mar  3  2024 .gitignore
-rw-r--r-- 1 rober 197609   440 Mar  3  2024 .project
-rw-r--r-- 1 rober 197609   954 Mar  3  2024 .pydevproject
drwxr-xr-x 1 rober 197609     0 Mar  3  2024 .settings/
-rw-r--r-- 1 rober 197609    48 Mar  3  2024 Procfile
-rw-r--r-- 1 rober 197609    46 Mar  3  2024 Procfile.windows
-rw-r--r-- 1 rober 197609     0 Aug 12 16:49 ReadMe-Development.md
-rw-r--r-- 1 rober 197609  1262 Mar  3  2024 ReadMe-Heroku.md
-rw-r--r-- 1 rober 197609   170 Apr 17 17:47 ReadMe-PostGres.md
-rw-r--r-- 1 rober 197609 13917 May 23  2024 ReadMe-PythonAnyWhere.md
-rw-r--r-- 1 rober 197609   303 Mar  3  2024 app.json
drwxr-xr-x 1 rober 197609     0 Mar  3  2024 gettingstarted/
drwxr-xr-x 1 rober 197609     0 Mar  3  2024 hello/
-rwxr-xr-x 1 rober 197609   267 Mar  3  2024 manage.py*
drwxr-xr-x 1 rober 197609     0 Mar  3  2024 partitions/
-rw-r--r-- 1 rober 197609   122 Mar  3  2024 requirements.txt
drwxr-xr-x 1 rober 197609     0 Mar  3  2024 reservation/
-rw-r--r-- 1 rober 197609    14 Mar  3  2024 runtime.txt
-rw-r--r-- 1 rober 197609   449 Mar  3  2024 wsgi.py

rober@RobertPastor MINGW64 ~/git/music-rungis (master)
$

## create the virtual environment in python windows -> only if not yet available
$ python -m venv virtualEnv

rober@RobertPastor MINGW64 ~/git/music-rungis (master)
$

## check the virtual env
$ ls -al virtualEnv/
total 9
drwxr-xr-x 1 rober 197609   0 Aug 12 16:54 ./
drwxr-xr-x 1 rober 197609   0 Aug 12 16:54 ../
drwxr-xr-x 1 rober 197609   0 Aug 12 16:54 Include/
drwxr-xr-x 1 rober 197609   0 Aug 12 16:54 Lib/
drwxr-xr-x 1 rober 197609   0 Aug 12 16:55 Scripts/
-rw-r--r-- 1 rober 197609 327 Aug 12 16:54 pyvenv.cfg

rober@RobertPastor MINGW64 ~/git/music-rungis (master)
$

## activate the virtual environment in windows use GitBash shell
## check the activation with the (virtualEnv) tag within parenthesis

$ . ./virtualEnv/Scripts/activate
(virtualEnv)
rober@RobertPastor MINGW64 ~/git/music-rungis (master)
$

## check python version
$ python --version
Python 3.11.3
(virtualEnv)
rober@RobertPastor MINGW64 ~/git/music-rungis (master)
$

## install django 3.2
pip install django==3.2

## install psycopg2 (only useful in development / local environment)
## deployment in pythonanywhere uses a MySQL database -> mysqlclient==2.1.1

pip install psycopg2

$ pip install psycopg2
Collecting psycopg2
  Downloading psycopg2-2.9.12-cp311-cp311-win_amd64.whl (2.8 MB)
     ---------------------------------------- 2.8/2.8 MB 11.7 MB/s eta 0:00:00
Installing collected packages: psycopg2
Successfully installed psycopg2-2.9.12

[notice] A new release of pip available: 22.3.1 -> 26.2.1
[notice] To update, run: python.exe -m pip install --upgrade pip
(virtualEnv)
rober@RobertPastor MINGW64 ~/git/music-rungis (master)

## install other needed libraries

$ pip install xlsxwriter==3.0.3
Collecting xlsxwriter==3.0.3
  Downloading XlsxWriter-3.0.3-py3-none-any.whl.metadata (2.6 kB)
Downloading XlsxWriter-3.0.3-py3-none-any.whl (149 kB)
Installing collected packages: xlsxwriter
Successfully installed xlsxwriter-3.0.3
(virtualEnv)
rober@RobertPastor MINGW64 ~/git/music-rungis (master)

$ pip install whitenoise==6.2.0
Collecting whitenoise==6.2.0
  Downloading whitenoise-6.2.0-py3-none-any.whl.metadata (3.3 kB)
Downloading whitenoise-6.2.0-py3-none-any.whl (19 kB)
Installing collected packages: whitenoise
Successfully installed whitenoise-6.2.0
(virtualEnv)
rober@RobertPastor MINGW64 ~/git/music-rungis (master)

## try to run the django development server
## using localhost and default 8000 port

python manage.py runserver

$ python manage.py runserver
Watching for file changes with StatReloader

## open a browser and type 
localhost:8000

-> the minimal website should show up

[12/Aug/2026 17:38:30] "GET / HTTP/1.1" 200 5207
[12/Aug/2026 17:38:30] "GET /static/images/commission-musique.jpg HTTP/1.1" 200 70420
[12/Aug/2026 17:38:30] "GET /static/reservation/css/styles.css HTTP/1.1" 200 5804
[12/Aug/2026 17:38:30] "GET /static/css/styles.css HTTP/1.1" 200 2072
[12/Aug/2026 17:38:30] "GET /static/js/hello.js HTTP/1.1" 200 1121
[12/Aug/2026 17:38:30] "GET /static/reservation/js/jquery/jquery-2.2.1.js HTTP/1.1" 200 268380
Not Found: /favicon.ico
[12/Aug/2026 17:38:31] "GET /favicon.ico HTTP/1.1" 404 3678

## use PgAdmin to check the development database
## example: the chosen password is bobby1xx for the local PostGres database

## the default database (for the local tests) is defined in the settings.py file
## the code -> if (DEBUG == False): -> provides the database settings for the deployment environment

## sur le site en local -> utilisez un compte admin avec le mot de passe admin 
cliquer en haut à gauche dans la section "Authentification et autorisation" sur le lien "Utilisateurs"

Accueil › Authentification et autorisation › Utilisateurs

## les utilisateurs ayant le statut "STATUT EQUIPE" avec une case cochée peuvent ajouter un utilisateur

## Pour ajouter un utilisateur , cliquer en haut et à droite de la liste sur "AJOUTER UTILISATEUR"

