import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import ModalHeader from "./ModalHeader";
import { ThemeType, User } from "../../types";
import { Button } from "..";
import usePlaylistActions from "../../hooks/usePlaylistActions";
import { useSongsStore, useToast } from "../../store";

type Props = {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  theme: ThemeType & { alpha: string };
  admin?: boolean;
  userInfo?: User;
  cb?: () => void;
};
export default function AddPlaylist({ setIsOpenModal, theme, admin, cb }: Props) {
  const [playlistName, setPlayListName] = useState<string>("");
  const { addPlaylist, loading } = usePlaylistActions({ admin });
  const { adminPlaylists, userPlaylists } = useSongsStore();
  const { setErrorToast, setSuccessToast } = useToast();
  const [error, setError] = useState(false);

  const handleAddPlaylist = async (e: FormEvent) => {
    e.preventDefault();
    if (error) return;

    const targetPlaylists = admin ? adminPlaylists : userPlaylists;
    const isDuplicate = targetPlaylists.find((p) => p.name === playlistName);
    if (isDuplicate) {
      setErrorToast({ message: "Playlist name already use" });
      setError(true);
      return;
    }

    try {
      await addPlaylist(playlistName);

      setSuccessToast({ message: `'${playlistName}' created` });
    } catch (error) {
      console.log("error");
      setErrorToast({ message: "Error when add playlist" });
    } finally {
      console.log("run finally");

      setIsOpenModal(false);
    }
  };


  useEffect(() => {
    if (playlistName.trim()) setError(false);
  }, [playlistName])

  return (
    <div className="w-[300px] max-w-[calc(100vw-40px)]:">
      <ModalHeader setIsOpenModal={setIsOpenModal} title="Add playlist" />
      <form action="" onSubmit={handleAddPlaylist}>
        <input
          className={`bg-${theme.alpha} ${
            error ? "border border-red-500" : ""
          } px-[20px] rounded-full outline-none mt-[10px] text-[16px]  h-[35px] w-full`}
          type="text"
          placeholder="name..."
          value={playlistName}
          onChange={(e) => setPlayListName(e.target.value)}
        />

        <p className="text-right mt-[20px]">
          <Button
            isLoading={loading}
            variant={"primary"}
            className={`${theme.content_bg} rounded-full ${
              error ? "opacity-[.6] pointer-events-none" : ""
            }`}
          >
            Save
          </Button>
        </p>
      </form>
    </div>
  );
}
