import { NotFound } from "@/components";
import Title from "@/components/ui/Title";
import AddSongForm from "@/modules/add-song-form";
import { useAuthContext } from "@/stores";
import AddSongProvider from "@/stores/dashboard/AddSongContext";

export default function AddSongPage() {
	const { user } = useAuthContext();

	if (!user) return <NotFound />;

	return (
		<AddSongProvider>
			<Title title="Add Song" />
			<AddSongForm ownerEmail={user.email} variant="add" />
		</AddSongProvider>
	);
}
