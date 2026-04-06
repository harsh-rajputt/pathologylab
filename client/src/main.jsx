import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'

// Premium Font Assets
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/700.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
        <App />
    </AppProvider>
  </StrictMode>,
)
