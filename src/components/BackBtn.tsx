import { redirect, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../store";

type Props = {
  to?: string;
};

function BackBtn({ to }: Props) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (direction: "back" | "forward") => {
    if (typeof to === 'string') {
      redirect(to);
    }
    if (direction === "back") {
      navigate(-1);
    }
  };

  const classes = {
    button: `h-[36px] w-[36px] p-[6px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`,
  };

  return (
    <div className="flex gap-[10px] mb-[30px]">
      <button
        onClick={() => handleNavigate("back")}
        className={`${classes.button} ${
          location.pathname === "/" ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <ChevronLeftIcon className="" />
      </button>

      {/* <button
        onClick={() => handleNavigate("forward")}
        className={`${classes.button} ${
          prevLocation ? "" : "opacity-60 pointer-events-none"
        }`}
      >
        <ChevronRightIcon className="w-[full]" />
      </button> */}
    </div>
  );
}

export default BackBtn;
