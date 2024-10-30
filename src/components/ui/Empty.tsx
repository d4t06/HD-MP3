import { PlusIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode } from "react";
import Button from "./Button";
interface Props {
  className?: string;
  theme: ThemeType & { alpha: string };
  onClick?: () => void;
  children?: ReactNode;
}

const Empty: FC<Props> = ({ className, onClick, theme, children }) => {
  return (
    <div
      className={`w-full hover:brightness-[90%] rounded-[8px] overflow-hidden cursor-pointer border ${theme.side_bar_bg} border-${theme.alpha}  ${className}`}
    >
      <div
        onClick={() => onClick && onClick()}
        className={`${theme?.content_hover_text} pt-[100%] relative`}
      >
        {children || (
          <Button
            className={`!absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] ${theme.text_color}`}
          >
            <PlusIcon className="w-7 md:w-10" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;
