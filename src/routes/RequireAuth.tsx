import { Navigate, Outlet } from "react-router-dom";
import loadingGif from "../assets/loading.gif";
import { useAuthContext, useThemeContext } from "@/stores";
import { useEffect, useState } from "react";
import { sleep } from "@/utils/appHelpers";

export function RequireAuth() {
  const { user, loading } = useAuthContext();
  const { theme } = useThemeContext();

  if (loading)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${theme.container}`}
      >
        <img className="w-[150px]" src={loadingGif} alt="" />
      </div>
    );

  return user ? <Outlet /> : <Navigate replace to={"/login"} />;
}

export function RequireAdministrator() {
  const [isFetching, setIsFetching] = useState(true);
  const [isGranted, setIsGranted] = useState(false);

  const { user, loading } = useAuthContext();
  const { theme } = useThemeContext();

  useEffect(() => {
    const handleValidate = async () => {
      await sleep(1000);

      setIsGranted(true);
      setIsFetching(false);
    };

    handleValidate();
  }, []);

  if (loading || isFetching)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${theme.container}`}
      >
        <img className="w-[150px]" src={loadingGif} alt="" />
      </div>
    );

  return user && isGranted ? <Outlet /> : <Navigate replace to={"/unauthorized"} />;
}
