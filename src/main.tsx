import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
// Import storeInit first to ensure store is properly initialized
import { verifyStoreInitialized } from "./storeInit";
import store from "./store/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";

// Verify store initialization
if (!verifyStoreInitialized()) {
  console.error(
    "Store initialization failed. Application may not function correctly.",
  );
}

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </StrictMode>,
  );
} catch (error) {
  console.error("Failed to render application:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Application Failed to Load</h1>
      <p>Please refresh the page or contact support if the issue persists.</p>
      <button onclick="window.location.reload()">
        Refresh Page
      </button>
    </div>
  `;
}
