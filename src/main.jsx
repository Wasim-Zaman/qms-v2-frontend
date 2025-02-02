import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';
import { NextUIProvider } from '@nextui-org/react';
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <NextUIProvider>
    <App />
    <Toaster />
     </NextUIProvider>
    {/* <ToastContainer /> */}
  </React.StrictMode>
);

