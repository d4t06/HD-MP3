import { optimizeAndGetHashImage } from "@/services/appService";
import { deleteFile, myAddDoc, myUpdateDoc } from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { convertToEn } from "@/utils/appHelpers";
import { getDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

type Props = {
  setIsFetching: (v: boolean) => void;
};

export default function useAddPlaylist(props?: Props) {
  const { setOwnPlaylists } = useSongContext();
  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const _setIsFetching = props?.setIsFetching || setIsFetching;

  type Add = {
    variant: "add";
    playlist: PlaylistSchema;
    imageFile?: File;
  };

  type Edit = {
    variant: "edit";
    playlist: Partial<PlaylistSchema>;
    imageFile?: File;
    id: string;
  };

  const addPlaylist = async (
    { imageFile, ...props }: Add | Edit,
    opts?: { push?: boolean },
  ) => {
    try {
      _setIsFetching(true);

      if (imageFile) {
        if (props.playlist.image_file_id) {
          deleteFile({ fileId: props.playlist.image_file_id });
        }

        const imageData = await optimizeAndGetHashImage({ imageFile });
        Object.assign(props.playlist, imageData);
      }

      switch (props.variant) {
        case "add":
          const newPlaylistData: PlaylistSchema = {
            ...props.playlist,
            name: props.playlist.name.trim(),
            meta: convertToEn(props.playlist.name.trim()).split(" "),
          };

          const docRef = await myAddDoc({
            collectionName: "Playlists",
            data: newPlaylistData,
            msg: ">>> Add playlist doc",
          });

          const newDocRef = await getDoc(docRef);

          const newPlaylist: Playlist = {
            ...(newDocRef.data() as PlaylistSchema),
            id: newDocRef.id,
          };

          const { push = true } = opts || {};

          if (push) {
            setOwnPlaylists((prev) => [...prev, newPlaylist]);
          }

          return newPlaylist;

        case "edit": {
          const newPlaylistData: Partial<PlaylistSchema> = {
            ...props.playlist,
            name: props.playlist.name?.trim(),
            meta: convertToEn(props.playlist.name?.trim() || "").split(" "),
            updated_at: serverTimestamp(),
          };

          await myUpdateDoc({
            collectionName: "Playlists",
            data: newPlaylistData,
            id: props.id,
            msg: ">>> Update playlist doc",
          });

          return true;
        }
      }

      // const { push = true } = opts || {};

      // if (push) setPlaylists((prev) => [newPlaylist, ...prev]);

      // setSuccessToast(`Playlist created`);
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      _setIsFetching(false);
    }
  };

  return { isFetching, addPlaylist };
}
