import graphene
from graphene_django.types import DjangoObjectType
from .models import ObjectTable, ObjectStructure, MapObject

# Definizione dei tipi GraphQL
class ObjectTableType(DjangoObjectType):
    class Meta:
        model = ObjectTable

class ObjectStructureType(DjangoObjectType):
    class Meta:
        model = ObjectStructure

# Mutazione per creare un ObjectTable
class CreateObjectTable(graphene.Mutation):
    class Arguments:
        label = graphene.String()
        x = graphene.Float()
        y = graphene.Float()
        budget = graphene.Float()
        customerQuantity = graphene.Int()

    object_table = graphene.Field(ObjectTableType)

    def mutate(self, info, label, x, y, budget=None, customerQuantity=None):
        object_table = ObjectTable.objects.create(
            label=label, x=x, y=y, budget=budget, customerQuantity=customerQuantity
        )
        return CreateObjectTable(object_table=object_table)

# Mutazione per creare un ObjectStructure
class CreateObjectStructure(graphene.Mutation):
    class Arguments:
        label = graphene.String()
        x = graphene.Float()
        y = graphene.Float()

    object_structure = graphene.Field(ObjectStructureType)

    def mutate(self, info, label, x, y):
        object_structure = ObjectStructure.objects.create(
            label=label, x=x, y=y
        )
        return CreateObjectStructure(object_structure=object_structure)

# Query di esempio per ottenere i dati
class Query(graphene.ObjectType):
    all_objects = graphene.List(ObjectTableType)

    def resolve_all_objects(self, info):
        return ObjectTable.objects.all()

# Includere le mutazioni nel tuo schema
class Mutation(graphene.ObjectType):
    create_object_table = CreateObjectTable.Field()
    create_object_structure = CreateObjectStructure.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
