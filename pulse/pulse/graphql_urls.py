# graphql_urls.py
from django.urls import path, include

urlpatterns = [
    
    path('', include('mapdesigner.urls')),  # URL di mapdesigner
    path('', include('warehouse.urls')),  # URL di warehouse
]
