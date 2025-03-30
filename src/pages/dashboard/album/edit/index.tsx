import AddAlbumForm from "@/modules/add-album-form";
import useGetAlbum from "./_hooks/useGetAlbum";
import { Center, Title } from "@/components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function DashboardEditAlbumPage() {
	const { album, isFetching } = useGetAlbum();

	console.log(album);

	if (isFetching)
		return (
			<Center>
				<ArrowPathIcon className="w-6 animate-spin" />
			</Center>
		);

	if (!album) return <></>;

	return (
		<>
			<Title title="Edit album" className="mb-3" />
			<AddAlbumForm variant="edit" album={album} />
		</>
	);
}
