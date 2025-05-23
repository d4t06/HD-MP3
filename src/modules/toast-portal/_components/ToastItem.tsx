import { useThemeContext } from "@/stores";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

type Props = {
  toast: Toast;
  onClick?: (id: string) => void;
  className?: string;
};

export default function ToastItem({ className = "", toast, onClick }: Props) {
  const { theme } = useThemeContext();

  const [isOpen, setIsOpen] = useState(false);

  const classes = {
    icon: `w-6`,
    container: `transition-[transform,opacity] text-white px-3 py-1 space-x-1 rounded-md flex items-center ${theme.modal_bg}`,
    text: `font-[500] text-sm`,
    open: "opacity-[1] translate-x-0",
    init: "opacity-0 translate-x-10",
  };

  const renderIcon = () => {
    switch (toast.variant) {
      case "success":
        return <CheckIcon  className={`${classes.icon} text-emerald-500`} />;
      case "error":
        return <XMarkIcon className={`${classes.icon} text-red-500`} />;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 0);
  }, []);

  return (
    <div
      onClick={() => (onClick ? onClick(toast.id) : undefined)}
      className={`${classes.container} ${className} ${
        isOpen ? classes.open : classes.init
      } `}
    >
      {renderIcon()}
      <p className={classes.text}>{toast.desc}</p>
    </div>
  );
}
