import SongComment from "./SongComment";

export default function MobileSongComment() {
	return (
		<div className="h-[70vh] overflow-hidden text-white rounded-[16px_16px_0_0] relative p-3 flex flex-col">
			<div className="bg-opacity-[0.8] backdrop-blur-[15px] z-[-1] bg-[#1f1f1f] absolute inset-0"></div>

			<SongComment />
		</div>
	);
}
