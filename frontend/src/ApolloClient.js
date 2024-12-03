import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import Cookies from 'js-cookie';

// Ottieni il token di autenticazione e il CSRF token
const csrfToken = Cookies.get('csrftoken');
const token = localStorage.getItem('authToken');

// Aggiungi il token nell'header Authorization per tutte le richieste
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {  
      'Authorization': token ? `Bearer ${token}` : '', // Aggiungi il token JWT, se disponibile
      'X-CSRFToken': csrfToken,  // Aggiungi anche il CSRF token
    },
  });
  return forward(operation);
});

// Client per Warehouse
const warehouseClient = new ApolloClient({
  uri: 'http://localhost:8000/graphql/warehouse/', // Endpoint per warehouse
  cache: new InMemoryCache(),
  link: authLink.concat(new HttpLink({ uri: 'http://localhost:8000/graphql/warehouse/' })),
});

// Client per MapDesigner
const mapdesignerClient = new ApolloClient({
  uri: 'http://localhost:8000/graphql/mapdesigner/', // Endpoint per mapdesigner
  cache: new InMemoryCache(),
  link: authLink.concat(new HttpLink({ uri: 'http://localhost:8000/graphql/mapdesigner/' })),
});

// Client per Authentication
const authenticationClient = new ApolloClient({
  uri: 'http://localhost:8000/graphql/authentication/', // Endpoint per l'autenticazione
  cache: new InMemoryCache(),
  link: authLink.concat(new HttpLink({ uri: 'http://localhost:8000/graphql/authentication/' })),
});

export { warehouseClient, mapdesignerClient, authenticationClient };
