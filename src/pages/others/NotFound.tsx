import { Center } from "@/components";
import { useThemeContext } from "@/stores";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const { theme } = useThemeContext();
  return (
    <Center>
      <h1 className={`text-[30px] font-bold ${theme.text_color}`}>Page Not found</h1>
      <p className="text-center">
        <Link
          to={"/"}
          className={`${theme.content_bg} inline-block mt-5 text-center rounded-full px-5 py-1.5 cursor-pointer`}
        >
          Go home
        </Link>
      </p>
    </Center>
  );
}
