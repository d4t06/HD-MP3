import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CheckBarMenuContent } from "./CheckBarMenuBtn";
import AddToPlaylistMenuItem, {
	AddSelectSongsToPlaylistMenuModal,
} from "./AddToPlaylistMenuItem";
import { useRef } from "react";
import { ModalRef } from "@/components";

export default function FavoriteSongMenu() {
	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<CheckBarMenuContent>
				<AddToPlaylistMenuItem modalRef={modalRef} />

				<button>
					<MinusIcon className="w-5" />
					<span>Remove from favorite</span>
				</button>
			</CheckBarMenuContent>

			<AddSelectSongsToPlaylistMenuModal modalRef={modalRef} />
		</>
	);
}
