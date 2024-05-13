import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Store from "./store/Store.ts";
import ThemeProvider, { initialState } from "./store/ThemeContext.tsx";
import SongsProvider from "./store/SongsContext.tsx";
import ToastProvider from "./store/ToastContext.tsx";
// import ActuallySongsProvider from "./store/ActuallySongsContext.tsx";
import AuthProvider from "./store/AuthContext.tsx";
import UploadSongProvider from "./store/UploadContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <AuthProvider>
         <ThemeProvider>
            <SongsProvider>
               <ToastProvider>
                  <UploadSongProvider>
                     <Provider store={Store}>
                        <App />
                     </Provider>
                  </UploadSongProvider>
               </ToastProvider>
            </SongsProvider>
         </ThemeProvider>
      </AuthProvider>
   </React.StrictMode>
);
