import { Link } from "react-router-dom";
import { useThemeContext } from "../stores";

function Favorite() {
  const { theme } = useThemeContext();
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${theme.container} ${theme.text_color}`}
    >
      <h1 className="text-[40px]">Not found</h1>
      <Link
        className={`${theme.content_bg} px-[20px] py-[6px] text-[20px] rounded-full mt-[30px]`}
        to={"/"}
      >
        Home
      </Link>
    </div>
  );
}

export default Favorite;
