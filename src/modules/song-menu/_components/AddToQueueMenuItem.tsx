import { useSongQueueAction } from "@/hooks";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  song: Song;
};

export default function AddToQueueMenuItem({ song }: Props) {
  const { action } = useSongQueueAction();

  const handleAddSongToQueue = () => {
    action({
      variant: "add",
      songs: [song],
    });
  };

  return (
    <button onClick={handleAddSongToQueue}>
      <PlusCircleIcon />
      <span>Add to queue</span>
    </button>
  );
}
