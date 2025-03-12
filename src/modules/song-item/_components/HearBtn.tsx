import { useThemeContext } from "@/stores";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";
import useSongItemAction from "../_hooks/useSongItemAction";

type Props = {
  className?: string;
  isLiked: boolean;
  song: Song;
};

export default function HearBtn({ isLiked, song, className = "p-1.5" }: Props) {
  const { theme } = useThemeContext();
  const { action, loading } = useSongItemAction();

  // define style
  const classes = {
    button: `hover:bg-${theme.alpha} rounded-full`,
    isLiked: `!block`,
  };

  return (
    <button
      onClick={() => action({ variant: "like", song })}
      className={`${classes.button} ${className} ${
        isLiked ? classes.isLiked : ""
      } block group-hover/main:block md:hidden`}
    >
      {loading ? (
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
