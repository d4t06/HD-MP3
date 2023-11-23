import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { useAuthActions } from "../store/AuthContext";
import { useTheme } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

function Login() {
   const [loggedInUser] = useAuthState(auth);
   const { logIn } = useAuthActions();

   const { theme } = useTheme();

   const navigate = useNavigate();
   const location = useLocation();
   const from = location?.state?.from?.pathname || "/dashboard";

   const handleLogIn = async () => {
      try {
         await logIn();
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      if (loggedInUser?.email) {
         navigate(from, { replace: true });
         return;
      }
      console.log("run effect");
   }, [loggedInUser]);

   return (
      <div
         className={`min-h-screen flex flex-col items-center justify-center ${
            theme.container
         } ${theme.type === "dark" ? "text-white" : "text-black"}`}
      >
         <Button
            onClick={handleLogIn}
            variant={"default"}
            size={"normal"}
            className={`${theme.content_bg} font-bold text-[#fff] text-[30px] rounded-full`}
         >
            Login with google
         </Button>{" "}
      </div>
   );
}

export default Login;
