import { initSongObject } from "@/utils/appHelpers";
import { Button, Empty, NotFound } from "..";
import { useEffect } from "react";
import useAddSong from "@/pages/dashboard/song/_hooks/useAddSong";
import Input from "../ui/Input";
import { useAddSongContext } from "@/store/dashboard/AddSongContext";
import AddSongFile from "./AddSongFile";
import SingerSelect from "./SingerSelect";
import { useTheme } from "@/store";
import { CheckIcon } from "@heroicons/react/20/solid";

type Add = {
	variant: "add";
	ownerEmail: string;
};

type Edit = {
	variant: "edit";
	song: Song;
};

type Props = Add | Edit;

const initSongData = (props: Props) => {
	switch (props.variant) {
		case "add":
			return initSongObject({
				owner_email: props.ownerEmail,
			});
		case "edit":
			const { id, ...rest } = props.song;
			return initSongObject(rest);
	}
};

export default function AddSongForm(props: Add | Edit) {
	const { setSongData, songData, songFile } = useAddSongContext();
	const { updateSongData } = useAddSong();

	const { theme } = useTheme();

	useEffect(() => {
		setSongData(initSongData(props));
	}, []);

	if (props.variant === "add" && !songFile) return <AddSongFile />;

	if (!songData) return <NotFound />;

	return (
		<div className="max-w-[800px] mx-auto">
			<div className="md:flex md:space-x-5">
				<div className="w-[200px] h-[200px]">
					<Empty />
				</div>

				<div className="space-y-3">
					<div className="space-y-1">
						<label>Song name</label>
						<Input
							value={songData.name}
							onChange={(e) => updateSongData({ name: e.target.value })}
						/>
					</div>

					<SingerSelect />
				</div>
			</div>

			<p className="text-center mt-5">
				<Button className={`${theme.content_bg}`}>
					<CheckIcon className="w-6" />
					<span>Ok</span>
				</Button>
			</p>
		</div>
	);
}
