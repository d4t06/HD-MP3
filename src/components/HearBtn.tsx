import { useThemeContext } from "@/stores";
import { HeartIcon } from "@heroicons/react/20/solid";

type Props = {
  onClick: () => void;
  className?: string;
  active?: boolean;
};

export default function HearBtn({ onClick, active, className = "p-1.5" }: Props) {
  const { theme } = useThemeContext();

  // define style
  const classes = {
    button: `${theme.content_hover_bg} rounded-full`,
    active: `!block`,
  };

  return (
    <button
      onClick={onClick}
      className={`${classes.button} ${className} ${
        active ? classes.active : ""
      } block group-hover/main:block md:hidden`}
    >
      <HeartIcon className="w-5" />
    </button>
  );
}
