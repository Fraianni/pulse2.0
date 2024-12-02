from django.db import models

# Definizione di un modello per il ClubArea (se non esiste già)
class ClubArea(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class MapObject(models.Model):
    # Aggiungi il campo `type` al modello base
    TYPE_CHOICES = [
        ('table', 'Table'),
        ('structure', 'Structure'),
    ]
    
    label = models.CharField(max_length=50, blank=True, null=True)  # Campo opzionale
    x = models.FloatField(null=False, blank=False, default=0)  # Coordinata X
    y = models.FloatField(null=False, blank=False, default=0)  # Coordinata Y
    color = models.CharField(max_length=7, blank=True, null=True, default='#808080')  # Colore in formato esadecimale
    clubArea = models.ForeignKey(ClubArea, on_delete=models.CASCADE, null=True, blank=True)  # Relazione opzionale con ClubArea
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='table')  # Aggiungi il campo `type`
    
    def __str__(self):
        return self.label or ""


class ObjectTable(MapObject):
    budget = models.FloatField(null=True, blank=True)  # Budget opzionale
    customerQuantity = models.IntegerField(null=True, blank=True)  # Quantità di clienti opzionale

    def __str__(self):
        return self.label or "Tavolo senza nome"
    
class ObjectStructure(MapObject):

    def __str__(self):
        return self.label or "Struttura senza nome"
    

