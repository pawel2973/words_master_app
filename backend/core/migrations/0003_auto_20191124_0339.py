# Generated by Django 2.2.7 on 2019-11-24 02:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20191124_0329'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userwordlist',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userwordlist', to=settings.AUTH_USER_MODEL),
        ),
    ]