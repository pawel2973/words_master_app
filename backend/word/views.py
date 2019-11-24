from rest_framework import viewsets, mixins, generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from word.permissions import IsOwner
from rest_framework.response import Response
from rest_framework import status

from core.models import User, UserWordList, UserWord, UserTest, UserTestAnswer, \
    ClassWordList, ClassWord, Classroom, ClassTest, StudentTest, StudentTestAnswer

from word import serializers


# class SampleViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
# /word/userwordlist/
# /word/userwordlist/{pk}/
class UserWordListView(viewsets.ModelViewSet):
    """Manage user word list in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwner)
    serializer_class = serializers.UserWordListSerializer
    queryset = UserWordList.objects.all()

    def perform_create(self, serializer):
        """Create a new word list"""
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """Show all words for specific word list"""
        queryset = UserWordList.objects.filter(user_id=self.request.user)
        # queryset = UserWord.objects.filter(userwordlist=self.kwargs['nested_1_pk'])

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# /word/userwordlist/{pk}/words/
# /word/userwordlist/{pk}/words/{pk}/
class UserWordView(viewsets.ModelViewSet):
    """Manage user word in user word list"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwner)
    serializer_class = serializers.UserWordSerializer
    queryset = UserWord.objects.all()

    def create(self, serializer, *args, **kwargs):
        """Create a new word in user word list"""
        wordlist = UserWordList.objects.get(pk=self.kwargs['nested_1_pk'])

        # Check who is the owner of the list
        if self.request.user != User.objects.get(id=wordlist.user.id):
            return Response({'error': 'Brak dostępu!'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            # Standard create method
            serializer = self.get_serializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """Save user word object to database"""
        wordlist = UserWordList.objects.get(pk=self.kwargs['nested_1_pk'])
        serializer.save(user=self.request.user, userwordlist=wordlist)

    def get_serializer(self, *args, **kwargs):
        """Provide post multiple objects to database"""
        if "data" in kwargs:
            data = kwargs["data"]

            # check if many is required
            if isinstance(data, list):
                kwargs["many"] = True

        return super(UserWordView, self).get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        """Show all words for specific word list"""
        wordlist = UserWordList.objects.get(pk=self.kwargs['nested_1_pk'])
        # Check who is the owner of the list
        if self.request.user != User.objects.get(id=wordlist.user.id):
            return Response({'error': 'Brak dostępu!'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            queryset = UserWord.objects.filter(userwordlist=self.kwargs['nested_1_pk'], user=self.request.user)
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)


# /word/userwordlist/{pk}/tests/
# /word/userwordlist/{pk}/tests/{pk}/
class UserTestView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwner)
    serializer_class = serializers.UserTestSerializer
    queryset = UserTest.objects.all()

    def create(self, serializer, *args, **kwargs):
        """Create a new user test in user word list"""
        wordlist = UserWordList.objects.get(pk=self.kwargs['nested_1_pk'])

        # Check who is the owner of the test
        if self.request.user != User.objects.get(id=wordlist.user.id):
            return Response({'error': 'Brak dostępu!'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            # Standard create method
            serializer = self.get_serializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, *args, **kwargs):
        """Save user test to database"""
        wordlist = UserWordList.objects.get(pk=self.kwargs['nested_1_pk'])
        serializer.save(user=self.request.user, userwordlist=wordlist)

    def list(self, request, *args, **kwargs):
        """Show all tests for specific word list"""
        wordlist = UserWordList.objects.get(pk=self.kwargs['nested_1_pk'])
        # Check who is the owner of the test
        if self.request.user != User.objects.get(id=wordlist.user.id):
            return Response({'error': 'Brak dostępu!'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            queryset = UserTest.objects.filter(userwordlist=self.kwargs['nested_1_pk'])
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)


# /word/userwordlist/{pk}/tests/{pk}/answers/
# DENIED: /word/userwordlist/{pk}/tests/{pk}/answers/{pk}
class UserTestAnswerView(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Manage user test answer in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwner)
    serializer_class = serializers.UserTestAnswerSerializers
    queryset = UserTestAnswer.objects.all()

    def create(self, serializer, *args, **kwargs):
        """Create a new answer in user test"""
        test = UserTest.objects.get(pk=self.kwargs['nested_2_pk'])
        # Check who is the owner of the test
        if self.request.user != User.objects.get(id=test.user.id):
            return Response({'error': 'Brak dostępu!'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            # Standard create method
            serializer = self.get_serializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, *args, **kwargs):
        """Save user test to database"""
        test = UserTest.objects.get(pk=self.kwargs['nested_2_pk'])
        serializer.save(user=self.request.user, usertest=test)

    def list(self, request, *args, **kwargs):
        """Show all answers for specific test"""
        test = UserTest.objects.get(pk=self.kwargs['nested_2_pk'])
        # Check who is the owner of the test
        if self.request.user != User.objects.get(id=test.user.id):
            return Response({'error': 'Brak dostępu!'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            answers = UserTestAnswer.objects.filter(usertest=self.kwargs['nested_2_pk'])
            page = self.paginate_queryset(answers)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(answers, many=True)
            return Response(serializer.data)


# TODO: edit
# /word/userwordlist/{pk}/tests/
# /word/userwordlist/{pk}/tests/{pk}/
class ClassroomView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClassroomSerializer
    queryset = Classroom.objects.all()


# /word/userwordlist/{pk}/tests/
# /word/userwordlist/{pk}/tests/{pk}/
class ClassWordListView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClassWordList
    queryset = ClassWordList.objects.all()


# /word/userwordlist/{pk}/tests/
# /word/userwordlist/{pk}/tests/{pk}/
class ClassWordView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClassWordSerializer
    queryset = ClassWord.objects.all()

    # def list(self, request, *args, **kwargs):
    #     words = UserWord.objects.filter(userwordlist=1)
    #     result = self.filter_queryset(self.get_queryset())

    #     serializer = serializer_class.UserWordSerializer(result, many=True)
    #     return Response(result)


# class TagViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin):
#     """Manage tags in the database"""
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = (IsAuthenticated, IsAdminUser)
#     queryset = Tag.objects.all()
#     serializer_class = serializers.TagSerializer

#     def get_queryset(self):
#         """Return objects for the current authenticated user only"""
#         return self.queryset.filter(user=self.request.user).order_by('-name')

#     def perform_create(self, serializer):
#       """Create a new ingredient"""
#       serializer.save(user=self.request.user)


# class UserWordListView(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin):
#     """Manage user word list in the database"""
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = (IsAuthenticated,)
#     queryset = UserWordList.objects.all()
#     serializer_class = serializers.UserWordListSerializer

#     def get_queryset(self):
#         """Return objects for the current authenticated user only"""
#         return self.queryset.filter(user=self.request.user).order_by('-name')

#     def get_object(self):
#         words = UserWord.objects.all().filter(userwordlist = 1)
#         serializer = serializers.UserWordSerializer(words)
#         print("dadadadad")
#         print (serializer.data)
#         return Response(serializer.data)

#     def perform_create(self, serializer):
#         """Create a new word list"""
#         serializer.save(user=self.request.user)


# class UserWordListView(viewsets.ViewSet):
#     """Manage user word list in the database"""
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = (IsAuthenticated,)
#     serializer_class = serializers.UserWordListSerializer

#     def list(self, request,):
#         queryset = UserWordList.objects.filter(user=self.request.user).order_by('-name')
#         serializer = UserWordListSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def get_object(self):
#         words = UserWord.objects.all().filter(userwordlist = 1)
#         serializer = serializers.UserWordSerializer(words)
#         print("dadadadad")
#         print (serializer.data)
#         return Response(serializer.data)

#     def perform_create(self, serializer):
#         """Create a new word list"""
#         serializer.save(user=self.request.user)

# class UserWordView(viewsets.ModelViewSet):

#     """Manage user word in the database"""
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = (IsAuthenticated,)
#     serializer_class = serializers.UserWordSerializer

#     def get_queryset(self):
#         """Return objects for the current authenticated user only"""
#         return UserWord.objects.filter(userwordlist = 1)

#     def perform_create(self, serializer):
#         """Create a new word list"""
#         serializer.save(userwordlist = 1)
