import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Sidebar from "./components/Sidebar";
import { publicRoutes, routes } from "./routes";
import DefaultLayout from "./layout/DefaultLayout";
import Auth from "./components/Auth";
import { appConfig } from "./config/app";
import MySongsPage from "./pages/MySongs";
// import Auth from "./components/Auth";

function App() {
   if (appConfig.isDebug) {
      return (
         <Router>
            <Routes>
               <Route
                  path={routes.Home}
                  element={
                     <DefaultLayout>
                        <MySongsPage />
                     </DefaultLayout>
                  }
               />
            </Routes>
         </Router>
      );
   }
   return (
      <Router>
         <Routes>
            {publicRoutes.map((route, index) => {
               let DynamicLayout;
               const Page = route.component;
               if (route.layout) {
                  DynamicLayout = route.layout;
               } else {
                  DynamicLayout = DefaultLayout;
               }

               if (route.path === routes.dashboard)
                  return (
                     <Route
                        key={index}
                        path={route.path}
                        element={
                           <Auth>
                              <Page />
                           </Auth>
                        }
                     />
                  );

               return (
                  <Route
                     key={index}
                     path={route.path}
                     element={
                        <DynamicLayout>
                           <Page />
                        </DynamicLayout>
                     }
                  />
               );
            })}
         </Routes>
      </Router>
   );
}

export default App;
