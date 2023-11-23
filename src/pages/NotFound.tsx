import { Link } from "react-router-dom";
import { useTheme } from "../store";

export default function NotFound() {
   const { theme } = useTheme();
   return (
      <div
         className={`min-h-screen flex flex-col items-center justify-center ${
            theme.container
         } ${theme.type === "dark" ? "text-white" : "text-black"}`}
      >
         <h1
            className={`text-[30px] font-bold border p-[10px] ${
               theme.type === "light" ? "text-[#333]" : "text-white"
            }`}
         >
            Page Not found
         </h1>
         <Link
            to={"/"}
            className={`${theme.content_bg} font-bold  text-[#fff] mt-[20px] rounded-full flex px-[20px] py-[4px] cursor-pointer`}
         >
            Go home
         </Link>{" "}
      </div>
   );
}
