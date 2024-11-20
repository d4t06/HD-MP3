import { useNavigate } from "react-router-dom";
import { useTheme } from "../store";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

type Props = {
  variant: "sys-playlist" | "my-playlist" | "dashboard-playlist" | "my-songs";
};

function BackBtn({ variant }: Props) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleNavigate = () => {
    let path = "/";

    switch (variant) {
      case "sys-playlist":
        path = "/";
        break;
      case "my-playlist":
        path = "/mysongs";
        break;

      case "dashboard-playlist":
        path = "/dashboard";
        break;

      case "my-songs":
        path = "/";
        break;
    }

    navigate(path);
  };

  const classes = {
    button: `h-[36px] w-[36px] p-[4px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`,
  };

  return (
    <button
      onClick={handleNavigate}
      className={`${classes.button}`}
    >
      <ChevronLeftIcon />
    </button>
  );
}

export default BackBtn;
