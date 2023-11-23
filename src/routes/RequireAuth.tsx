import { useEffect, useRef, useState } from "react";
import { myGetDoc } from "../utils/firebaseHelpers";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore, useTheme } from "../store";
import { User } from "../types";
import loadingGif from "../assets/loading.gif";

function RequireAuth() {
   const { userInfo } = useAuthStore();
   const [authLoading, setAuthLoading] = useState(true);
   const ranUseEffect = useRef(false);
   const { theme } = useTheme();

   const navigate = useNavigate();
   useEffect(() => {
      if (userInfo.status === "loading") {
         setAuthLoading(true);
         return;
      }

      const auth = async () => {
         setAuthLoading(true);
         try {
            const userSnapshot = await myGetDoc({
               collection: "users",
               id: userInfo?.email as string,
               msg: ">>> api: get auth info",
            });
            const userData = userSnapshot.data() as User;

            if (userData.role !== "admin") navigate("/unauthorized");

            setAuthLoading(false);
            return;
         } catch (error) {
            console.log(error);
         }
      };

      if (!ranUseEffect.current) {
         ranUseEffect.current = true;

         if (!userInfo.email) {
            setAuthLoading(false);
            return;
         } else auth();
      }
   }, [userInfo.status]);

   if (authLoading)
      return (
         <div
            className={`min-h-screen flex flex-col items-center justify-center ${theme.container}`}
         >
            <img className="w-[100px]" src={loadingGif} alt="" />
         </div>
      );

   return userInfo?.email ? <Outlet /> : <Navigate replace to={"/login"} />;
}

export default RequireAuth;
