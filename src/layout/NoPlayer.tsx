import { FC, ReactNode } from "react";
import Sidebar from "./_components/Sidebar";
import { useThemeContext } from "@/stores";

interface Props {
  children: ReactNode;
}

const NoPlayer: FC<Props> = ({ children }) => {
  const { theme } = useThemeContext();

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
