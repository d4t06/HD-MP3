import { FC, ReactNode } from "react";
import { useTheme } from "@/store/ThemeContext";
import Sidebar from "./_components/Sidebar";

interface Props {
  children: ReactNode;
}

const NoPlayer: FC<Props> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <>
      <div className={`h-screen w-screen flex ${theme.text_color} ${theme.container}`}>
        <Sidebar />
        <div className="w-full overflow-auto h-full">
          <div className="px-[40px] max-[549px]:px-[10px]">{children}</div>
        </div>
      </div>
    </>
  );
};
export default NoPlayer;
