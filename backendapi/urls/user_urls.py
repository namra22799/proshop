from django.urls import path
from backendapi.views import user_views as views

urlpatterns = [
    # path('', views.getRoutes, name= "routes"),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name = 'register'),
    path('profile/', views.getUserProfile, name= "users-profile"),
    path('profile/update/', views.updateUserProfile, name= "users-profile-updpate"),
    path('', views.getUsers, name= "users"),
    path('<str:id>/', views.getUserById, name= "user"),
    path('update/<str:id>/', views.updateUser, name= "user-update"),
    path('delete/<str:id>/', views.deleteUser, name= "user-delete"),

]