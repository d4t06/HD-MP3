import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/stores";
// import { useEffect, useState } from "react";
// import { sleep } from "@/utils/appHelpers";
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
  const { user, loading } = useAuthContext();

  if (loading)
    return (
      <Center>
        <Loading />
      </Center>
    );

  return user && user.role === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate replace to={"/unauthorized"} />
  );
}
