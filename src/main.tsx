import "./index.css";
import "./theme.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import reduxStore from "./stores/redux/index.ts";
import {
  AuthProvider,
  PageProvider,
  SongProvider,
  ThemeProvider,
  ToastProvider,
} from "./stores";
import UploadSongProvider from "./stores/UploadContext.tsx";
import PersistAuth from "./modules/persist-auth/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <AuthProvider>
        <ThemeProvider>
          <SongProvider>
            <ToastProvider>
              <UploadSongProvider>
                <PageProvider>
                  <PersistAuth>
                    <App />
                  </PersistAuth>
                </PageProvider>
              </UploadSongProvider>
            </ToastProvider>
          </SongProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);
