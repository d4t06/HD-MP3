import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { publicRoutes } from "./routes";
import DefaultLayout from "./layout/DefaultLayout";
import { ToastPortal, UploadSongPortal } from "./components";
import { NotFound } from "./pages";
function App() {
   return (
      <>
         <Router basename="React-Zingmp3">
            <Routes>
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

               <Route path="*" element={<NotFound />} />
            </Routes>
         </Router>
         <ToastPortal autoClose />
         <UploadSongPortal />
      </>
   );
}

export default App;
