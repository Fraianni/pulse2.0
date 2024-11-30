from django.contrib import admin
from .models.warehouse import Warehouse
from .models.bottle import Bottle

admin.site.register(Warehouse)
admin.site.register(Bottle)
