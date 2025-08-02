import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import useAuthAction from "@/hooks/useAuthActiont";

function Login() {
  const [loggedInUser] = useAuthState(auth);
  const { action } = useAuthAction();

  const navigate = useNavigate();

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
      className={`min-h-screen flex flex-col items-center justify-center bg-[--layout-cl]`}
    >
      <Button
        onClick={handleLogIn}
        variant={"default"}
        className={`bg-[--primary-cl] font-bold text-[#fff] text-[30px] rounded-full`}
      >
        Login with google
      </Button>{" "}
    </div>
  );
}

export default Login;
