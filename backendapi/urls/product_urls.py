from django.urls import path
from backendapi.views import product_views as views

urlpatterns = [
    # path('', views.getRoutes, name= "routes"),
    path('', views.getProducts, name= "products"),

    path('create/', views.createProduct, name= "product-create"),
    path('upload/', views.uploadImage, name= "image-upload"),

    path('<str:id>/reviews/', views.createProductReview, name= "product-review"),
    path('top/', views.getTopProducts, name = "top-product"),
    path('<str:id>/', views.getProductById, name= "product"),

    path('update/<str:id>/', views.updateProduct, name= "product-update"),
    path('delete/<str:id>/', views.deleteProduct, name= "product-delete"),
]