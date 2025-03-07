import Title from "@/components/ui/Title";
import AddSongForm from "@/modules/add-song-form";
import { useAuthContext } from "@/stores";

export default function AddSongPage() {
  const { user } = useAuthContext();

  if (!user) return;

  return (
    <>
      <Title title="Add Song" />
      <AddSongForm
        distributor={user.display_name}
        ownerEmail={user.email}
        variant="add"
      />
    </>
  );
}
