# Generated by Django 2.2.8 on 2019-12-11 11:24

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('account_type', models.CharField(choices=[('user', 'user'), ('teacher', 'teacher')], default='user', max_length=255)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Classroom',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('students', models.ManyToManyField(blank=True, related_name='students_list', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ClassTest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('classroom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Classroom')),
            ],
        ),
        migrations.CreateModel(
            name='StudentTest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('correct_answers', models.PositiveIntegerField()),
                ('incorrect_answers', models.PositiveIntegerField()),
                ('grade', models.PositiveIntegerField()),
                ('classroom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Classroom')),
                ('classtest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='studenttest', to='core.ClassTest')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserTest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('correct_answers', models.PositiveIntegerField()),
                ('incorrect_answers', models.PositiveIntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserWordList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserWord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('polish', models.CharField(max_length=255)),
                ('english', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('userwordlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userword', to='core.UserWordList')),
            ],
        ),
        migrations.CreateModel(
            name='UserTestAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('polish', models.CharField(max_length=255)),
                ('english', models.CharField(max_length=255)),
                ('answer', models.CharField(max_length=255)),
                ('correct', models.BooleanField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('usertest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.UserTest')),
            ],
        ),
        migrations.AddField(
            model_name='usertest',
            name='userwordlist',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.UserWordList'),
        ),
        migrations.CreateModel(
            name='TeacherApplication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, default='brak', max_length=1000)),
                ('status', models.CharField(choices=[('waiting...', 'waiting...'), ('accepted', 'accepted'), ('rejected', 'rejected')], default='waiting...', max_length=255)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='StudentTestAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('polish', models.CharField(max_length=255)),
                ('english', models.CharField(max_length=255)),
                ('answer', models.CharField(max_length=255)),
                ('correct', models.BooleanField()),
                ('studenttest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.StudentTest')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RatingSystem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grade_2', models.PositiveIntegerField()),
                ('grade_3', models.PositiveIntegerField()),
                ('grade_4', models.PositiveIntegerField()),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Teacher')),
            ],
        ),
        migrations.CreateModel(
            name='ClassWordList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('visibility', models.BooleanField(default=False)),
                ('classroom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Classroom')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Teacher')),
            ],
        ),
        migrations.CreateModel(
            name='ClassWord',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('polish', models.CharField(max_length=255)),
                ('english', models.CharField(max_length=255)),
                ('classwordlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classword', to='core.ClassWordList')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Teacher')),
            ],
        ),
        migrations.AddField(
            model_name='classtest',
            name='classwordlist',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.ClassWordList'),
        ),
        migrations.AddField(
            model_name='classtest',
            name='ratingsystem',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='core.RatingSystem'),
        ),
        migrations.AddField(
            model_name='classtest',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Teacher'),
        ),
        migrations.AddField(
            model_name='classroom',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Teacher'),
        ),
    ]
