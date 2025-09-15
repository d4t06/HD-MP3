import { convertToEn } from "@/utils/appHelpers";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

type Props = {
	song: Song;
};

export default function DownloadSongMenuItem({ song }: Props) {
	const handleDownload = async () => {
		// const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
		// const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

		try {
			const res = await fetch(song.song_url);
			const blob = await res.blob();

			const tempUrl = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = tempUrl;
			link.download = `${convertToEn(song.name)}${song.song_url.slice(song.song_url.lastIndexOf("."), -1)}`;

			document.body.appendChild(link);
			link.click();

			// Clean up the temporary URL and element
			document.body.removeChild(link);
			URL.revokeObjectURL(tempUrl);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<button onClick={handleDownload}>
			<ArrowDownTrayIcon />
			<span>Download</span>
		</button>
	);
}
