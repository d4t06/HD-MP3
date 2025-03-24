import { usePopoverContext } from "@/components/MyPopup";
import { useSongQueueAction } from "@/hooks";
import { PlusIcon } from "@heroicons/react/24/outline";

type Props = {
	song: Song;
};

export default function AddToQueueMenuItem({ song }: Props) {
	const { close } = usePopoverContext();

	const { action } = useSongQueueAction();

	const handleAddSongToQueue = () => {
		action({
			variant: "add",
			songs: [song],
		});
		close();
	};

	return (
		<button onClick={handleAddSongToQueue}>
			<PlusIcon className="w-5" />
			<span>Add to queue</span>
		</button>
	);
}
