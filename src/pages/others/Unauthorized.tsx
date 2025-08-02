import { Button } from "@/components";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  const handleExit = async () => {
    await signOut(auth);

    navigate("/login");
  };

  return (
    <div
      className={`bg-[--layout-cl] text-[--text-cl] flex flex-col justify-center items-center min-h-screen`}
    >
      <h1 className={`text-[30px] font-bold border p-[10px]`}>Unauthorized</h1>
      <Button
        onClick={handleExit}
        variant={"primary"}
        color="primary"
        className={`font-bold text-[20px]  text-[#fff] rounded-full mt-[20px]`}
      >
        Exit
      </Button>
    </div>
  );
}

export default Unauthorized;
