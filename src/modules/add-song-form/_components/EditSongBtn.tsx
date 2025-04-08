import { Input, ModalHeader, ModalRef } from "@/components";
import { Button, DashboardModal } from "@/pages/dashboard/_components";
import { ContentWrapper } from "@/pages/dashboard/_components/ui/ModalWrapper";
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
				className="p-1.5 justify-center md:px-3"
				size={"clear"}
			>
				<PencilIcon className="w-6" />
				<span className="hidden md:block">Edit</span>
			</Button>

			<DashboardModal variant="animation" wrapped={false} ref={modalRef}>
				<ContentWrapper>
					<ModalHeader title="Edit song" close={() => modalRef.current?.close()} />

					<div className="space-y-2.5">
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
					</div>

					<p className="mt-6 text-right">
						<Button onClick={_updateSongData}>Ok</Button>
					</p>
				</ContentWrapper>
			</DashboardModal>
		</>
	);
}
