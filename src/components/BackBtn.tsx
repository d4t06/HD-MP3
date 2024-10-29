import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../store";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

function BackBtn() {
  const { theme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () => {
    const currentPath = location.pathname;

    let index = currentPath.lastIndexOf("/");
    let prevPath = currentPath.substring(0, index);
    if (currentPath.includes("playlist")) {
      prevPath = "/mysongs";
    }

    navigate(prevPath || "/");
  };

  const classes = {
    button: `h-[36px] w-[36px] p-[4px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`,
  };

  return (
    <button
      onClick={handleNavigate}
      className={`${classes.button} ${location.pathname === "/" ? "disable" : ""}`}
    >
      <ChevronLeftIcon />
    </button>
  );
}

export default BackBtn;
