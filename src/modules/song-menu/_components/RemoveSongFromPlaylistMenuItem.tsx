import usePlaylistAction from "@/modules/playlist-info/_hooks/usePlaylistAction";
import { ArrowPathIcon, MinusIcon } from "@heroicons/react/24/outline";

type Props = {
  song: Song;
};
export default function RemoveSongFromPlaylistMenuItem({ song }: Props) {
  const { isFetching } = usePlaylistAction();

  const handleRemoveSong = async () => {
    console.log(song);
  };

  return (
    <button onClick={handleRemoveSong}>
      {!isFetching ? (
        <>
          {" "}
          <MinusIcon className="w-5" />
          <span>Edit</span>
        </>
      ) : (
        <ArrowPathIcon className="w-5" />
      )}
    </button>
  );
}
