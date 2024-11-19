import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type Props = {
  toast: Toast;
  theme: ThemeType & { alpha: string };
  onClick?: (id: string) => void;
};

export default function ToastItem({ toast, theme, onClick }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const classes = {
    icon: `w-6`,
    container: `transition-[transform,opacity] text-white px-3 py-1 space-x-1 rounded-md flex items-center ${theme.content_bg} border border-${theme.alpha}`,
    text: `font-[500] text-sm`,
    open: "opacity-[1] translate-x-0",
    init: "opacity-0 -translate-x-10",
  };

  const renderIcon = () => {
    switch (toast.variant) {
      case "success":
        return <CheckIcon className={`${classes.icon}`} />;
      case "error":
        return <XMarkIcon className={`${classes.icon}`} />;
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
      className={`${classes.container} ${isOpen ? classes.open : classes.init} `}
    >
      {renderIcon()}
      <p className={classes.text}>{toast.desc}</p>
    </div>
  );
}
