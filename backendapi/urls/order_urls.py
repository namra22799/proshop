from django.urls import path
from backendapi.views import order_views as views

urlpatterns = [
    path('', views.getOrders, name = 'orders'),
    path('add/', views.addOrderItems, name = 'orders-add'),
    path('myorders/', views.getMyOrders, name = 'my-orders'),
    path('<str:id>/', views.getOrderById, name = 'user-order'),
    path('<str:id>/pay/', views.updateOrderToPaid, name = 'pay'),
    path('<str:id>/deliver/', views.updateOrderToDelivered, name = 'order-deliver'),


]