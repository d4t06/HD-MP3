import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/stores";
import { useEffect, useState } from "react";
import { sleep } from "@/utils/appHelpers";
import { Center, Loading } from "@/components";

export function RequireAuth() {
  const { user, loading } = useAuthContext();

  if (loading)
    return (
      <Center>
        <Loading />
      </Center>
    );

  return user ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: "/my-music" }} replace to={"/login"} />
  );
}

export function RequireAdministrator() {
  const [isFetching, setIsFetching] = useState(true);
  const [isGranted, setIsGranted] = useState(false);

  const { user, loading } = useAuthContext();

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
      <Center>
        <Loading />
      </Center>
    );

  return user && isGranted ? (
    <Outlet />
  ) : (
    <Navigate replace to={"/unauthorized"} />
  );
}
