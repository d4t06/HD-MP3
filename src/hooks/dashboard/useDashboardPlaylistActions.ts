import { useState } from "react";
import { useSongContext, useToast } from "@/store";
import { generateId, initPlaylistObject } from "@/utils/appHelpers";
import { myDeleteDoc, mySetDoc } from "@/services/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addSongsToPlaylist,
  selectCurrentPlaylist,
  setPlaylistSong,
  updateCurrentPlaylist,
} from "@/store/currentPlaylistSlice";

type AddPlaylist = {
  variant: "add-playlist";
  name: string;
};

type DeletePlaylist = {
  variant: "delete-playlist";
};

type AddSongs = {
  variant: "add-songs";
  songs: Song[];
};

type EditPlaylist = {
  variant: "edit-playlist";
  name: string;
};

type RemoveSong = {
  variant: "remove-song";
  song: Song;
};

type UpdateImage = {
  variant: "update-image";
  song: Song;
};

export type PlaylistActionProps =
  | AddPlaylist
  | DeletePlaylist
  | AddSongs
  | EditPlaylist
  | RemoveSong
  | UpdateImage;

export default function useDashboardPlaylistActions() {
  // store
  const dispatch = useDispatch();
  const { playlists, setPlaylists } = useSongContext();
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const navigate = useNavigate();
  const { setErrorToast, setSuccessToast } = useToast();

  const actions = async (props: PlaylistActionProps) => {
    try {
      switch (props.variant) {
        case "add-playlist": {
          if (!props.name) throw new Error("playlist name invalid");

          setIsFetching(true);

          const playlistId = generateId(props.name) + "_admin";

          const addedPlaylist = initPlaylistObject({
            id: playlistId,
            by: "admin",
            name: props.name,
          });

          const newPlaylists = [...playlists, addedPlaylist];

          await mySetDoc({
            collection: "playlist",
            data: addedPlaylist,
            id: playlistId,
            msg: ">>> api: set playlist doc",
          });

          setPlaylists(newPlaylists);
          setSuccessToast(`Playlist created`);

          break;
        }
        case "delete-playlist": {
          if (!currentPlaylist) throw new Error("currentPlaylist not found");
          setIsFetching(true);

          // >>> api
          await myDeleteDoc({
            collection: "playlist",
            id: currentPlaylist.id,
            msg: ">>> api: delete playlist doc",
          });

          setIsFetching(false);
          navigate("/dashboard/playlists");

          break;
        }
        case "add-songs": {
          if (!currentPlaylist) throw new Error("currentPlaylist not found");

          setIsFetching(true);

          const newSongIds = [
            ...playlistSongs.map((s) => s.id),
            ...props.songs.map((s) => s.id),
          ];

          await mySetDoc({
            collection: "playlist",
            id: currentPlaylist?.id,
            data: { song_ids: newSongIds } as Partial<Playlist>,
            msg: ">>> api: update playlist doc",
          });

          dispatch(addSongsToPlaylist(props.songs));
          setSuccessToast(`Songs added`);

          break;
        }
        case "edit-playlist": {
          if (!currentPlaylist) throw new Error("currentPlaylist not found");

          setIsFetching(true);

          await mySetDoc({
            collection: "playlist",
            data: { name: props.name },
            id: currentPlaylist.id,
            msg: ">>> api: set playlist doc",
          });

          dispatch(updateCurrentPlaylist({ name: props.name }));
          setSuccessToast(`Playlist edited`);

          break;
        }
        case "remove-song": {
          if (!currentPlaylist) throw new Error("currentPlaylist not found");
          setIsFetching(true);

          const newPlaylistSongs = playlistSongs.filter((s) => s.id !== props.song.id);

          await mySetDoc({
            collection: "playlist",
            id: currentPlaylist.id,
            data: { song_ids: newPlaylistSongs.map((s) => s.id) } as Partial<Playlist>,
            msg: ">>> api: update playlist doc",
          });

          dispatch(setPlaylistSong(newPlaylistSongs));
          setSuccessToast(`'${props.song.name}' removed`);

          break;
        }
        case "update-image": {
          if (!currentPlaylist) throw new Error("currentPlaylist not found");
          setIsFetching(true);

          const payload = {
            image_url: props.song.image_url,
            blurhash_encode: props.song.blurhash_encode,
          } as Partial<Playlist>;

          await mySetDoc({
            collection: "playlist",
            data: payload,
            id: currentPlaylist.id,
            msg: ">>> api: set playlist doc",
          });

          dispatch(updateCurrentPlaylist(payload));
          setSuccessToast(`Playlist edited`);

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
      setErrorToast("");
    } finally {
      setIsFetching(false);
    }
  };

  return {
    isFetching,
    actions,
    currentPlaylist,
  };
}
