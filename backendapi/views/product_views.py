from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from backendapi.models import Product, Review
from backendapi.serializers import ProductSerializer
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''

    products = Product.objects.filter(name__icontains = query)

    page = request.query_params.get('page')
    paginator = Paginator(products,4)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page ==  None:
        page = 1

    page = int(page) 

    serialzer = ProductSerializer(products, many = True)
    return Response({'products' : serialzer.data, 'page':page, 'pages' : paginator.num_pages})

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gt=4).order_by('-rating')[0:5]
    serialzer = ProductSerializer(products, many = True)
    return Response(serialzer.data)


@api_view(['GET'])
def getProductById(request, id):
    product = Product.objects.get(_id = id)
    serializer = ProductSerializer(product, many = False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user = user, 
        name = 'Sample Name',
        price = 0,
        brand = 'Sample Brand',
        countInStock = 0,
        category = 'Sample Category',
        description = ''
    )
    serialzer = ProductSerializer(product, many = False)
    return Response(serialzer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, id):
    data = request.data
    product = Product.objects.get(_id = id)
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    product.save() 
    serialzer = ProductSerializer(product, many = False)
    return Response(serialzer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, id):
    product = Product.objects.get(_id = id)
    product.delete()
    return Response('Product : '+ product.name +' deleted')

@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product  = Product.objects.get(_id = product_id)
    product.image = request.FILES.get('image')
    product.save()
    return Response('/images/'+str(product.image))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, id):
    user = request.user
    product  = Product.objects.get(_id = id)
    data = request.data

    # Review Already Exists
    alreadyExists = product.review_set.filter(user = user).exists()
    if alreadyExists:
        content = { 'detail' : 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    # No Rating or 0
    elif data['rating'] == 0:
        content = { 'detail' : 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    # Create a review
    else:
        review = Review.objects.create(
            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment']
        )
        reviews = product.review_set.all()
        product.numReviews= len(reviews)
        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total / len(reviews)
        product.save()
        return Response('Review Added')