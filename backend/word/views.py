from rest_framework import viewsets, mixins, generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from word.permissions import IsOwner
from rest_framework.response import Response
from rest_framework import status

from core.models import User, UserWordList, UserWord, UserTest, UserTestAnswer, \
    ClassWordList, ClassWord, Classroom, ClassTest, StudentTest, StudentTestAnswer, \
    Teacher, TeacherApplication, RatingSystem, ClassTest

from word import serializers


# /word/user/
class UserView(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.UserSerializer
    queryset = User.objects.all()
    

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
        queryset = UserWordList.objects.filter(user_id=self.request.user).order_by('-date')
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
            queryset = UserWord.objects.filter(userwordlist=self.kwargs['nested_1_pk'], user=self.request.user).order_by('polish')
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
            queryset = UserTest.objects.filter(userwordlist=self.kwargs['nested_1_pk']).order_by('-date')
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)


# /word/userwordlist/{pk}/tests/{pk}/answers/
# DENIED: /word/userwordlist/{pk}/tests/{pk}/answers/{pk}/
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

    def get_serializer(self, *args, **kwargs):
        """Provide post multiple objects to database"""
        if "data" in kwargs:
            data = kwargs["data"]

            # check if many is required
            if isinstance(data, list):
                kwargs["many"] = True

        return super(UserTestAnswerView, self).get_serializer(*args, **kwargs)

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


# /word/teacher/
class TeacherView(mixins.ListModelMixin, viewsets.GenericViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.TeacherSerializer
    queryset = Teacher.objects.all() # ATTA

    def list(self, request, *args, **kwargs):
        try:
            query = Teacher.objects.all()
        except Teacher.DoesNotExist:
            query = None

        page = self.paginate_queryset(query)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(query, many=True)
        return Response(serializer.data)


# /word/teacherapplication/
class TeacherApplicationView(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """Manage user word list in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwner)
    serializer_class = serializers.TeacherApplicationSerializer
    queryset = TeacherApplication.objects.all()

    def perform_create(self, serializer):
        """Create a new word list"""
        serializer.save(user=self.request.user)


# /word/classroom/
# /word/classroom/{pk}/
class ClassroomView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClassroomSerializer
    queryset = Classroom.objects.all()

    def create(self, serializer, *args, **kwargs):
        """Create a new classrom by teacher"""
        try:
            teacher = Teacher.objects.get(user=self.request.user)
        except Teacher.DoesNotExist:
            teacher = None

       # Check who is the owner of the list
        if teacher is None:
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
        teacher = Teacher.objects.get(user=self.request.user)
        serializer.save(teacher=teacher)

    def list(self, request, *args, **kwargs):
        try:
            teacher = Teacher.objects.get(user=self.request.user)
            queryset = Classroom.objects.filter(teacher=teacher).order_by('name')
        except Teacher.DoesNotExist:
            queryset = None

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# /word/classroom/{pk}/classwordlist/
# /word/classroom/{pk}/classwordlist/{pk}/
class ClassWordListView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClassWordListSerializer
    queryset = ClassWordList.objects.all()

    def perform_create(self, serializer):
        """Create a new word list"""
        teacher = Teacher.objects.get(user=self.request.user)
        classroom = Classroom.objects.get(teacher=teacher)   
        serializer.save(teacher=teacher, classroom=classroom)

    def list(self, request, *args, **kwargs):
        """Get teacher"""
        classroom = Classroom.objects.get(id=self.kwargs['nested_1_pk'])   

        """Show all word list for specific classroom"""
        queryset = ClassWordList.objects.filter(classroom=classroom).order_by('-date')
        # queryset = UserWord.objects.filter(userwordlist=self.kwargs['nested_1_pk'])

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

       




# /word/classroom/{pk}/classwordlist/{pk}/classwords/
# /word/classroom/{pk}/classwordlist/{pk}/classwords/{pk}/
class ClassWordView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClassWordSerializer
    queryset = ClassWord.objects.all()

    def perform_create(self, serializer):
        """Create a new word list"""
        teacher = Teacher.objects.get(user=self.request.user)
        classwordlist = ClassWordList.objects.get(id=self.kwargs['nested_2_pk'])   
        serializer.save(teacher=teacher, classwordlist=classwordlist)

    def list(self, request, *args, **kwargs):
        """Show all words for specific word list"""
        classwordlist = ClassWordList.objects.get(id=self.kwargs['nested_2_pk'])
        classroom = Classroom.objects.get(id=classwordlist.classroom.id)
        students = classroom.students.all()
        user = self.request.user        
        access = False

        try:
            teacher = Teacher.objects.get(user=self.request.user)
            access = True
        except Teacher.DoesNotExist:
            access = False

        for student in students:
            if student == user:
                access = True          

        # Check who is the owner of the list
        if access == False:
            return Response({'error': 'Brak dostępu!'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            queryset = ClassWord.objects.filter(classwordlist=self.kwargs['nested_2_pk']).order_by('polish')
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)


class RatingSystemView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.RatingSystemSerializer
    queryset = RatingSystem.objects.all()

    def perform_create(self, serializer):
        """Create a new word list"""
        teacher = Teacher.objects.get(user=self.request.user)
        serializer.save(teacher=teacher)


class ClassTestView(viewsets.ModelViewSet):
    """Manage user test in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ClassTestSerializer
    queryset = ClassTest.objects.all()

    def perform_create(self, serializer):
        """Create a new word list"""
        teacher = Teacher.objects.get(user=self.request.user)
        classwordlist = ClassWordList.objects.get(id=self.kwargs['nested_2_pk'])
        serializer.save(classwordlist=classwordlist, teacher=teacher)

    # /api/word/classroom/{pk}/classwordlist/{pk}/classtests/