// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import CustomConfigProvider from "./theme/CustomConfigProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeviceProvider from "./contexts/ResponsiveContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { GoogleAuthProvider } from "./contexts/GoogleAuthContext.jsx";
import { SignalRProvider } from "./contexts/SIgnalRContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <GoogleAuthProvider>
          <SignalRProvider>
            <DeviceProvider>
              <CustomConfigProvider>
                <App />
              </CustomConfigProvider>
            </DeviceProvider>
          </SignalRProvider>
        </GoogleAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
