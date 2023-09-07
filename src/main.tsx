import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import "./index.css";
import ThemeProvider, { initialState } from "./store/ThemeContext.tsx";
import SongsProvider, {initialSongs} from "./store/SongsContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <ThemeProvider theme={initialState}>
         <SongsProvider songsStore={initialSongs}>
            <Provider store={store}>
               <App />
            </Provider>
         </SongsProvider>
      </ThemeProvider>
   </React.StrictMode>
);