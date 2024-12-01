import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <App />,  // Non è più necessario avvolgere App con ApolloProvider
  document.getElementById('root')
);
