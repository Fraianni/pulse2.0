from django.db import models

class Warehouse(models.Model):
    name = models.CharField(max_length=100)  # Nome del magazzino
    location = models.CharField(max_length=200)  # Posizione del magazzino

    def __str__(self):
        return f"{self.name} - {self.location}"
