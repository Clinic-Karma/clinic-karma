import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(<App />);
