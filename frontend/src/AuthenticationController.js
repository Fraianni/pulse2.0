// src/components/LoginController.js
import React, { useState } from 'react';
import LoginBox from './components/login/LoginBox';
import RegisterBox from './components/login/RegisterBox';

const AuthenticationController = () => {
  const [isScreenLogin, setIsLogin] = useState(true); // Stato per gestire il toggle

  return (
    <div className="login-controller">
      <div className="toggle-buttons">
        <button onClick={() => setIsLogin(true)}>Login</button>
        <button onClick={() => setIsLogin(false)}>Registrazione</button>
      </div>

      <div className="container">
        {isScreenLogin ? <LoginBox /> : <RegisterBox />}
      </div>
    </div>
  );
};

export default AuthenticationController;
