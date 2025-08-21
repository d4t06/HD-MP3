import { ChangeEvent, RefObject, useRef } from "react";
import { ModalContentWrapper, ModalHeader, ModalRef } from ".";
import { useReadCopiedImage } from "@/hooks";
import { FolderOpenIcon } from "@heroicons/react/24/outline";
import { Button } from "..";

type Props = {
	title?: string;
	modalRef: RefObject<ModalRef>;
	setImageFile: (f: File) => void;
};

export default function ChooseImageModal({
	title,
	modalRef,
	setImageFile,
}: Props) {
	
	useReadCopiedImage({ modalRef, setImageFileFromParent: setImageFile });

	const labelRef = useRef<HTMLLabelElement>(null);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			setImageFile(e.target.files[0]);
			modalRef.current?.close();
		}
	};

	return (
		<ModalContentWrapper>
			<input
				onChange={handleInputChange}
				type="file"
				value={""}
				multiple
				accept="image/png, image/jpeg"
				id="image_upload"
				className="hidden"
			/>

			<label ref={labelRef} htmlFor="image_upload"></label>

			<ModalHeader
				title={title || "Choose image"}
				closeModal={() => modalRef.current?.close()}
			/>

			<p className="text-center">
				<Button onClick={() => labelRef.current?.click()} color="primary">
					<FolderOpenIcon className="w-6" />
					<span>Choose from computer</span>
				</Button>
			</p>
		</ModalContentWrapper>
	);
}
