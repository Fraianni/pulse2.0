import graphene
from graphene_django.types import DjangoObjectType
from .models import Map, ObjectTable, ObjectStructure


# Types
class MapType(DjangoObjectType):
    """Django ObjectType for Map model."""
    class Meta:
        model = Map


class ObjectTableType(DjangoObjectType):
    """Django ObjectType for ObjectTable model."""
    class Meta:
        model = ObjectTable
        fields = "__all__"  # Ensure necessary fields are included


class ObjectStructureType(DjangoObjectType):
    """Django ObjectType for ObjectStructure model."""
    class Meta:
        model = ObjectStructure
        fields = "__all__"  # Define necessary fields


# Unions
class MapObjectUnion(graphene.Union):
    """Union type for ObjectTable and ObjectStructure."""
    class Meta:
        types = (ObjectTableType, ObjectStructureType)


# Queries
class Query(graphene.ObjectType):
    """Root query for fetching data."""
    
    # Fields
    map = graphene.Field(MapType, id=graphene.Int(required=True))  # Usa 'id' invece di 'club_area_id'
    all_objects = graphene.List(MapObjectUnion)

    def resolve_map(self, info, id):
        """Risolve una mappa per il suo id."""
        # Ora otteniamo la mappa per l'ID
        return Map.objects.filter(id=id).first()  # Usa 'id' invece di 'club_area_id'

    def resolve_all_objects(self, info):
        """Resolve all map objects (both tables and structures)."""
        tables = ObjectTable.objects.all()
        structures = ObjectStructure.objects.all()
        return list(tables) + list(structures)


# Mutations
class UpdateMap(graphene.Mutation):
    """Mutation to update map dimensions."""
    
    class Arguments:
        id = graphene.Int(required=True)  # Usa 'id' invece di 'club_area_id'
        width = graphene.Float(required=True)
        height = graphene.Float(required=True)

    map = graphene.Field(MapType)

    def mutate(self, info, id, width, height):
        """Mutate (update or create) the map dimensions."""
        # Ora otteniamo la mappa per 'id' invece di 'club_area_id'
        map_instance, created = Map.objects.get_or_create(id=id)  # Usa 'id' per ottenere o creare la mappa
        map_instance.width = width
        map_instance.height = height
        map_instance.save()
        return UpdateMap(map=map_instance)


class CreateMapObject(graphene.Mutation):
    """Mutation to create a new map object."""
    
    class Arguments:
        type = graphene.String(required=True)
        label = graphene.String(required=False)
        x = graphene.Float(required=True)
        y = graphene.Float(required=True)
        budget = graphene.Float(required=False)
        customerQuantity = graphene.Int(required=False)

    map_object = graphene.Field(MapObjectUnion)

    def mutate(self, info, type, x, y, label=None, budget=None, customerQuantity=None):
        """Create a new map object (either table or structure)."""
        if type == "table":
            obj = ObjectTable.objects.create(
                label=label, x=x, y=y, budget=budget, customerQuantity=customerQuantity, type=type
            )
        elif type == "structure":
            obj = ObjectStructure.objects.create(
                label=label, x=x, y=y, type=type
            )
        else:
            raise Exception("Invalid object type.")
        return CreateMapObject(map_object=obj)


class UpdateMapObject(graphene.Mutation):
    """Mutation to update an existing map object."""
    
    class Arguments:
        id = graphene.ID(required=True)  # Ensure ID is provided
        x = graphene.Float(required=False)
        y = graphene.Float(required=False)
        label = graphene.String(required=False)
        color = graphene.String(required=False)
        budget = graphene.Float(required=False)
        customer_quantity = graphene.Int(required=False)

    map_object = graphene.Field(MapObjectUnion)

    def mutate(self, info, id, x=None, y=None, label=None, color=None, budget=None, customer_quantity=None):
        """Update the existing map object based on the provided fields."""
        try:
            obj = ObjectTable.objects.get(id=id)
        except ObjectTable.DoesNotExist:
            try:
                obj = ObjectStructure.objects.get(id=id)
            except ObjectStructure.DoesNotExist:
                raise Exception("Object not found.")

        # Update fields
        if x is not None:
            obj.x = x
        if y is not None:
            obj.y = y
        if label is not None:
            obj.label = label
        if color is not None:
            obj.color = color
        if isinstance(obj, ObjectTable):
            if budget is not None:
                obj.budget = budget
            if customer_quantity is not None:
                obj.customer_quantity = customer_quantity

        obj.save()
        return UpdateMapObject(map_object=obj)


# Root Mutation
class Mutation(graphene.ObjectType):
    """Root mutation for creating and updating map objects."""
    
    create_map_object = CreateMapObject.Field()
    update_map_object = UpdateMapObject.Field()
    update_map = UpdateMap.Field()


# Schema
schema = graphene.Schema(query=Query, mutation=Mutation)
