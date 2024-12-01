import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import Cookies from 'js-cookie';

// CSRF token
const csrfToken = Cookies.get('csrftoken');

// Client per Warehouse
const warehouseClient = new ApolloClient({
  uri: 'http://localhost:8000/graphql/warehouse/', // Endpoint per warehouse
  cache: new InMemoryCache(),
  headers: {
    'X-CSRFToken': csrfToken, // CSRF token
  },
});

// Client per MapDesigner
const mapdesignerClient = new ApolloClient({
  uri: 'http://localhost:8000/graphql/mapdesigner/', // Endpoint per mapdesigner
  cache: new InMemoryCache(),
  headers: {
    'X-CSRFToken': csrfToken, // CSRF token
  },
});

export { warehouseClient, mapdesignerClient };
