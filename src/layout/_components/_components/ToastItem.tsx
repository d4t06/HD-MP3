import { useTheme } from "@/store";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type Props = {
  toast: Toast;
  onClick?: (id: string) => void;
  className?: string;
  variant?: "notify";
};

type MessageProps = {
  className?: string;
  message: string;
  variant?: "message";
};

export default function ToastItem({ className = "", ...props }: Props | MessageProps) {
  const { theme } = useTheme();

  const variant = props.variant || "notify";
  const [isOpen, setIsOpen] = useState(false);

  const classes = {
    icon: `w-6`,
    container: `transition-[transform,opacity] text-white px-3 py-1 space-x-1 rounded-md flex items-center ${theme.content_bg} border border-${theme.alpha}`,
    text: `font-[500] text-sm`,
    open: "opacity-[1] translate-x-0",
    init: "opacity-0 -translate-x-10",
  };

  const renderIcon = () => {
    if (props.variant === "notify") {
      switch (props.toast.variant) {
        case "success":
          return <CheckIcon className={`${classes.icon}`} />;
        case "error":
          return <XMarkIcon className={`${classes.icon}`} />;
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 0);
  }, []);

  return (
    <div
      onClick={() =>
        props.variant === "notify" && props.onClick
          ? props.onClick(props.toast.id)
          : undefined
      }
      className={`${classes.container} ${className} ${isOpen ? classes.open : classes.init} `}
    >
      {variant === "notify" && renderIcon()}

      <p className={classes.text}>
        {/*@ts-ignore*/}
        {variant === "notify" && props.toast.desc}
        {props.variant === "message" && props.message}
      </p>
    </div>
  );
}
