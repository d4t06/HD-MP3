import { Input, Modal, ModalRef } from "@/components";
import { useAddAlbumContext } from "@/modules/add-album-form/_components/AddAlbumContext";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import SingerSearchModal from "@/modules/add-song-form/_components/SingerSearchModal";
import { Button, Frame, ItemRightCtaFrame } from "@/pages/dashboard/_components";

export default function AlbumSingerSelect() {
	const { singer, setSinger, albumData, updateAlbumData } = useAddAlbumContext();

	const modalRef = useRef<ModalRef>(null);

	const handleChooseSinger = (s: Singer) => {
		setSinger(s);
		modalRef.current?.close();
	};

	if (!albumData) return;

	return (
		<>
			{/* <Frame className="space-y-2.5"> */}
				<div>
					<label className="label" htmlFor="name">
						Name
					</label>
					<Input
						type="text"
						placeholder="name..."
						id="name"
						className="text-[#333]"
						value={albumData.name}
						onChange={(e) => updateAlbumData({ name: e.target.value })}
					/>
				</div>

				<div className="flex items-center space-x-1.5">
					<p className="label">Singer</p>

					{singer ? (
						<ItemRightCtaFrame className="mt-0">
							<span>{singer.name}</span>

							<div>
								<button onClick={() => setSinger(undefined)}>
									<TrashIcon className="w-5" />
								</button>
							</div>
						</ItemRightCtaFrame>
					) : (
						<Button
							size={"clear"}
							className="p-1.5"
							onClick={() => modalRef.current?.open()}
						>
							<PlusIcon className="w-5" />
						</Button>
					)}
				</div>
			{/* </Frame> */}

			<Modal variant="animation" ref={modalRef}>
				<SingerSearchModal
					choose={handleChooseSinger}
					closeModal={() => modalRef.current?.close()}
				/>
			</Modal>
		</>
	);
}
