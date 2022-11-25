from rest_framework import serializers
from apiv1.models import Stratum, Layer
from accounts.models import User


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField()
    class Meta:
        model = User
        fields = ['display_name','description','avatar']

class LayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Layer
        fields = ['index','text_type','text']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id','display_name','avatar']

class StratumSerializer(serializers.ModelSerializer):
    layer = LayerSerializer(many=True)
    author = UserSerializer()

    class Meta:
        model = Stratum
        fields = ['created','layer','author','favorite_count','share_count']
    def create(self,validated_data):
        children_data = validated_data.pop('children')
        stratum = Stratum.objects.create()
        for item in children_data:
            Layer.objects.create(parent=stratum,**item)
        return stratum
    def update(self,instance,validated_data):
        children_data = {item['index']:item for item in validated_data.pop('children')}
        pre_children = {item.index:item for item in Layer.objects.filter(parent=instance)}
        for index, data in children_data.items():
            pre_data = pre_children.get(index,None)
            if pre_data is None:
                Layer.objects.create(parent=instance,**data)
            else:
                pre_data.texttype = data.get('texttype',pre_data.texttype)
                pre_data.text = data.get('text',pre_data.text)
                pre_data.save()
        instance.save()
        return instance