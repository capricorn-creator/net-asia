import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

const container = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Prerendered pages already contain markup, so hydrate. `npm run dev` serves an empty root.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);