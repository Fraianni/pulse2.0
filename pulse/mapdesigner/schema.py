import graphene
from graphene_django.types import DjangoObjectType
from .models import ObjectTable, ObjectStructure

class ObjectTableType(DjangoObjectType):
    class Meta:
        model = ObjectTable
        fields = "__all__" # Assicurati che i campi necessari siano inclusi

class ObjectStructureType(DjangoObjectType):
    class Meta:
        model = ObjectStructure
        fields = "__all__"  # Definisci i campi appropriati

class MapObjectUnion(graphene.Union):
    class Meta:
        types = (ObjectTableType, ObjectStructureType)

class CreateMapObject(graphene.Mutation):
    class Arguments:
        type = graphene.String(required=True)
        label = graphene.String(required=False)
        x = graphene.Float(required=True)
        y = graphene.Float(required=True)
        budget = graphene.Float(required=False)
        customerQuantity = graphene.Int(required=False)

    map_object = graphene.Field(MapObjectUnion)

    def mutate(self, info, type, x, y, label=None, budget=None, customerQuantity=None):
        if type == "table":
            obj = ObjectTable.objects.create(
                label=label, x=x, y=y, budget=budget, customerQuantity=customerQuantity, type=type
            )
        elif type == "structure":
            obj = ObjectStructure.objects.create(
                label=label, x=x, y=y,type=type
            )
        else:
            raise Exception("Tipo oggetto non valido.")
        return CreateMapObject(map_object=obj)

class Mutation(graphene.ObjectType):
    create_map_object = CreateMapObject.Field()

class Query(graphene.ObjectType):
    all_objects = graphene.List(MapObjectUnion)

    def resolve_all_objects(self, info):
        # Restituisce sia ObjectTable che ObjectStructure
        tables = ObjectTable.objects.all()
        structures = ObjectStructure.objects.all()
        return list(tables) + list(structures)

schema = graphene.Schema(query=Query, mutation=Mutation)
