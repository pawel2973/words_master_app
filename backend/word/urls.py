from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from word import views

router = DefaultRouter()

# /api/word/userwordlist/
# /api/word/userwordlist/{pk}/
router.register('userwordlist', views.UserWordListView, base_name='userwordlist')

# /api/word/userwordlist/{pk}/words/
# /api/word/userwordlist/{pk}/words/{pk}/
user_word_router = routers.NestedSimpleRouter(router, 'userwordlist')
user_word_router.register('words', views.UserWordView, base_name='words')

# /api/word/userwordlist/{pk}/tests/
# /api/word/userwordlist/{pk}/tests/{pk}/
user_test_router = routers.NestedSimpleRouter(router, 'userwordlist')
user_test_router.register('tests', views.UserTestView, base_name='tests')

# /api/word/userwordlist/{pk}/tests/{pk}/answers/
user_test_answer_router = routers.NestedSimpleRouter(user_test_router, 'tests')
user_test_answer_router.register('answers', views.UserTestAnswerView, base_name='answers')

# /api/word/classroom/
# /api/word/classroom/{pk}/
router.register('classroom', views.ClassroomTeacherView, base_name='classroom')

# /api/word/studentclassroom/
# /api/word/studentclassroom/{pk}/
router.register('studentclassroom', views.ClassroomStudentView, base_name='studentclassroom')

# /api/word/classroom/{pk}/classtests/
# /api/word/classroom/{pk}/classtests/{pk}/
class_test_view_router = routers.NestedSimpleRouter(router, 'classroom')
class_test_view_router.register('classtests', views.ClassTestView, base_name='classtests')

# /api/word/classroom/{pk}/classtests/{pk}/studenttestcreate/
# /api/word/classroom/{pk}/classtests/{pk}/studenttestcreate/{pk}/
student_create_test_view_router = routers.NestedSimpleRouter(class_test_view_router, 'classtests')
student_create_test_view_router.register(
    'studenttestcreate', views.StudentCreateTestView, base_name='studenttestcreate')

# /api/word/classroom/{pk}/studenttests/
# /api/word/classroom/{pk}/studenttests/{pk}/
show_student_classroom_test_view_router = routers.NestedSimpleRouter(router, 'classroom')
show_student_classroom_test_view_router.register(
    'studenttests', views.StudentClassroomShowTestView, base_name='studenttests')

# /api/word/classroom/{pk}/classwordlist/
# /api/word/classroom/{pk}/classwordlist/{pk}/
classroom_word_list_router = routers.NestedSimpleRouter(router, 'classroom')
classroom_word_list_router.register('classwordlist', views.ClassWordListView, base_name='classwordlist')

# /api/word/classroom/{pk}/classwordlist/{pk}/classwords/
# /api/word/classroom/{pk}/classwordlist/{pk}/classwords/{pk}/
classroom_word_router = routers.NestedSimpleRouter(classroom_word_list_router, 'classwordlist')
classroom_word_router.register('classwords', views.ClassWordView, base_name='classwords')

# /api/word/classroom/{pk}/classwordlist/{pk}/ratingsystem/
# /api/word/classroom/{pk}/classwordlist/{pk}/ratingsystem/{pk}/
classroom_rating_system_list_router = routers.NestedSimpleRouter(classroom_word_list_router, 'classwordlist')
classroom_rating_system_list_router.register('ratingsystem', views.RatingSystemView, base_name='ratingsystem')

# /api/word/teacher/
# /api/word/teacher/{pk}/
router.register('teacher', views.TeacherView, base_name='teacher')

# /api/word/teacherapplication/
# /api/word/teacherapplication/{pk}/
router.register('teacherapplication', views.TeacherApplicationView, base_name='teacherapplication')

# /api/word/user/
# /api/word/user/{pk}/
router.register('user', views.UserView, base_name='user')

# /api/word/classroom/{pk}/classwordlist/{pk}/classtests/
# /api/word/classroom/{pk}/classwordlist/{pk}/classtests/{pk}/
class_test_router = routers.NestedSimpleRouter(classroom_word_list_router, 'classwordlist')
class_test_router.register('classtests', views.ClassTestView, base_name='classtests')

# /api/word/classroom/{pk}/classtests/{pk}/studenttest/
# /api/word/classroom/{pk}/classtests/{pk}/studenttest/{pk}/
student_test_view_router = routers.NestedSimpleRouter(class_test_view_router, 'classtests')
student_test_view_router.register('studenttest', views.StudentTestView, base_name='studenttest')

# api/word/classroom/{pk}/classtests/{pk}/studenttest/{pk}/studentanswers/
# api/word/classroom/{pk}/classtests/{pk}/studenttest/{pk}/studentanswers/{pk}/
student_test_answer_view_router = routers.NestedSimpleRouter(student_test_view_router, 'studenttest')
student_test_answer_view_router.register('studentanswers', views.StudentTestAnswerView, base_name='studentanswers')

# /api/word/classroom/{pk}/studenttests/
# /api/word/classroom/{pk}/studenttests/{pk}/
student_classroom_test_view_router = routers.NestedSimpleRouter(router, 'classroom')
student_classroom_test_view_router.register('studenttests', views.StudentClassroomTestView, base_name='studenttests')

# /api/word/classroom/{pk}/student/{pk}/
teacher_student_view_router = routers.NestedSimpleRouter(router, 'classroom')
teacher_student_view_router.register(
    'student', views.UserView, base_name='student')

# /api/word/classroom/{pk}/student/{pk}/teacherstudenttests/
# /api/word/classroom/{pk}/student/{pk}/teacherstudenttests/{pk}/
teacher_student_show_test_view_router = routers.NestedSimpleRouter(teacher_student_view_router, 'student')
teacher_student_show_test_view_router.register(
    'teacherstudenttests', views.TeacherStudentShowTestView, base_name='teacherstudenttests')

# /api/word/classroom/{pk}/studenttests/{pk}/answers/
# /api/word/classroom/{pk}/studenttests/{pk}/answers/{pk}/
show_student_classroom_test_answers_view_router = routers.NestedSimpleRouter(
    show_student_classroom_test_view_router, 'studenttests')
show_student_classroom_test_answers_view_router.register(
    'answers', views.StudentClassroomShowTestAnswerView, base_name='answers')

app_name = 'word'

urlpatterns = [
    url('', include(router.urls)),
    url('', include(user_word_router.urls)),
    url('', include(user_test_router.urls)),
    url('', include(user_test_answer_router.urls)),
    url('', include(classroom_word_list_router.urls)),
    url('', include(classroom_word_router.urls)),
    url('', include(classroom_rating_system_list_router.urls)),
    url('', include(class_test_router.urls)),
    url('', include(class_test_view_router.urls)),
    url('', include(student_test_view_router.urls)),
    url('', include(student_test_answer_view_router.urls)),
    url('', include(student_classroom_test_view_router.urls)),
    url('', include(show_student_classroom_test_view_router.urls)),
    url('', include(show_student_classroom_test_answers_view_router.urls)),
    url('', include(student_create_test_view_router.urls)),
    url('', include(teacher_student_view_router.urls)),
    url('', include(teacher_student_show_test_view_router.urls))
]
