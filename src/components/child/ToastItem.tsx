import { CheckIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

type Props = {
  toast: Toast;
  theme: ThemeType & { alpha: string };
  onClick?: (id: string) => void;
};

export default function ToastItem({ toast, theme, onClick }: Props) {
  const classes = {
    icon: `w-6`,
    container: `text-white px-3 py-1 rounded-md flex items-center  ${theme.content_bg} border border-${theme.alpha}`,
    text: `font-[500] text-sm`,
  };

  const renderIcon = () => {
    switch (toast.title) {
      case "success":
        return <CheckIcon className={`${classes.icon} text-emerald-500 `} />;
      case "error":
        return <XMarkIcon className={`${classes.icon} text-red-500`} />;
      case "warning":
        return <ExclamationCircleIcon className={`${classes.icon} text-yellow-500`} />;
    }
  };

  return (
    <div
      onClick={() => (onClick ? onClick(toast.id) : undefined)}
      className={`${classes.container} animate-[fadeIn_0.3s_linear]`}
    >
      {toast.title && <span className="mr-[10px]">{renderIcon()}</span>}
      <p className={classes.text}>{toast.desc}</p>
    </div>
  );
}
