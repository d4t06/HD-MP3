import { ButtonCtaFrame } from "@/pages/dashboard/_components";
import SongCta from "./SongCta";
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
				{isEdit && <SongCta />}
				{!isEdit && <UploadSongBtn title="Change song file" />}
			</ButtonCtaFrame>
		</>
	);
}
