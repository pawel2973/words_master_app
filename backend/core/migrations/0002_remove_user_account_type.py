# Generated by Django 2.2.9 on 2020-01-25 21:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='account_type',
        ),
    ]