from django.db import models
from .warehouse import Warehouse

class Bottle(models.Model):
    name = models.CharField(max_length=100)  # Nome della bottiglia
    typeBottle = models.CharField(max_length=50)  # Tipo della bottiglia (es. "wine", "beer", "liquor")
    quantityInStock = models.IntegerField(default=0)  # Quantità disponibile
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='bottles')  # Relazione con il magazzino

    def __str__(self):
        return f"{self.name} ({self.typeBottle})"
    def get_average_price(self):
        # Calcola il prezzo medio dinamicamente basato sugli acquisti storici
        total_cost = sum([history.price_per_unit * history.quantity for history in self.purchase_history.all()])
        total_quantity = sum([history.quantity for history in self.purchase_history.all()])
        
        return total_cost / total_quantity if total_quantity else 0.0
class BottlePurchaseHistory(models.Model):
    bottle = models.ForeignKey(Bottle, related_name="purchase_history", on_delete=models.CASCADE)
    purchase_date = models.DateField()
    quantity = models.IntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
