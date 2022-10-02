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
    re_path( r'^password_change/', auth_views.PasswordChangeView.as_view(), 
         {'template_name': 'registration/password_change_form.html'} ,name="password_change" ),
    
    re_path( r'^password_change_done/$', auth_views.PasswordChangeDoneView.as_view(), 
         {'template_name': 'registration/password_change_done.html'} ,name="password_change_done" ),
]

#     url(r'^user/password/reset/$', auth_views.password_reset ,
#          { 'post_reset_redirect' : '/user/password/reset/done/'}, name="reset_password"),
#     
#     url(r'^user/password/reset/done/$', auth_views.password_reset_done, name="password_reset_done"  ) ,
#         
#     url (r'^user/password/reset/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 
#        auth_views.password_reset_confirm , name="password_reset_confirm" ),
#     
#     url(r'^user/password/done/$', auth_views.password_reset_complete),
    
