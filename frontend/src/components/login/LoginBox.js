import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { toast } from "react-toastify"; // Importa ToastContainer e toast

// Definisci la mutazione per il login
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        username
        email
      }
    }
  }
`;

const LoginBox = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        variables: {
          username: username,  // Usa username per il login
          password: password,  // Mantieni la password
        },
      });

      // Salva il token ricevuto nel localStorage o gestisci la sessione
      const { token, user } = response.data.login;
      localStorage.setItem('authToken', token);
      console.log('Logged in as:', user.username);
      toast.success("Benvenuto!")
      window.location.reload();
      // TODO: Portare ad una pagina
    } catch (err) {
      toast.error('Login fallito', err.message);
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username} // Usa username come input
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginBox;
