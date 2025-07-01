import { ButtonCtaFrame } from "@/pages/dashboard/_components";
import EditSongBtn from "./EditSongBtn";
import UploadImageBtn from "./UploadImageBtn";
import UploadSongBtn from "./UploadSongBtn";

type Props = {
	isEdit: boolean;
};

export default function EditSongButtons({ isEdit }: Props) {
	return (
		<>
			<ButtonCtaFrame className="[&_span]:text-sm">
				<UploadImageBtn />
				{isEdit && <EditSongBtn />}
				{!isEdit && <UploadSongBtn title="Change song file" />}
			</ButtonCtaFrame>
		</>
	);
}
