import graphene
from graphene_django.types import DjangoObjectType
from .models.warehouse import Warehouse
from .models.bottle import Bottle
from graphene import InputObjectType

# Definiamo i tipi GraphQL per i modelli

class WarehouseType(DjangoObjectType):
    class Meta:
        model = Warehouse

class BottleType(DjangoObjectType):
    class Meta:
        model = Bottle

class CreateBottle(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        typeBottle = graphene.String(required=True)
        quantityInStock = graphene.Int(required=True)
        warehouse_id = graphene.Int(required=True)

    bottle = graphene.Field(BottleType)

    def mutate(self, info, name, typeBottle, quantityInStock, warehouse_id):
        print(f"Received warehouse_id: {warehouse_id}")  # Aggiungi questo log
        try:
            warehouse = Warehouse.objects.get(id=warehouse_id)
        except Warehouse.DoesNotExist:
            raise Exception(f"Warehouse with id {warehouse_id} does not exist.")
        
        bottle = Bottle.objects.create(
            name=name, typeBottle=typeBottle, quantityInStock=quantityInStock, warehouse=warehouse
        )
        return CreateBottle(bottle=bottle)
class BottleInput(InputObjectType):
    id = graphene.Int(required=True)  # Assicurati che il campo sia id
    quantityInStock = graphene.Int(required=True)  # Quantità da aggiornare
    totalPrice = graphene.Float()  # Prezzo totale (opzionale)
class UpdateWarehouse(graphene.Mutation):
    class Arguments:
        bottles = graphene.List(BottleInput, required=True)  # Nota la lista di BottleInput

    updated_bottles = graphene.List(BottleType)

    def mutate(self, info, bottles):
        updated_bottles = []
        
        for bottle_data in bottles:
            bottle_id = bottle_data.get('id')  # Qui userai id, non bottleId
            quantity_in_stock = bottle_data.get('quantityInStock')
            
            try:
                bottle = Bottle.objects.get(id=bottle_id)
                bottle.quantityInStock += quantity_in_stock
                bottle.save()
                
                updated_bottles.append(bottle)
            except Bottle.DoesNotExist:
                raise Exception(f"Bottle with id {bottle_id} does not exist.")
        
        return UpdateWarehouse(updated_bottles=updated_bottles)
# Definiamo le mutazioni
class Mutation(graphene.ObjectType):
    create_bottle = CreateBottle.Field()  # Mutazione per creare una bottiglia
    update_warehouse = UpdateWarehouse.Field()  # Mutazione per aggiornare il magazzino

class Query(graphene.ObjectType):
    # Query per ottenere tutti i magazzini
    all_warehouses = graphene.List(WarehouseType)

    # Query per ottenere tutte le bottiglie
    bottles = graphene.List(BottleType)  # Cambiato da all_bottles a bottles

    def resolve_all_warehouses(self, info):
        return Warehouse.objects.all()

    def resolve_bottles(self, info):  # Modifica il nome del resolver
        return Bottle.objects.all()

# Definiamo lo schema GraphQL
schema = graphene.Schema(query=Query, mutation=Mutation)
