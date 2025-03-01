import { PlusIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode } from "react";
import Button from "./Button";
import { useTheme } from "@/store";
interface Props {
  className?: string;
  theme?: ThemeType;
  onClick?: () => void;
  children?: ReactNode;
}

const Empty: FC<Props> = ({ className, onClick, children }) => {

  const {theme} = useTheme()

  return (
    <div
      className={`w-full hover:brightness-[90%] rounded-[8px] overflow-hidden cursor-pointer bg-${theme.alpha}  ${className}`}
    >
      <div onClick={() => onClick && onClick()} className={`pt-[100%] relative`}>
        {children || (
          <Button
            className={`!absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]`}
          >
            <PlusIcon className="w-7 md:w-10" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;
