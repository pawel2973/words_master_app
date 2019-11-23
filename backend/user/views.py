from rest_framework import generics, authentication, permissions, status
from rest_framework.authtoken.views import ObtainAuthToken, APIView
from rest_framework.settings import api_settings
from rest_framework.response import Response

from user.serializers import UserSerializer, AuthTokenSerializer, TokenSerializer
from rest_framework.authtoken.models import Token


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    serializer_class = UserSerializer


class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for the user"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                            context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'id': user.id, 'email': user.email, 'account_type': user.account_type})


class DestroyTokenView(generics.CreateAPIView):
    serializer_class = TokenSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    # permission_classes = (permissions.AllowAny,)

    def post(self, request):
        Token.objects.filter(user=self.request.user).delete()
        return Response(status=status.HTTP_200_OK)


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = UserSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        print(self.request.data)
        return self.partial_update(request, *args, **kwargs)
