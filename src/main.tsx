import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Store from "./store/Store.ts";
import ThemeProvider from "./store/ThemeContext.tsx";
// import SongsProvider from "./store/SongsContext.tsx";
import ToastProvider from "./store/ToastContext.tsx";
import AuthProvider from "./store/AuthContext.tsx";
import UploadSongProvider from "./store/UploadContext.tsx";
import SongContextProvider from "./store/SongsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <SongContextProvider>
          <ToastProvider>
            <UploadSongProvider>
              {/* <CurrentPlaylistProvider> */}
              <Provider store={Store}>
                <App />
              </Provider>
              {/* </CurrentPlaylistProvider> */}
            </UploadSongProvider>
          </ToastProvider>
        </SongContextProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
