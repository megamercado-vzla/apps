import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {captureRetiaTracking} from './lib/retiaLeads';

captureRetiaTracking();

createRoot(document.getElementById('root')!).render(<App />);
