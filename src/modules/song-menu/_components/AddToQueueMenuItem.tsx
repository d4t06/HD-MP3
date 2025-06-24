import { useSongQueueAction } from "@/hooks";
import { PlusIcon } from "@heroicons/react/24/outline";

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
      <PlusIcon />
      <span>Add to queue</span>
    </button>
  );
}
