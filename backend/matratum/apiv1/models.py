from django.db import models
from accounts.models import User


class Stratum(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User,on_delete=models.CASCADE,related_name='author_stratum')
    favorite_count = models.IntegerField(default=0)
    share_count = models.IntegerField(default=0)
    target = models.IntegerField(default=-1)
    share_id = models.IntegerField(default=-1)
    class Meta:
        ordering = ['created']

class Layer(models.Model):
    stratum = models.ForeignKey(Stratum, on_delete=models.CASCADE,related_name='layer')
    created = models.DateTimeField(auto_now_add=True)
    index = models.IntegerField(default=0)
    text_type = models.CharField(max_length=5,blank=False)
    text = models.TextField()
    class Meta:
        ordering = ['created']

class Favorite(models.Model):
    author = models.ForeignKey(User,on_delete=models.CASCADE,related_name='author_favos')
    target = models.ForeignKey(Stratum, on_delete=models.CASCADE,related_name='favos')
    created = models.DateTimeField(auto_now_add=True)

class Follow(models.Model):
    follower = models.ForeignKey(User,on_delete=models.CASCADE,related_name='following')
    followee = models.ForeignKey(User,on_delete=models.CASCADE,related_name='followed')