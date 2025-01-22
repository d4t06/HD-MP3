import Title from "@/components/ui/Title";
import useDashboardSong from "./_hooks/useDashboardSong";
import Table from "@/components/ui/Table";
import {
	ArrowPathIcon,
	ArrowUpTrayIcon,
	MagnifyingGlassIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, Tabs } from "@/components";
import { useTheme } from "@/store";
import DashboardSongItem from "@/components/dashboard/DashboardSongItem";

export default function DashboardSong() {
	const { theme } = useTheme();

	const { handleSubmit, isFetching, setValue, songs, value, setTab, tab } =
		useDashboardSong();

	const classes = {
		formGroup: ` flex ${theme.side_bar_bg} rounded-full overflow-hidden`,
		input: "outline-none bg-transparent px-3 py-1 h-full",
	};

	return (
		<>
			<Title title="Songs" />

			<div className="flex justify-between mt-3">
				<form action="#" onSubmit={handleSubmit} className={`flex`}>
					<div className={`${classes.formGroup}`}>
						<input
							value={value}
							placeholder="..."
							onChange={(e) => setValue(e.target.value.trim())}
							className={`${classes.input}`}
							type="text"
						/>
						<button
							type="button"
							onClick={() => setValue("")}
							className={`pr-2 ${
								!value ? "opacity-0 cursor-none" : "opacity-[1] cursor-pointer"
							}`}
						>
							<XMarkIcon className="w-5" />
						</button>
					</div>

					<Button
						type="submit"
						className={`${theme.content_bg} ml-3 w-[32px] justify-center h-full rounded-full `}
						size={"clear"}
					>
						<MagnifyingGlassIcon className="w-5" />
					</Button>
				</form>

				<label
					htmlFor="song-upload"
					className={`px-3 items-center cursor-pointer space-x-1 inline-flex ${theme.content_bg} rounded-full`}
				>
					<ArrowUpTrayIcon className="w-6" />
					<div className="hidden md:block">Upload</div>
				</label>
			</div>

			<Tabs
				className={`mt-5 ${tab === "All" ? "pointer-events-none" : ""}`}
				tabs={["All", "Result"]}
				render={(t) => t}
				activeTab={tab}
				setActiveTab={setTab}
			/>

			<div className="mt-3">
				{isFetching && (
					<p className="text-center w-full">
						<ArrowPathIcon className="w-6 animate-spin inline-block" />
					</p>
				)}

				{!isFetching && (
					<div className={`rounded-md overflow-hidden ${theme.side_bar_bg}`}>
						<Table
							className="[&_td]:text-sm [&_tr]:border-b [&_tr]:border-black/10 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2"
							colList={["Name", "Singer", "Genre", "Time", ""]}
						>
							{songs.length ? (
								songs.map((s, i) => (
									<DashboardSongItem className={`hover:bg-${theme.alpha}`} variant="songs" key={i} song={s} />
								))
							) : (
								<tr>
									<td colSpan={5} className="text-center">
										...
									</td>
								</tr>
							)}
						</Table>
					</div>
				)}
			</div>
		</>
	);
}
