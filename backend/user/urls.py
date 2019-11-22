from django.urls import path

from . import views

app_name = 'user'

# /api/user/
urlpatterns = [
    path('create/', views.CreateUserView.as_view(), name='create'),
    path('login/', views.CreateTokenView.as_view(), name='login'),
    path('logout/', views.DestroyTokenView.as_view(), name='logout'),
    path('me/', views.ManageUserView.as_view(), name='me'),
]
