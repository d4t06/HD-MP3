import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";
import useSongItemAction from "../_hooks/useSongItemAction";
import { ComponentProps } from "react";
import SongMenu from "@/modules/song-menu";

type Props = {
  className?: string;
  isLiked: boolean;
  song: Song;
  songVariant: ComponentProps<typeof SongMenu>["variant"];
  isSongActive?: boolean;
};

export default function HearBtn({
  isLiked,
  song,
  isSongActive,
  songVariant,
  className = "p-1.5",
}: Props) {
  const { action, loading } = useSongItemAction();

  const getMainClass = () => {
    switch (songVariant) {
      case "queue-song":
      case "recent-song":
        return "mr-1";
      default:
        return "";
    }
  };

  const likedClass = () => {
    if (isLiked)
      switch (songVariant) {
        case "queue-song":
        case "recent-song":
          return "";
        default:
          return "!block";
      }
    return "";
  };

  const likedHeartIconClass = () => {
    switch (songVariant) {
      case "queue-song":
      case "recent-song":
        return isSongActive ? "text-white" : "text-[--primary-cl]";
      default:
        return "text-[--primary-cl]";
    }
  };

  // define style
  const classes = {
    button: `hover:bg-[--a-5-cl] rounded-full`,
  };

  return (
    <button
      onClick={() => action({ variant: "like", song })}
      className={`${classes.button} ${getMainClass()} group-hover/main:block md:hidden ${className} ${likedClass()}`}
    >
      {loading ? (
        <ArrowPathIcon className="w-5 animate-spin" />
      ) : (
        <>
          {isLiked ? (
            <HeartIconSolid className={`w-5 ${likedHeartIconClass()}`} />
          ) : (
            <HeartIcon className="w-5" />
          )}
        </>
      )}
    </button>
  );
}
