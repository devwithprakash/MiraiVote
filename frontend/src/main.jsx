import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/ui/themes";
import { AuthProvider } from "./shared/providers/AuthProvider.jsx";

import App from "./App.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing clerk publishable key");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        theme: dark,

        variables: {
          colorPrimary: "#8b5cf6",
          colorBackground: "#0f172a",
          colorInputBackground: "#111827",
          colorText: "#ffffff",

          borderRadius: "12px",

          fontFamily: "Inter",
        },
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClerkProvider>
  </StrictMode>,
);
