import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Sidebar from "./components/Sidebar";
import { publicRoutes } from "./routes";
import Layout from "./Layout";

function App() {
   return (
      <Router>
         <div className="flex h-screen w-screen bg-black">
            <Routes>
               {publicRoutes.map((route, index) => {
                  const Page = route.component;

                  return (
                     <Route
                        key={index}
                        path={route.path}
                        element={
                           <Layout>
                              <Page />
                           </Layout>
                        }
                     />
                  );
               })}
            </Routes>
         </div>
      </Router>
   );
}

export default App;
