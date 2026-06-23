import { ArrowPathIcon } from "@heroicons/react/24/outline";
import usePlaylistAction from "../_hooks/usePlaylistAction";
import { Button } from "@/components";

type Props = {
  className?: string;
  isLiked: boolean;
  playlist: Playlist;
};

export default function HearBtn({
  isLiked,
  playlist,
  className = "",
}: Props) {
  const { action, isFetching } = usePlaylistAction();

  return (
    <Button
      size={"clear"}
      onClick={() => action({ variant: "like", playlist })}
      className={`${className}`}
    >
      {isFetching ? (
        <ArrowPathIcon className="w-5 animate-spin" />
      ) : (
        <>
          {isLiked ? (
            <img src="./icons/heart.png" className="w-6" />
          ) : (
            <img src="./icons/grey_heart.png" className="w-6" />
          )}
        </>
      )}
    </Button>
  );
}
