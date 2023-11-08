import { ReactNode, useEffect, useState } from "react";
import { DashboardHeader } from "../components";
import { useAuthStore, useTheme } from "../store";
import { myGetDoc } from "../utils/firebaseHelpers";
import { User } from "../types";
import { Link } from "react-router-dom";

export default function DashBoardLayout({ children }: { children: ReactNode }) {
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const [loading, setLoading] = useState(false);
   const [error, setErrorMsg] = useState("");
   const text = `${theme.type === "light" ? "text-[#333]" : "text-white"}`;

   useEffect(() => {
      if (userInfo.status === "loading") {
         setLoading(true);
         return;
      }

      const auth = async () => {
         setLoading(true);
         try {
            const userSnapshot = await myGetDoc({
               collection: "users",
               id: userInfo?.email as string,
            });
            const userData = userSnapshot.data() as User;

            if (userData.role !== "admin") {
               setErrorMsg("Ops, Some thing went wrong");
            } else setLoading(false);
         } catch (error) {
            console.log(error);
         }
      };

      if (!userInfo.email) setErrorMsg("Ops, Some thing went wrong");
      auth();
   }, [userInfo]);

   return (
      <>
         <div className={`${theme.container} ${text} min-h-screen`}>
            {!loading && !error && (
               <>
                  <DashboardHeader />
                  <div className={`h-[100px]`}></div>
                  <div className="container mx-[auto]">
                  {children}
                  </div>
               </>
            )}
            {error && (
               <div className="flex flex-col justify-center items-center min-h-screen">
                  <h1 className="text-[30px]">{error}</h1>
                  <Link
                     to={"/"}
                     className={`${theme.content_bg}  text-[#fff] mt-[20px] rounded-full flex px-[20px] py-[4px] cursor-pointer`}
                  >
                     Go home
                  </Link>
               </div>
            )}
         </div>
      </>
   );
}
