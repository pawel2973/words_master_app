from django.contrib.auth import get_user_model
from django.test import TestCase
from django.test import Client  # allows us to make test request to our app in unit test

from django.urls import reverse  # allows us to generate URL's for django admin page


class AdminSiteTests(TestCase):

    def setUp(self):
        """Function that runs before every test that we run."""
        self.client = Client()
        self.admin_user = get_user_model().objects.create_superuser(
            email='admin@admin.pl',
            password='admin123'
        )
        self.client.force_login(self.admin_user)
        self.user = get_user_model().objects.create_user(
            email='user@user.pl',
            password='user123',
            name='Test user full name'
        )

    def test_users_listed(self):
        """Test that users are listed on user page"""
        url = reverse('admin:core_user_changelist')
        res = self.client.get(url)

        self.assertContains(res, self.user.name)
        self.assertContains(res, self.user.email)

    def test_user_page_change(self):
        """Test that the user edit page works"""
        # /admin/core/user/1
        url = reverse('admin:core_user_change', args=[self.user.id])
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)

    def test_create_user_page(self):
        """Test that the create user page works"""
        url = reverse('admin:core_user_add')
        res = self.client.get(url)

        self.assertEqual(res.status_code, 200)
