import FavoriteSongList from "./FavoriteSong";
import UploadedSongList from "./UploadedSong";
import { Tab, Title } from "@/components";
import { usePersistState } from "@/hooks";

const tabs = ["Favorite", "Uploaded"] as const;
type Tab = (typeof tabs)[number];
export default function SongSection() {
	const [tab, setTab] = usePersistState<Tab>("last-song-tab", "Favorite");

	return (
		<>
			<div>
				<Title title="Songs" />

				<div className="flex space-x-2 my-3">
					<Tab render={(t) => t} setTab={setTab} tab={tab} tabs={tabs} />
				</div>

				{tab === "Favorite" ? <FavoriteSongList /> : <UploadedSongList />}
			</div>
		</>
	);
}
