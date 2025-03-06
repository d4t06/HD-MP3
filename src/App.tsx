import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { privateRoutes, protectedRoutes, publicRoutes } from "./routes";
import { NotFoundPage } from "./pages";
import { RequireAdministrator, RequireAuth } from "./routes/RequireAuth";
import { ReactNode } from "react";

function OutletLayout({ children }: { children: ReactNode }) {
  return children;
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />

          {publicRoutes.map((route, index) => {
            const Layout = route.layout || OutletLayout;
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

          <Route element={<RequireAuth />}>
            {protectedRoutes.map((route, index) => {
              const Layout = route.layout || OutletLayout;
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

            <Route element={<RequireAdministrator />}>
              {privateRoutes.map((route, index) => {
                const Layout = route.layout || OutletLayout;
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
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
