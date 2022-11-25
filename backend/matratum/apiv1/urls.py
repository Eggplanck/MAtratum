from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from apiv1 import views

urlpatterns = [
    path('timeline/<lastUpdateTime>/',views.timeline),
    path('timeline-more/<lastTime>/',views.more_timeline),
    path('latest/',views.latest),
    path('wordsearch/<word>/',views.word_search),
    path('wordsearch-more/<word>/<lastTime>/',views.word_search_more),
    path('usersearch/<word>/',views.user_search),
    path('detail/<stratum_id>/',views.stratum_detail),
    path('userdetail/<user_id>/',views.user_detail),
    path('userline-more/<user_id>/<lastTime>/',views.user_line_more),
    path('favorite/',views.favorite),
    path('favorite-more/<lastTime>/',views.favorite_more),
    path('follow/',views.follow),
    path('userfollowed/<user_id>/',views.user_followed),
    path('userfollowing/<user_id>/',views.user_following),
    path('create/',views.create_stratum),
    path('share/',views.share),
    path('signup/',views.signup),
    path('auth-login/',views.CustomAuthToken.as_view()),
    path('profile/',views.change_profile),
    path('exit/',views.account_exit),
    path('delete/',views.delete_stratum),
]

urlpatterns = format_suffix_patterns(urlpatterns)