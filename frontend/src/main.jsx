import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App.jsx";
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const clientID = import.meta.env.VITE_GOOGLE_OAUTH_API_ID;

createRoot(document.getElementById("root")).render(
  // <GoogleOAuthProvider clientId={clientID}>
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
  // </GoogleOAuthProvider>
);
