from django.db import models

# Definizione di un modello per il ClubArea (se non esiste già)
class ClubArea(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class ObjectTable(models.Model):
    label = models.CharField(max_length=50, blank=True, null=True)  # Campo opzionale (può essere vuoto nel database e nei form)
    x = models.FloatField(null=False, blank=False)  # Coordinata X, opzionale
    y = models.FloatField(null=False, blank=False)  # Coordinata Y, opzionale
    color = models.CharField(max_length=7, blank=True, null=True, default='#808080')  # Colore grigio (gray) in formato esadecimale
    clubArea = models.ForeignKey(ClubArea, on_delete=models.CASCADE, null=True, blank=True)  # Relazione opzionale con ClubArea
    budget = models.FloatField(null=True, blank=True)  # Budget opzionale
    customerQuantity = models.IntegerField(null=True, blank=True)  # Quantità di clienti opzionale

    def __str__(self):
        return self.label or "Tavolo senza nome"
