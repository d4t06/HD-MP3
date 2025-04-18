import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useThemeContext } from "@/stores";
import useAuthAction from "@/hooks/useAuthActiont";

function Login() {
  const [loggedInUser] = useAuthState(auth);
  const { theme } = useThemeContext();
  const { action } = useAuthAction();

  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location?.state?.from || "/dashboard";

  // const ranRedirect = useRef(false);

  const handleLogIn = async () => {
    try {
      await action("login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
      return;
    }
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${theme.container} ${theme.text_color}`}
    >
      <Button
        onClick={handleLogIn}
        variant={"default"}
        className={`${theme.content_bg} font-bold text-[#fff] text-[30px] rounded-full`}
      >
        Login with google
      </Button>{" "}
    </div>
  );
}

export default Login;
