import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Los estilos globales (tokens y clases text-*) se cargan antes que los CSS Modules
// para que los ajustes de cada componente tengan prioridad.
import './global.css';
import { App } from './navigation/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
