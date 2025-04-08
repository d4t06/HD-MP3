import useSongItemAction from "@/modules/song-item/_hooks/useSongItemAction";
import { getClasses } from "@/utils/appHelpers";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";

type Props = {
  isLiked: boolean;
  song: Song;
};

export default function HearBtn({ isLiked, song }: Props) {
  const { action, loading } = useSongItemAction();

  return (
    <div>
      <button
        onClick={() => action({ variant: "like", song })}
        className={`${getClasses(isLiked, "active")}`}
      >
        {loading ? (
          <ArrowPathIcon className="w-6 animate-spin" />
        ) : (
          <>
            {isLiked ? (
              <HeartIconSolid className={`w-6`} />
            ) : (
              <HeartIcon className="w-6" />
            )}
          </>
        )}
      </button>
      <span>{isLiked ? "Dislike" : "Like"}</span>
    </div>
  );
}
