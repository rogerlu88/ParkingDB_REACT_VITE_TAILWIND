import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Rendering main.jsx');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('App component rendered successfully');
