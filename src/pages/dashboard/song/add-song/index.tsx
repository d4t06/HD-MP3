import Title from "@/components/ui/Title";
import AddSongForm from "@/modules/add-song-form";
import { useAuthContext } from "@/stores";

export default function AddSongPage() {
  const { user } = useAuthContext();

  if (!user) return;

  return (
    <div className="pb-[46px]">
      <Title className="mb-5" title="Add Song" />

      <AddSongForm
        distributor={user.display_name}
        ownerEmail={user.email}
        variant="add"
      />
    </div>
  );
}
