import { FC, ReactNode } from "react";
import { useThemeContext } from "@/stores";
import Sidebar from "@/modules/sidebar";

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
