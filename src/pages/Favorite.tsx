import { Link } from "react-router-dom";
import { useTheme } from "../store";

function Favorite() {
   const { theme } = useTheme();
   return (
      <div
         className={`min-h-screen flex flex-col items-center justify-center ${
            theme.container
         } ${theme.type === "dark" ? "text-white" : "text-black"}`}
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
