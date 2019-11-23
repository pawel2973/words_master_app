from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _

from core import models


class UserAdmin(BaseUserAdmin):
    ordering = ['id']
    list_display = ['email', 'id', 'first_name', 'last_name', 'account_type']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'account_type')}),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                )
            }
        ),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

class ClassroomAdmin(admin.ModelAdmin):
    # Custom classroom display in django admin
    list_display = ['id', 'name', 'teacher']

class UserWordListAdmin(admin.ModelAdmin):
    # Custom classroom display in django admin
    list_display = ['name', 'user', 'id']

class UserWordAdmin(admin.ModelAdmin):
    # Custom classroom display in django admin
    list_display = ['user', 'userwordlist', 'polish', 'english', 'id']

class UserTestAdmin(admin.ModelAdmin):
    list_display = ['userwordlist', 'correct_answers', 'incorrect_answers', 'date', 'id']

class UserTestAnswersAdmin(admin.ModelAdmin):
    list_display = ['usertest', 'polish', 'english', 'answer', 'correct', 'id']

class TeacherAdmin(admin.ModelAdmin):
    list_display = ['user', 'id']

admin.site.register(models.User, UserAdmin)
admin.site.register(models.UserWordList, UserWordListAdmin)
admin.site.register(models.UserWord, UserWordAdmin)
admin.site.register(models.UserTest, UserTestAdmin)
admin.site.register(models.UserTestAnswer, UserTestAnswersAdmin)
admin.site.register(models.Teacher, TeacherAdmin)
admin.site.register(models.Classroom, ClassroomAdmin)
admin.site.register(models.ClassWordList)
admin.site.register(models.ClassWord)
admin.site.register(models.ClassTest)
admin.site.register(models.RatingSystem)
admin.site.register(models.StudentTest)
admin.site.register(models.StudentTestAnswer)