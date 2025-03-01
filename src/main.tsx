import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import reduxStore from "./stores/redux/index.ts";
import { AuthProvider, SongProvider, ThemeProvider, ToastProvider } from "./stores";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <SongProvider>
          <ToastProvider>
            <Provider store={reduxStore}>
              <App />
            </Provider>
          </ToastProvider>
        </SongProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
