import { useThemeContext } from "@/stores";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";

type Props = {
  className?: string;
  isLiked: boolean;
  singer: Singer;
};

export default function HearBtn({ isLiked, className = "p-2" }: Props) {
  const { theme } = useThemeContext();

  const isFetching = false;

  // define style
  const classes = {
    button: `bg-${theme.alpha} rounded-full`,
  };

  return (
    <button onClick={() => {}} className={` ${classes.button} ${className}`}>
      {isFetching ? (
        <ArrowPathIcon className="w-5 animate-spin" />
      ) : (
        <>
          {isLiked ? (
            <HeartIconSolid className={`w-5 ${theme.content_text}`} />
          ) : (
            <HeartIcon className="w-5" />
          )}
        </>
      )}
    </button>
  );
}
