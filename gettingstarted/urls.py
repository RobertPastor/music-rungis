#admin.autodiscover()

#from django.urls import include, re_path, path
from django.contrib import admin
admin.autodiscover()
from django.urls import include, re_path

from django.contrib.auth import views as auth_views
from hello.views import index, tests

app_name = "gettingstarted"

''' migration to Django 2.2 use re_path '''
urlpatterns = [
    re_path(r'^$', index, name='index'),

    re_path(r'^admin/', admin.site.urls ),
    
    re_path(r'^reservation/', include('reservation.urls') ),
    re_path(r'^partitions/', include('partitions.urls') ),

    re_path(r'^accounts/login/$', auth_views.LoginView.as_view(), name ='login'),
    re_path(r'^accounts/logout/$', auth_views.LogoutView.as_view() , name = 'logout' ),
    #re_path(r'^accounts/profile/$', index , name = 'index'),
    re_path(r'^tests/', tests, name='tests')
]

''' migration to Django 2.2 use re_path '''
urlpatterns += [
    re_path(r'^password_change/', auth_views.PasswordChangeView.as_view(), 
         {'template_name': 'registration/password_change_form.html'} ,name="password_change" ),
    
    re_path(r'^password_change_done/$', auth_views.PasswordChangeDoneView.as_view(), 
         {'template_name': 'registration/password_change_done.html'} ,name="password_change_done" ),
    ]

''' March 2024 - password reset '''
urlpatterns += [

    re_path(r'^password_reset/$', auth_views.PasswordResetView.as_view() ,
        { 'template_name': 'registration/password_reset_form', 'post_reset_redirect' : '/password_reset_done/'}, 
        name="password_reset"),
     
    re_path(r'^password_reset_done/$', auth_views.PasswordResetDoneView.as_view(), 
        { 'template_name' : 'registration/password_reset_done'} ,
        name="password_reset_done"  ) ,
         
    re_path(r'^password_reset_confirm/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 
        auth_views.PasswordResetConfirmView.as_view() , 
        { 'template_name' : 'registration/password_reset_confirm'} ,
        name="password_reset_confirm" ),
     
    re_path(r'^password_reset_complete/$',
        auth_views.PasswordResetCompleteView.as_view() , 
        { 'template_name' : 'registration/password_reset_complete'} ,
        name="password_reset_complete" )
    
    ]
