
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a root for rendering
const root = createRoot(document.getElementById("root")!);

// Render the application
root.render(<App />);
