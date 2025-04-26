import { useThemeContext } from "@/stores";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";
import usePlaylistAction from "../_hooks/usePlaylistAction";

type Props = {
  className?: string;
  isLiked: boolean;
  playlist: Playlist;
};

export default function HearBtn({ isLiked, playlist, className = "p-1.5" }: Props) {
  const { theme } = useThemeContext();
  const { action, isFetching } = usePlaylistAction();

  // define style
  const classes = {
    button: `bg-${theme.alpha} hover:brightness-90 rounded-full w-[40px] flex items-center justify-center`,
  };

  return (
    <button
      onClick={() => action({ variant: "like", playlist })}
      className={` ${classes.button} ${className}`}
    >
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
