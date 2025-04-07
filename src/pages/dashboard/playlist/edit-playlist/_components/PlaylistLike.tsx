import { Input, ModalRef } from "@/components";
import { PlaylistModalVariantProps } from "@/modules/add-playlist-form";
import useAddPlaylistForm from "@/modules/add-playlist-form/_hooks/useAddPlaylistForm";
import { Button, DashboardModal } from "@/pages/dashboard/_components";
import { usePlaylistContext } from "@/stores/dashboard/PlaylistContext";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import useDashboardPlaylistActions from "../_hooks/usePlaylistAction";
import { ContentWrapper } from "@/pages/dashboard/_components/ui/ModalWrapper";

export default function PlaylistLike(props: PlaylistModalVariantProps) {
	const { playlist } = usePlaylistContext();
	const { updatePlaylistData, playlistData, isValidToSubmit } = useAddPlaylistForm(props);

	const { action, isFetching } = useDashboardPlaylistActions();

	const modalRef = useRef<ModalRef>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleAddPlaylist = async () => {
		if (!playlistData || !isValidToSubmit) return;

		//  it must be change something here!!
		await action({
			variant: "edit-playlist",
			playlist: playlistData,
		});

		modalRef.current?.close();
	};

	if (!playlist) return;

	return (
		<>
			<div className="flex space-x-1">
				<p>{playlist.like} likes</p>

				<button onClick={() => modalRef.current?.open()}>
					<PencilIcon className="w-5" />
				</button>
			</div>

			<DashboardModal wrapped={false} variant="animation" ref={modalRef}>
				<ContentWrapper>
					<div>
						<label htmlFor="like">Like</label>
						<Input
							id="like"
							ref={inputRef}
							type="text"
							placeholder=""
							value={playlistData?.like ? playlistData.like : 0}
							onChange={(e) =>
								!isNaN(+e.target.value)
									? updatePlaylistData({ like: +e.target.value })
									: {}
							}
						/>
					</div>

					<p className="text-right mt-5 md:mt-0">
						<Button
							loading={isFetching}
							color="primary"
							onClick={handleAddPlaylist}
							disabled={!isValidToSubmit}
							className={`font-playwriteCU rounded-full`}
						>
							Save
						</Button>
					</p>
				</ContentWrapper>
			</DashboardModal>
		</>
	);
}
