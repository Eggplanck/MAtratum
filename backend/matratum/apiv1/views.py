from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes,parser_classes
from rest_framework import status
from rest_framework.parsers import JSONParser
from apiv1.models import Stratum, Layer, Favorite, Follow
import datetime
from django.shortcuts import render,redirect
from accounts.models import User
from django.contrib.auth import login, authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.utils.timezone import localtime


def stratum_creater(stratum,user=None,include_share=False):
    favorite = False
    share = False
    if stratum.share_id != -1:
        if not include_share:
            return None
        share_stratum = Stratum.objects.get(id=stratum.share_id)
        if user != None:
            if Favorite.objects.filter(author=user,target=share_stratum).exists():
                favorite = True
            if Stratum.objects.filter(author=user,share_id=share_stratum.id).exists():
                share = True
        if share_stratum.target != -1:
            if Stratum.objects.filter(id=share_stratum.target).exists():
                target = Stratum.objects.get(id=share_stratum.target)
                target_des = {
                    'id':target.id,
                    'author':target.author.display_name,
                    'created':localtime(target.created).strftime('%Y-%m-%d %H:%M:%S%z')
                }
            else:
                target_des = {
                    'id':-1,
                    'author':'',
                    'created':''
                }
        else:
            target_des = None
        if str(share_stratum.author.avatar) != '':
            avatar_des = 'media/'+str(share_stratum.author.avatar)
        else:
            avatar_des = None
        data = {
            'created':localtime(share_stratum.created).strftime('%Y-%m-%d %H:%M:%S%z'),
            'id':share_stratum.id,
            'author':share_stratum.author.display_name,
            'author_id':share_stratum.author.user_id,
            'author_avatar':avatar_des,
            'favorite_count':share_stratum.favorite_count,
            'share_count':share_stratum.share_count,
            'favorite':favorite,
            'share':share,
            'target':target_des,
            'layers':[],
            'share_owner':stratum.author.display_name
        }
        layers = Layer.objects.filter(stratum=share_stratum).order_by('index')
        for layer in layers:
            layer_des = {
                'id':layer.id,
                'index':layer.index,
                'text':layer.text,
                'text_type':layer.text_type
            }
            data['layers'].append(layer_des)
        return data
    else:
        if user != None:
            if Favorite.objects.filter(author=user,target=stratum).exists():
                favorite = True
            if Stratum.objects.filter(author=user,share_id=stratum.id).exists():
                share = True
        if stratum.target != -1:
            if Stratum.objects.filter(id=stratum.target).exists():
                target = Stratum.objects.get(id=stratum.target)
                target_des = {
                    'id':target.id,
                    'author':target.author.display_name,
                    'created':localtime(target.created).strftime('%Y-%m-%d %H:%M:%S%z')
                }
            else:
                target_des = {
                    'id':-1,
                    'author':'',
                    'created':''
                }
        else:
            target_des = None
        if str(stratum.author.avatar) != '':
            avatar_des = 'media/'+str(stratum.author.avatar)
        else:
            avatar_des = None
        data = {
            'created':localtime(stratum.created).strftime('%Y-%m-%d %H:%M:%S%z'),
            'id':stratum.id,
            'author':stratum.author.display_name,
            'author_id':stratum.author.user_id,
            'author_avatar':avatar_des,
            'favorite_count':stratum.favorite_count,
            'share_count':stratum.share_count,
            'favorite':favorite,
            'share':share,
            'target':target_des,
            'layers':[],
            'share_owner':None
        }
        layers = Layer.objects.filter(stratum=stratum).order_by('index')
        for layer in layers:
            layer_des = {
                'id':layer.id,
                'index':layer.index,
                'text':layer.text,
                'text_type':layer.text_type
            }
            data['layers'].append(layer_des)
        return data

