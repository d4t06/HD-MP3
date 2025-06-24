import { ButtonCtaFrame } from "@/pages/dashboard/_components";
import EditSongBtn from "./EditSongBtn";
import UploadImageBtn from "./UploadImageBtn";

type Props = {
	isEdit: boolean;
};

export default function EditSongButtons({ isEdit }: Props) {
	return (
		<>
			<ButtonCtaFrame>
				<UploadImageBtn />
				{isEdit && <EditSongBtn />}
			</ButtonCtaFrame>
		</>
	);
}
