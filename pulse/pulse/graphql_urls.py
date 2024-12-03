# graphql_urls.py
from django.urls import path, include

urlpatterns = [
    path('mapdesigner/', include('mapdesigner.urls')),  # Endpoint per mapdesigner
    path('warehouse/', include('warehouse.urls')),  # Endpoint per warehouse
    path('authentication/', include('authentication.urls')),  # Endpoint per authentication
]
