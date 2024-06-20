from typing import Any, Dict
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from backendapi.serializers import  UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # By default refresh and access token is send, to add more details we will use validate function
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for key, value in serializer.items():
            data[key] = value
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Test API to start API work
# @api_view(['GET'])
# def getRoutes(request):
#     return JsonResponse("Helllo", safe= False)

@api_view(['POST'])    
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name = data["name"],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many = False)
        return Response(serializer.data)
    except:
        message = { 'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user 
    serialzer = UserSerializer(user, many = False)
    return Response(serialzer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user 
    serialzer = UserSerializerWithToken(user, many = False)
    
    data = request.data
    user.first_name = data['name']
    user.email = data['email']
    user.username = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
    return Response(serialzer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serialzer = UserSerializer(users, many = True)
    return Response(serialzer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, id):
    user = User.objects.get(id = id)
    serialzer = UserSerializer(user, many = False)
    return Response(serialzer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, id):
    user = User.objects.get(id = id) 
    
    data = request.data
    user.first_name = data['name']
    user.email = data['email']
    user.username = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serialzer = UserSerializer(user, many = False)
    return Response(serialzer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, id):
    userDelete = User.objects.get(id = id)
    userDelete.delete()
    return Response("User was deleted")


