import { Input, Modal, ModalHeader, ModalRef } from "@/components";
import { Button, ModalWrapper } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

export default function EditSongBtn() {
	const modalRef = useRef<ModalRef>(null);

	const { songData, updateSongData } = useAddSongContext();

	const [localSongData, setLocalSongData] = useState<Partial<Song>>({
		name: songData?.name,
		like: songData?.like,
	});

	const updateLocalSongData = (data: Partial<Song>) => {
		setLocalSongData((prev) => ({ ...prev, ...data }));
	};

	const _updateSongData = () => {
		updateSongData(localSongData);
		modalRef.current?.close();
	};

	return (
		<>
			<Button
				onClick={() => modalRef.current?.open()}
				className="h-[36px] justify-center w-[36px]"
				size={"clear"}
			>
				<PencilIcon className="w-5" />
			</Button>

			<Modal variant="animation" wrapped={false} ref={modalRef}>
				<ModalWrapper>
					<ModalHeader title="Edit song" close={() => modalRef.current?.close()} />

					<div>
						<p>Name:</p>
						<Input
							className="bg-black/10"
							value={localSongData?.name}
							onChange={(e) => updateLocalSongData({ name: e.target.value })}
						/>
					</div>

					<div className="t">
						<p>Like:</p>
						<Input
							className="bg-black/10"
							value={localSongData?.like}
							onChange={(e) =>
								!isNaN(+e.target.value)
									? updateLocalSongData({ like: +e.target.value })
									: {}
							}
						/>
					</div>

					<p className="mt-5 text-right">
						<Button onClick={_updateSongData}>Ok</Button>
					</p>
				</ModalWrapper>
			</Modal>
		</>
	);
}
