import Title from "@/components/ui/Title";
import AddSongForm from "@/modules/add-song-form";
import useGetSong from "../../_hooks/ueGetSong";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Center } from "@/components";
import { Loading } from "../../_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";

export default function EditSongPage() {
  const { getSong, isFetching, song, ranEffect } = useGetSong();
  const { variant, setSong } = useAddSongContext();

  const params = useParams();

  useEffect(() => {
    if (!ranEffect.current) {
      variant.current = "edit";

      ranEffect.current = true;

      if (!params.songId) return;

      getSong(params.songId);
    }
  }, []);

  useEffect(() => {
    if (song) setSong(song);
  }, [song]);

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );
  if (!song) return <></>;

  return (
    <div className="pb-[46px]">
      <Title className="mb-5" title="Song Detail" />
      <AddSongForm song={song} variant="edit" />
    </div>
  );
}
