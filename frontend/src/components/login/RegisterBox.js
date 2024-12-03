import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// Definizione della mutazione GraphQL per la registrazione
const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

const RegisterBox = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Invia la mutazione con i dati del modulo
    register({ variables: { username, email, password } })
      .then((response) => {
        if (response.data.register.token) {
          // Salva il token nel localStorage o gestisci la sessione
          localStorage.setItem('authToken', response.data.register.token);
          console.log('Registrazione riuscita:', response.data.register.user);
        }
      })
      .catch((err) => {
        console.error('Errore di registrazione:', err);
      });
  };

  return (
    <div className="register-box">
      <h2>Registrati</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrati'}
        </button>
        {error && <p className="error">{error.message}</p>}
      </form>
      {data && data.register && <p>Registrazione avvenuta con successo!</p>}
    </div>
  );
};

export default RegisterBox;
