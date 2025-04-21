import BackBtn from "@/components/BackBtn";
import useGetUser from "./hooks/useGetUser";
import { Center, PlaylistList } from "@/components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function UserPage() {
	const { playlists, isFetching, user } = useGetUser();

	return (
		<>
			<div className="mb-5">
				<BackBtn />
			</div>

			<div className="space-y-5">
				{isFetching ? (
					<Center>
						<ArrowPathIcon className="w-6 animate-spin" />
					</Center>
				) : (
					<div>{user?.display_name}</div>
				)}

				<PlaylistList loading={isFetching} playlists={playlists} />
			</div>
		</>
	);
}
