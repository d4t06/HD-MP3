import { useState } from "react";
import { useAuthContext, useToastContext } from "@/stores";
import { myUpdateDoc } from "@/services/firebaseService";
// import { initPlaylistObject } from "@/utils/factory";
// import { getDoc } from "firebase/firestore";

export default function useAddSongToPlaylist() {
  // stores
  const { user } = useAuthContext();
  // const { playlists, setPlaylists } = useSongContext();

  // state
  const [isFetching, setIsFetching] = useState(false);

  const { setErrorToast, setSuccessToast } = useToastContext();

  type AddToPlaylist = {
    variant: "exist";
    song: Song;
    playlist: Playlist;
  };

  type CreatePlaylist = {
    variant: "create";
    name: string;
    song: Song;
  };

  const addToPlaylist = async ({ song, ...props }: AddToPlaylist | CreatePlaylist) => {
    try {
      if (!user) throw new Error("user not found");

      setIsFetching(true);

      switch (props.variant) {
        case "exist": {
          const { playlist } = props;

          setIsFetching(true);

          const newSongIds = [...playlist.song_ids, song.id];

          await myUpdateDoc({
            collectionName: "Lyrics",
            id: playlist.id,
            data: { song_ids: newSongIds } as Partial<Playlist>,
            msg: ">>> api: update playlist doc",
          });

          setSuccessToast(`Song added`);

          break;
        }
        // case "create": {
        //   const { name } = props;

        //   const newPlaylist = initPlaylistObject({
        //     name: name,
        //     song_ids: [song.id],
        //     owner_email: user.email,
        //   });

        //   const docRef = await myAddDoc({
        //     collectionName: "Playlists",
        //     data: newPlaylist,
        //     msg: ">>> api: set playlist doc",
        //   });

        //   const newPlaylistRef = await getDoc(docRef);

        //   const newPlaylists = [
        //     ...playlists,
        //     { ...newPlaylistRef.data(), id: docRef.id } as Playlist,
        //   ];

        //   setPlaylists(newPlaylists);
        //   setSuccessToast(`Playlist created`);

        //   break;
        // }
      }
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, addToPlaylist };
}
