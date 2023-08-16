import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import "./index.css";
import ThemeProvider, { initialState } from "./store/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <ThemeProvider theme={initialState.theme}>
         <Provider store={store}>
            <App />
         </Provider>
      </ThemeProvider>
   </React.StrictMode>
);
