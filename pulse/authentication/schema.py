import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth.models import User  # Importa il modello User
from django.contrib.auth import authenticate
from graphql_jwt.shortcuts import get_token

""" La libreria graphql-jwt è utilizzata per gestire l'autenticazione e la gestione dei token JWT (JSON Web Tokens) nelle applicazioni GraphQL.
    Permette di gestire l'autenticazione degli utenti in una API GraphQL utilizzando i token JWT. I JWT sono spesso usati per gestire sessioni di 
    utenti senza necessità di mantenere lo stato sul server.
    Quando un utente effettua il login, il server genera un token JWT che contiene informazioni sull'utente, e il client 
    (ad esempio, la tua app React) deve inviare questo token nelle richieste successive per dimostrare di essere autenticato.                       """


# Definisci il tipo per User
class UserType(DjangoObjectType):
    class Meta:
        model = User

# Mutazione per il login
class LoginMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    user = graphene.Field(UserType)

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)
        if user:
            token = get_token(user)
            return LoginMutation(token=token, user=user)
        raise Exception("Invalid username or password")

# Mutazione per la registrazione
class RegisterMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)
    token = graphene.String()

    def mutate(self, info, username, email, password):
        if User.objects.filter(username=username).exists():
            raise Exception('Username already exists')

        if User.objects.filter(email=email).exists():
            raise Exception('Email already exists')

        user = User(username=username, email=email)
        user.set_password(password)
        user.save()

        token = get_token(user)
        return RegisterMutation(user=user, token=token)

# Definisci il tipo root per la mutazione
class Mutation(graphene.ObjectType):
    login = LoginMutation.Field()
    register = RegisterMutation.Field()

# Schema finale con il tipo di mutazione
# Tipo Query: aggiungi un campo dummy per evitare l'errore
class Query(graphene.ObjectType):
    dummy_field = graphene.String()  # Un campo fittizio

    def resolve_dummy_field(self, info):
        return "Dummy query field"

# Lo schema finale include anche una Query
schema = graphene.Schema(query=Query, mutation=Mutation)
