import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';

// Get CSRF token from cookies
const csrfToken = Cookies.get('csrftoken');

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql/', // Replace with your GraphQL URI
});

// Add context with CSRF token and log the headers
const authLink = setContext((_, { headers }) => {
  console.log('Headers before setting CSRF:', headers);
  const updatedHeaders = {
    ...headers,
    'X-CSRFToken': csrfToken, // Set the CSRF token
  };
  console.log('Headers after setting CSRF:', updatedHeaders);
  return { headers: updatedHeaders };
});

// Log errors during GraphQL operations
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);
  }
});

// Create the Apollo client with the error link and auth link
const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
