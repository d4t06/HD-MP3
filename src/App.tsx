import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { privateRoutes, publicRoutes } from "./routes";
import DefaultLayout from "./layout/DefaultLayout";
import { ToastPortal } from "./components";
import { Login, NotFound, Unauthorized } from "./pages";
import RequireAuth from "./routes/RequireAuth";
function App() {
   return (
      <>
         <Router basename="React-Zingmp3">
            <Routes>
               <Route path={"/login"} element={<Login />} />
               <Route path={"/unauthorized"} element={<Unauthorized />} />
               <Route path="*" element={<NotFound />} />

               {publicRoutes.map((route, index) => {
                  let DynamicLayout;
                  const Page = route.component;
                  if (route.layout) {
                     DynamicLayout = route.layout;
                  } else {
                     DynamicLayout = DefaultLayout;
                  }

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

               <Route element={<RequireAuth />}>
                  {privateRoutes.map((route, index) => {
                     let DynamicLayout;
                     const Page = route.component;
                     if (route.layout) {
                        DynamicLayout = route.layout;
                     } else {
                        DynamicLayout = DefaultLayout;
                     }

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
               </Route>
            </Routes>
         </Router>
         <ToastPortal autoClose />
      </>
   );
}

export default App;
