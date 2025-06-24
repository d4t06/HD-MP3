import { MinusIcon } from "@heroicons/react/24/outline";
import useRemoveSongFromPlaylist from "../_hooks/useRemoveSongFromPlaylist";

type Props = {
  song: Song;
};
export default function RemoveSongFromPlaylistMenuItem({ song }: Props) {
  const { removeSongFromPlaylist } = useRemoveSongFromPlaylist();

  return (
    <button onClick={() => removeSongFromPlaylist({ song })}>
      <MinusIcon />
      <span>Remove</span>
    </button>
  );
}