def user_element_creater(user):
    if str(user.avatar) != '':
        avatar_des = 'media/'+str(user.avatar)
    else:
        avatar_des = None
    data = {
        'user_id':user.user_id,
        'name':user.display_name,
        'avatar':avatar_des,
        'description':user.description
    }
    return data


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def timeline(request,lastUpdateTime,format=None):
    if request.method == 'GET':
        user = request.user
        return_object = {
            'updateTime': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S%z'),
            'line':[]
        }
        follow_list = Follow.objects.filter(follower=user)
        follow_user_list = [follow_user.followee for follow_user in follow_list]
        follow_user_list.append(user)
        if lastUpdateTime == 'all':
            time_line = Stratum.objects.filter(author__in=follow_user_list).order_by('created').reverse()[0:30]
        else:
            try:
                lastUpdateTime = datetime.datetime.strptime(lastUpdateTime,'%Y-%m-%d %H:%M:%S%z')
                time_line = Stratum.objects.filter(author__in=follow_user_list).filter(created__gt=lastUpdateTime).order_by('created').reverse()
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
        return_object['line'] = [stratum_creater(stratum,user=user,include_share=True) for stratum in time_line]
        return Response(return_object)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def more_timeline(request,lastTime,format=None):
    if request.method == 'GET':
        user = request.user
        return_object = {
            'line':[]
        }
        follow_list = Follow.objects.filter(follower=user)
        follow_user_list = [follow_user.followee for follow_user in follow_list]
        follow_user_list.append(user)
        try:
            lastTime = datetime.datetime.strptime(lastTime,'%Y-%m-%d %H:%M:%S%z').astimezone(datetime.timezone.utc)
            time_line = Stratum.objects.filter(author__in=follow_user_list).filter(created__lt=lastTime).order_by('created').reverse()[0:30]
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return_object['line'] = [stratum_creater(stratum,user=user,include_share=True) for stratum in time_line]
        return Response(return_object)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_stratum(request,format=None):
    if request.method == 'POST':
        user = request.user
        if request.data['target'] == None:
            stratum = Stratum.objects.create(author=user)
        else:
            if Stratum.objects.filter(id=request.data['target']).exists():
                stratum = Stratum.objects.create(author=user,target=request.data['target'])
            else:
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        for layer in request.data['layers']:
            Layer.objects.create(stratum=stratum,index=layer['index'],text_type=layer['text_type'],text=layer['text'])
        return Response(status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def share(request,format=None):
    if request.method == 'POST':
        user = request.user
        if Stratum.objects.filter(id=request.data['share_id']).exists():
            if not Stratum.objects.filter(author=user,share_id=request.data['share_id']).exists():
                Stratum.objects.create(author=user,share_id=request.data['share_id'])
                to_stratum = Stratum.objects.get(id=request.data['share_id'])
                to_stratum.share_count += 1
                to_stratum.save()
            else:
                stratum = Stratum.objects.get(author=user,share_id=request.data['share_id'])
                stratum.delete()
                to_stratum = Stratum.objects.get(id=request.data['share_id'])
                to_stratum.share_count -= 1
                to_stratum.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['GET'])
def latest(request,format=None):
    if request.method == 'GET':
        user = None
        if request.auth != None:
            user = request.user
        return_object = {
            'line':[]
        }
        latest_line = Stratum.objects.all().order_by('created').reverse()[0:30]
        return_object['line'] = [ss for ss in [stratum_creater(stratum,user=user) for stratum in latest_line] if ss != None]
        return Response(return_object)


@api_view(['GET'])
def word_search(request,word,format=None):
    if request.method == 'GET':
        user = None
        if request.auth != None:
            user = request.user
        return_object = {
            'line':[]
        }
        search_result = []
        layer_result = Layer.objects.filter(text__contains=word).order_by('created').reverse()[0:60]
        for layer in layer_result:
            stratum = layer.stratum
            if not stratum in search_result:
                search_result.append(stratum)
                data = stratum_creater(stratum,user=user)
                if data != None:
                    return_object['line'].append(data)
        return Response(return_object)


@api_view(['GET'])
def word_search_more(request,word,lastTime,format=None):
    if request.method == 'GET':
        user = None
        if request.auth != None:
            user = request.user
        return_object = {
            'line':[]
        }
        search_result = []
        try:
            lastTime = datetime.datetime.strptime(lastTime,'%Y-%m-%d %H:%M:%S%z').astimezone(datetime.timezone.utc)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        layer_result = Layer.objects.filter(text__contains=word).filter(created__lt=lastTime).order_by('created').reverse()[0:60]
        for layer in layer_result:
            stratum = layer.stratum
            if not stratum in search_result:
                search_result.append(stratum)
                data = stratum_creater(stratum,user=user)
                if data != None:
                    return_object['line'].append(data)
        return Response(return_object)


