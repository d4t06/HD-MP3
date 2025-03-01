import { NotFound } from "@/components";
import AddSongForm from "@/components/dashboard/AddSongForm";
import Title from "@/components/ui/Title";
import { useAuthContext } from "@/stores";
import AddSongProvider from "@/stores/dashboard/AddSongContext";

export default function AddSongPage() {
	const { user } = useAuthContext();

	if (!user) return <NotFound />;

	return (
		<AddSongProvider>
			<Title title="Add song" />
			<AddSongForm ownerEmail={user.email} variant="add" />
		</AddSongProvider>
	);
}
