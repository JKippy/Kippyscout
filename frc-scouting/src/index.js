import React from 'react';
import ReactDOM from 'react-dom/client'; // Update for React 18
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = "dev--t7azcqf.us.auth0.com"; // Replace with your Auth0 domain
const clientId = "OoNiLmfeqbeo8qsvJXcoeBDe599d3dJL"; // Replace with your Auth0 client ID

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot for React 18

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin // Updated to use authorizationParams
    }}
  >
    <App />
  </Auth0Provider>
);