@api_view(['GET'])
def user_search(request,word,format=None):
    if request.method == 'GET':
        user_result = User.objects.filter(display_name__contains=word)
        user_list = [user_element_creater(user) for user in user_result]
        return_object = {
            'users':user_list
        }
        return Response(return_object)


def target_target(stratum):
    re_data = []
    child_s = Stratum.objects.filter(target=stratum.id).order_by('created')
    for ss in child_s:
        data = stratum_creater(ss)
        if data != None:
            re_data.append(data)
            re_data = re_data + target_target(ss)
    return re_data


@api_view(['GET'])
def stratum_detail(request,stratum_id,format=None):
    if request.method == 'GET':
        user = None
        if request.auth != None:
            user = request.user
        try:
            stratum = Stratum.objects.get(id=stratum_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        comment_line = Stratum.objects.filter(target=stratum_id).order_by('created')
        comment_line_data = []
        for comment_stratum in comment_line:
            data = stratum_creater(comment_stratum,user=user)
            if data != None:
                comment_line_data.append(data)
                comment_line_data = comment_line_data + target_target(comment_stratum)
        return_object = {
            'target_stratum':stratum_creater(stratum,user=user),
            'comment_line':comment_line_data
        }
        return Response(return_object)


@api_view(['GET'])
def user_detail(request,user_id,format=None):
    if request.method == 'GET':
        request_user = None
        if request.auth != None:
            request_user = request.user
        try:
            user = User.objects.get(user_id=user_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        following = False
        followed = False
        if request_user != None:
            if Follow.objects.filter(follower=request_user,followee=user).exists():
                following = True
            if Follow.objects.filter(follower=user,followee=request_user).exists():
                followed = True
        if str(user.avatar) != '':
            avatar_des = 'media/'+str(user.avatar)
        else:
            avatar_des = None
        user_data = {
            'user_id':user.user_id,
            'name':user.display_name,
            'avatar':avatar_des,
            'description':user.description,
            'follower_count':user.follower,
            'followee_count':user.followee,
            'following':following,
            'followed':followed
        }
        user_line = [stratum_creater(stratum,user=request_user,include_share=True) for stratum in Stratum.objects.filter(author=user).order_by('created').reverse()[0:30]]
        return_object = {
            'user_info':user_data,
            'user_line':user_line
        }
        return Response(return_object)


@api_view(['GET'])
def user_line_more(request,user_id,lastTime,format=None):
    if request.method == 'GET':
        request_user = None
        if request.auth != None:
            request_user = request.user
        try:
            user = User.objects.get(user_id=user_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            lastTime = datetime.datetime.strptime(lastTime,'%Y-%m-%d %H:%M:%S%z').astimezone(datetime.timezone.utc)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user_line = [stratum_creater(stratum,user=request_user,include_share=True) for stratum in Stratum.objects.filter(author=user).filter(created__lt=lastTime).order_by('created').reverse()[0:30]]
        return Response({
            'line':user_line
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def favorite_more(request,lastTime,format=None):
    user = request.user
    try:
        lastTime = datetime.datetime.strptime(lastTime,'%Y-%m-%d %H:%M:%S%z').astimezone(datetime.timezone.utc)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    favorite_list = [favo.target for favo in Favorite.objects.filter(author=user).filter(created__lt=lastTime).order_by('created').reverse()[0:30]]
    favorite_line = []
    for favorite_stratum in favorite_list:
        data = stratum_creater(favorite_stratum,user=user)
        if data != None:
            favorite_line.append(data)
    return_object = {
        'line':favorite_line
    }
    return Response(return_object)


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def favorite(request,format=None):
    user = request.user
    if request.method == 'POST':
        try:
            stratum = Stratum.objects.get(id=request.data['id'])
            if not Favorite.objects.filter(author=user,target=stratum).exists():
                Favorite.objects.create(author=user,target=stratum)
                stratum.favorite_count += 1
                stratum.save()
                return Response(status=status.HTTP_201_CREATED)
            else:
                favo = Favorite.objects.get(author=user,target=stratum)
                favo.delete()
                stratum.favorite_count -= 1
                stratum.save()
                return Response(status=status.HTTP_202_ACCEPTED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'GET':
        favorite_list = [favo.target for favo in Favorite.objects.filter(author=user).order_by('created').reverse()[0:30]]
        favorite_line = []
        for favorite_stratum in favorite_list:
            data = stratum_creater(favorite_stratum,user=user)
            if data != None:
                favorite_line.append(data)
        return_object = {
            'favorite_line':favorite_line
        }
        return Response(return_object)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow(request,format=None):
    user = request.user
    if request.method == 'POST':
        try:
            follow_user = User.objects.get(user_id=request.data['user_id'])
            if user == follow_user:
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
            if not Follow.objects.filter(follower=user,followee=follow_user).exists():
                Follow.objects.create(follower=user,followee=follow_user)
                user.followee += 1
                user.save()
                follow_user.follower += 1
                follow_user.save()
                return Response(status=status.HTTP_201_CREATED)
            else:
                foll = Follow.objects.get(follower=user,followee=follow_user)
                foll.delete()
                user.followee -= 1
                user.save()
                follow_user.follower -= 1
                follow_user.save()
                return Response(status=status.HTTP_202_ACCEPTED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def user_following(request,user_id,format=None):
    try:
        user = User.objects.get(user_id=user_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        user_follow_list = Follow.objects.filter(follower=user).reverse()
        user_list = [user_element_creater(user_follow.followee) for user_follow in user_follow_list]
        return_object = {
            'users':user_list
        }
        return Response(return_object)


@api_view(['GET'])
def user_followed(request,user_id,format=None):
    try:
        user = User.objects.get(user_id=user_id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        user_followed_list = Follow.objects.filter(followee=user).reverse()
        user_list = [user_element_creater(user_follow.follower) for user_follow in user_followed_list]
        return_object = {
            'users':user_list
        }
        return Response(return_object)


from django.contrib.auth.password_validation import MinimumLengthValidator,CommonPasswordValidator,NumericPasswordValidator
from django.core.exceptions import ValidationError
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request,format=None):
    if request.method == 'POST':
        try:
            MinimumLengthValidator().validate(request.data['password'])
            CommonPasswordValidator().validate(request.data['password'])
            NumericPasswordValidator().validate(request.data['password'])
        except ValidationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.create_user(user_id=request.data['user_id'],password=request.data['password'],display_name=request.data['display_name'])
        except:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        token,created = Token.objects.get_or_create(user=user)
        return_object = {
            'token':token.key,
            'user_id':user.user_id
        }
        return Response(return_object)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_profile(request,format=None):
    if request.method == 'POST':
        try:
            user = request.user
            user.display_name = request.data['display_name']
            user.description = request.data['description']
            if request.data['file']:
                user.avatar = request.data['file']
            user.save()
            if str(user.avatar) != '':
                avatar_des = 'media/'+str(user.avatar)
            else:
                avatar_des = None
            return Response({
                'display_name':user.display_name,
                'description':user.description,
                'avatar':avatar_des
            })
        except:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_stratum(request,format=None):
    user = request.user
    if request.method == 'POST':
        try:
            stratum = Stratum.objects.get(id=request.data['id'])
            if stratum.author == user:
                sharing_s = Stratum.objects.filter(share_id=stratum.id)
                sharing_s.delete()
                stratum.delete()
                return Response(status=status.HTTP_202_ACCEPTED)
            else:
                return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        except:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def account_exit(request,format=None):
    if request.method == 'POST':
        user = request.user
        user.delete()
        return Response(status=status.HTTP_202_ACCEPTED)

class CustomAuthToken(ObtainAuthToken):
    def post(self,request,*args,**kwargs):
        serializer = self.serializer_class(data=request.data,context={'request':request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token':token.key,
            'user_id':user.user_id
        })