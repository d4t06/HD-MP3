// import { useEffect, useRef, useState } from "react";
// import { myGetDoc } from "../utils/firebaseHelpers";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, useTheme } from "../store";
import loadingGif from "../assets/loading.gif";

function RequireAuth({ allowedRole }: { allowedRole: string[] }) {
   const { user, loading } = useAuthStore();
   // const [authLoading, setAuthLoading] = useState(true);
   // const ranUseEffect = useRef(false);
   const { theme } = useTheme();

   // const navigate = useNavigate();
   // useEffect(() => {
   //    if (status === "loading") {
   //       // setAuthLoading(true);
   //       return;
   //    }

   //    const auth = async () => {
   //       // setAuthLoading(true);
   //       try {
   //          if (!user) return;

   //          const userSnapshot = await myGetDoc({
   //             collection: "users",
   //             id: user.email,
   //             msg: ">>> api: get auth info",
   //          });
   //          const userData = userSnapshot.data() as User;

   //          if (userData.role !== "admin") navigate("/unauthorized");

   //          // setAuthLoading(false);
   //          return;
   //       } catch (error) {
   //          console.log(error);
   //       }
   //    };

   //    if (!ranUseEffect.current) {
   //       ranUseEffect.current = true;

   //       if (!user.email) {
   //          setAuthLoading(false);
   //          return;
   //       } else auth();
   //    }
   // }, [status]);

   if (loading)
      return (
         <div
            className={`min-h-screen flex flex-col items-center justify-center ${theme.container}`}
         >
            <img className="w-[150px]" src={loadingGif} alt="" />
         </div>
      );

   return (user && !!allowedRole?.find((role) => user.role === role)) ||
      !allowedRole.length ? (
      <Outlet />
   ) : (
      <Navigate replace to={"/login"} />
   );
}

export default RequireAuth;
