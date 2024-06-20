from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from backendapi.models import Product, Order, OrderItem, ShippingAddress
from backendapi.serializers import ProductSerializer, OrderSerializer
from rest_framework import status
from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response(
            {'detail': 'No order items'}, 
            status = status.HTTP_400_BAD_REQUEST
        )
    else:
        # Create Order
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice']
        )
        # Create Shipping Address
        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country']
        )

        # Create order items and set order to orderitem relationship
        for i in orderItems:
            product = Product.objects.get(_id = i['product'])
            item = OrderItem.objects.create(
                order = order,
                product = product,
                name = product.name,
                qty = i['qty'],
                price = i['price'],
                image = product.image.url
            )
            # update Stocks
            product.countInStock -= item.qty
            product.save()
        serializer = OrderSerializer(order, many = False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, id):
    user = request.user
    try:
        order = Order.objects.get(_id = id)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many = False)
            return Response(serializer.data)
        else:
            Response({
                'detail': 'Not authorized to view this order'},
                status= status.HTTP_400_BAD_REQUEST
            )
    except:
        return Response({'detail' : 'Order doesn not exist'}, status= status.HTTP_400_BAD_REQUESTS)
    

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, id):
    order = Order.objects.get(_id = id)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order is paid.')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, id):
    order = Order.objects.get(_id = id)
    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order is delivered.')