import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient.js";

// Import auth debugging utilities (makes them available in browser console)
import './utils/authDebug.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);