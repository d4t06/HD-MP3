import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Store from "./store/Store.ts";
import ThemeProvider, { initialState } from "./store/ThemeContext.tsx";
import SongsProvider, { initialSongs } from "./store/SongsContext.tsx";
import ToastProvider from "./store/ToastContext.tsx";
import ActuallySongsProvider from "./store/ActuallySongsContext.tsx";
import AuthProvider from "./store/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <AuthProvider>
         <ThemeProvider theme={initialState}>
            <SongsProvider songsStore={initialSongs}>
               <Provider store={Store}>
                  <ToastProvider>
                     <ActuallySongsProvider>
                        <App />
                     </ActuallySongsProvider>
                  </ToastProvider>
               </Provider>
            </SongsProvider>
         </ThemeProvider>
      </AuthProvider>
   </React.StrictMode>
);
