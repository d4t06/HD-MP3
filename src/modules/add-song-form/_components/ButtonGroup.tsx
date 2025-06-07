import EditSongBtn from "./EditSongBtn";
import UploadImageBtn from "./UploadImageBtn";

type Props = {
	isEdit: boolean;
};

export default function EditSongButtons({ isEdit }: Props) {
	return (
		<>
			<div className="-mt-2 -ml-2 flex flex-wrap w-full [&_button]:mt-2 [&_button]:ml-2">
				<UploadImageBtn />
				{isEdit && <EditSongBtn />}
			</div>
		</>
	);
}
