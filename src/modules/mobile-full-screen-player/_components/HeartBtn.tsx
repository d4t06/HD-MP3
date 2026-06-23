import useSongItemAction from "@/modules/song-item/_hooks/useSongItemAction";
import { getClasses } from "@/utils/appHelpers";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
  isLiked: boolean;
  song: Song;
};

export default function HearBtn({ isLiked, song }: Props) {
  const { action, loading } = useSongItemAction();

  return (
    <button
      onClick={() => action({ variant: "like", song })}
      className={`${getClasses(isLiked, "active")} p-2`}
    >
      {loading ? (
        <ArrowPathIcon className="w-6 animate-spin" />
      ) : (
        <>
          {isLiked ? (
            <img src="./icons/heart.png" className={`w-6`} />
          ) : (
            <img src="./icons/white_heart.png" className="w-6" />
          )}
        </>
      )}
    </button>
  );
}
