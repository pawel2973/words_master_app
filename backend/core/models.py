from django.db import models
from datetime import datetime

# Things that are required to extend django user model
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

from django.conf import settings


# User manager class
# Class that provides helpful functions for creating a user or creating a super user.
# We're going to override a couple of the func's to handle our e-mail address instead of the username that he expects.
class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **kwargs):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email),
                          **kwargs)  # self.model - uzyskujemy dostep do tego modelu, ktory ma menadzer
        user.set_password(password)  # cos pass must be encrypted
        user.save(using=self._db)  # using=self._db : required for supporting multiple db it's good practice

        return user

    def create_superuser(self, email, password):
        """Creates and saves a new super user"""
        user = self.create_user(email, password)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


ACC_TYPE_CHOICES = (
    ('user', 'user'),
    ('teacher', 'teacher')
)

TEACHER_APP_STATUS = (
    ('waiting...', 'waiting...'),
    ('accepted', 'accepted'),
    ('rejected', 'rejected')
)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email insted of username"""
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    account_type = models.CharField(default="user", choices=ACC_TYPE_CHOICES, max_length=255)

    objects = UserManager()

    USERNAME_FIELD = 'email'  # Basically it is specifying to use email as login rather than the username.

    def __str__(self):
        return str(self.email) + " -> " + self.first_name + " " + self.last_name


class UserWordList(models.Model):
    """Word List to be used for a users"""
    name = models.CharField(max_length=255)
    date = models.DateTimeField(default=datetime.now, blank=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        # related_name='userwordlist'
    )

    def __str__(self):
        return str(self.user) + " -> " + self.name


class UserWord(models.Model):
    """Word to be used in word list"""
    polish = models.CharField(max_length=255)
    english = models.CharField(max_length=255)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    userwordlist = models.ForeignKey(
        UserWordList,
        on_delete=models.CASCADE,
        related_name='userword'
    )

    def __str__(self):
        return str(self.userwordlist) + " -> " + self.polish + " : " + self.english


class UserTest(models.Model):
    """Test from the word list created by user"""
    date = models.DateTimeField(default=datetime.now, blank=False)
    correct_answers = models.PositiveIntegerField()
    incorrect_answers = models.PositiveIntegerField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    userwordlist = models.ForeignKey(
        UserWordList,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.userwordlist)


class UserTestAnswer(models.Model):
    """Answers to the user test"""
    polish = models.CharField(max_length=255)
    english = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    correct = models.BooleanField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    usertest = models.ForeignKey(
        UserTest,
        on_delete=models.CASCADE
    )


class Teacher(models.Model):
    """Model for the teacher"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.user)


class TeacherApplication(models.Model):
    """Model for the teacher"""
    description = models.CharField(max_length=1000, blank=True, default='brak')
    status = models.CharField(default="waiting...", choices=TEACHER_APP_STATUS, max_length=255)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )


class Classroom(models.Model):
    """Teacher classorom model"""
    name = models.CharField(max_length=255)
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE
    )
    students = models.ManyToManyField(
        User,
        blank=True,
        related_name="students_list"
    )

    def __str__(self):
        return str(self.pk) + " -> " + self.name + " -> " + str(self.teacher)


class ClassWordList(models.Model):
    """Word List to be used for a teacher and studens in classroom"""
    name = models.CharField(max_length=255)
    date = models.DateTimeField(default=datetime.now, blank=False)
    visibility = models.BooleanField(default=False)
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE
    )
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name


class ClassWord(models.Model):
    """Word to be used in class word list"""
    polish = models.CharField(max_length=255)
    english = models.CharField(max_length=255)
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE
    )
    classwordlist = models.ForeignKey(
        ClassWordList,
        on_delete=models.CASCADE,
        related_name='classword'
    )

    def __str__(self):
        return self.polish + "/" + self.english


class RatingSystem(models.Model):
    """Rating system for class test"""
    grade_2 = models.PositiveIntegerField()
    grade_3 = models.PositiveIntegerField()
    grade_4 = models.PositiveIntegerField()
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE
    )


class ClassTest(models.Model):
    """Class test created for students by teacher"""
    name = models.CharField(max_length=255)
    date = models.DateTimeField(default=datetime.now, blank=False)
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE
    )
    ratingsystem = models.OneToOneField(
        RatingSystem,
        on_delete=models.CASCADE
    )
    classwordlist = models.ForeignKey(
        ClassWordList,
        on_delete=models.CASCADE
    )
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.CASCADE
    )


class StudentTest(models.Model):
    """Student test results related to class test"""
    date = models.DateTimeField(default=datetime.now, blank=False)
    correct_answers = models.PositiveIntegerField()
    incorrect_answers = models.PositiveIntegerField()
    grade = models.PositiveIntegerField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    classtest = models.ForeignKey(
        ClassTest,
        on_delete=models.CASCADE,
        related_name="studenttest"
    )
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.CASCADE
    )

class StudentTestAnswer(models.Model):
    """Answers to the student test"""
    polish = models.CharField(max_length=255)
    english = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    correct = models.BooleanField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    studenttest = models.ForeignKey(
        StudentTest,
        on_delete=models.CASCADE
    )
