from django.contrib import admin
from apiv1.models import Layer, Stratum, Favorite, Follow


@admin.register(Layer)
class Layer(admin.ModelAdmin):
    pass

@admin.register(Stratum)
class Stratum(admin.ModelAdmin):
    pass

@admin.register(Favorite)
class Favorite(admin.ModelAdmin):
    pass

@admin.register(Follow)
class Follow(admin.ModelAdmin):
    pass