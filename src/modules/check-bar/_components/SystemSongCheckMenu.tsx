import { ModalRef } from "@/components";
import { useRef } from "react";
import { CheckBarMenuContent } from "./CheckBarMenuBtn";
import AddToPlaylistMenuItem, {
	AddSelectSongsToPlaylistMenuModal,
} from "./AddToPlaylistMenuItem";

export default function SystemSongCheckMenu() {
	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<CheckBarMenuContent>
				<AddToPlaylistMenuItem modalRef={modalRef} />
			</CheckBarMenuContent>

			<AddSelectSongsToPlaylistMenuModal modalRef={modalRef} />
		</>
	);
}
