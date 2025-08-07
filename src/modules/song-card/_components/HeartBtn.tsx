import useSongItemAction from "@/modules/song-item/_hooks/useSongItemAction";
import { HeartIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
  isLiked: boolean;
  song: Song;
};

export default function HeartBtn({ isLiked, song }: Props) {
  const { action, loading } = useSongItemAction();

  return (
    <button className=" " onClick={() => action({ variant: "like", song })}>
      {loading ? (
        <ArrowPathIcon className=" animate-spin" />
      ) : (
        <HeartIcon className={isLiked ? "text-[--primary-cl]" : ""} />
      )}
    </button>
  );
}
