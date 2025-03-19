import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Import our API interceptor to enable global request/response logging
import './services/api-interceptor';
import App from './App'
import { Provider } from 'react-redux';
import { store } from './store';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
  <StrictMode>
     <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
