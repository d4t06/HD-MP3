import { NotFound } from "@/components";
import AddSongForm from "@/components/dashboard/AddSongForm";
import Title from "@/components/ui/Title";
import { useAuthStore } from "@/store";
import AddSongProvider from "@/store/dashboard/AddSongContext";

export default function AddSongPage() {
	const { user } = useAuthStore();

	if (!user) return <NotFound />;

	return (
		<AddSongProvider>
			<Title title="Add song" />
			<AddSongForm ownerEmail={user.email} variant="add" />
		</AddSongProvider>
	);
}
