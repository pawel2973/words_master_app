from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from word import views

router = DefaultRouter()
router.register('userwordlist', views.UserWordListView, base_name='userwordlist')

user_word_router = routers.NestedSimpleRouter(router, 'userwordlist')
user_word_router.register('words', views.UserWordView, base_name='words')

user_test_router = routers.NestedSimpleRouter(router, 'userwordlist')
user_test_router.register('tests', views.UserTestView, base_name='tests')

user_test_answer_router = routers.NestedSimpleRouter(user_test_router, 'tests')
user_test_answer_router.register('answers', views.UserTestAnswerView, base_name='answers')

router.register('teacher', views.TeacherView, base_name='teacher')
router.register('classroom', views.ClassroomView, base_name='classroom')
router.register('teacherapplication', views.TeacherApplicationView, base_name='teacherapplication')

app_name = 'word'

urlpatterns = [
    url('', include(router.urls)),
    url('', include(user_word_router.urls)),
    url('', include(user_test_router.urls)),
    url('', include(user_test_answer_router.urls))
]
