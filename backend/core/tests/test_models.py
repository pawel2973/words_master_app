from django.test import TestCase
from django.contrib.auth import get_user_model

# from core import models


def sample_user(email='test@test.com', password='testpass'):
    """Create a sample user"""
    return get_user_model().objects.create_user(email, password)


class ModelTests(TestCase):

    def test_create_user_with_email_successful(self):
        """Test creating a new user with an email successful"""
        email = 'test@test.pl'
        password = 'Confidential55'
        user = get_user_model().objects.create_user(
            email=email,
            password=password
        )

        self.assertEqual(user.email, email)
        self.assertEqual(user.check_password(password), True)

    def test_new_user_email_normalized(self):
        """Test the email for a new user is normalized"""
        email = 'test@test.COM'
        user = get_user_model().objects.create_user(email, 'test234')

        self.assertEqual(user.email, email.lower())

    def test_new_user_invalid_email(self):
        """Test creating user with no email raises error"""
        with self.assertRaises(ValueError):  # Anything that we run in here should raise value error
            get_user_model().objects.create_user(None, 'testowe123')

    def test_create_new_superuser(self):
        """Test crating a new superuser"""
        user = get_user_model().objects.create_superuser(
            'admin@test.pl',
            'tajne123'
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        # self.assertEqual(user.email, 'admin@test.pl')
        # self.assertEqual(user.check_password('tajne123'), True)

    # def test_tag_str(self):
    #     """Test the tag string representation"""
    #     tag = models.Tag.objects.create(
    #         user=sample_user(),
    #         name='Vegan'
    #     )

    #     self.assertEqual(str(tag), tag.name)
