from rest_framework import serializers

from core.models import UserWordList, UserWord, UserTest, UserTestAnswer, Teacher, Classroom, ClassWordList, ClassWord, RatingSystem, ClassTest, StudentTest, StudentTestAnswer


class UserWordListSerializer(serializers.ModelSerializer):
    """Serializer for user word list"""

    class Meta:
        model = UserWordList
        fields = ('id', 'name', 'user')
        read_only_fields = ('id', 'user')


class UserWordSerializer(serializers.ModelSerializer):
    """Serializer for user word in user word list"""

    class Meta:
        model = UserWord
        fields = ('id', 'polish', 'english', 'user', 'userwordlist')
        read_only_fields = ('id', 'user', 'userwordlist')


class UserTestSerializer(serializers.ModelSerializer):
    """Serializer for user test"""
    
    class Meta:
        model = UserTest
        fields = ('id', 'date', 'correct_answers', 'incorrect_answers', 'userwordlist', 'user')
        read_only_fields = ('id', 'date','userwordlist', 'user')


class UserTestAnswerSerializers(serializers.ModelSerializer):  
    """Serializer for user test answer"""
    
    class Meta:
        model = UserTestAnswer
        fields = ('id', 'polish', 'english', 'answer', 'correct', 'usertest', 'user')
        read_only_fields = ('id', 'usertest', 'user')

## TODO: EDIT
# class TeacherSerializer(serializers.ModelSerializer):
#     """Serializer for teacher"""
    
#     class Meta:
#         model = Teacher
#         fields = ('id', 'user')
#         read_only_fields = ('id', 'user')


class ClassroomSerializer(serializers.ModelSerializer):
    """Serializer for classroom"""
    
    class Meta:
        model = Classroom
        fields = ('id', 'name', 'teacher', 'students')
        read_only_fields = ('id', 'date','userwordlist', 'user')


class ClassWordListSerializer(serializers.ModelSerializer):
    """Serializer for class word list"""
    
    class Meta:
        model = ClassWordList
        fields = ('id', 'name', 'visibility', 'teacher', 'classroom')
        read_only_fields = ('id', 'teacher', 'classroom')


class ClassWordSerializer(serializers.ModelSerializer):
    """Serializer for class word"""
    
    class Meta:
        model = ClassWord
        fields = ('id', 'polish', 'english', 'teacher', 'classwordlist')
        read_only_fields = ('id', 'teacher', 'classwordlist')


class ClassTestSerializer(serializers.ModelSerializer):
    """Serializer for class test"""
    
    class Meta:
        model = ClassTest
        fields = ('id', 'name', 'date', 'teacher', 'ratingsystem')
        read_only_fields = ('id', 'date','teacher')


class RatingSystemSerializer(serializers.ModelSerializer):
    """Serializer for rating system"""
    
    class Meta:
        model = RatingSystem
        fields = ('id', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'teacher')
        read_only_fields = ('id', 'teacher')


class ClassTestSerializer(serializers.ModelSerializer):
    """Serializer for class test"""
    
    class Meta:
        model = UserTest
        fields = ('id', 'name', 'date', 'teacher', 'ratingsystem')
        read_only_fields = ('id', 'teacher', 'ratingsystem')


class StudentTestSerializer(serializers.ModelSerializer):
    """Serializer for student test"""
    
    class Meta:
        model = UserTest
        fields = ('id', 'date', 'correct_answers', 'incorrect_answers', 'grade', 'user', 'classtest')
        read_only_fields = ('id', 'date', 'grade', 'user', 'classtest')


class StudentAnswerSerializers(serializers.ModelSerializer):  
    """Serializer for student answer"""
    
    class Meta:
        model = UserTestAnswer
        fields = ('id', 'polish', 'english', 'answer', 'correct', 'user', 'studenttest')
        read_only_fields = ('id', 'usertest', 'user', 'studenttest')