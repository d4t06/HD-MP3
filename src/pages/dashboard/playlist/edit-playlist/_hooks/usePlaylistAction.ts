import { useState } from "react";
import { useAuthContext, useToastContext } from "@/stores";
import {
  deleteFile,
  //   myAddDoc,
  myDeleteDoc,
  myUpdateDoc,
} from "@/services/firebaseService";
import { useNavigate } from "react-router-dom";
// import { getDoc } from "firebase/firestore";
import { usePlaylistContext } from "@/stores/dashboard/PlaylistContext";
import { optimizeAndGetHashImage } from "@/services/appService";
import { setCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";

// type AddPlaylist = {
//   variant: "add-playlist";
//   playlist: PlaylistSchema;
// };

type DeletePlaylist = {
  variant: "delete-playlist";
};

type AddSongs = {
  variant: "add-songs";
  songs: Song[];
};

type EditPlaylist = {
  variant: "edit-playlist";
  playlist: PlaylistSchema;
  imageFile?: File;
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
  //   | AddPlaylist
  DeletePlaylist | AddSongs | EditPlaylist | RemoveSong | UpdateImage;

export default function useDashboardPlaylistActions() {
  // stores
  const { user } = useAuthContext();
  //   const { setPlaylists } = useSongContext();
  const { playlist, songs, setSongs, updatePlaylistData } = usePlaylistContext();

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const navigate = useNavigate();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const action = async (props: PlaylistActionProps) => {
    try {
      if (!user) return;

      switch (props.variant) {
        case "delete-playlist": {
          if (!playlist) throw new Error("playlist not found");
          setIsFetching(true);

          // >>> api
          await myDeleteDoc({
            collectionName: "Playlists",
            id: playlist.id,
            msg: ">>> api: delete playlist doc",
          });

          if (playlist.image_file_path)
            await deleteFile({ filePath: playlist.image_file_path });

          setIsFetching(false);
          navigate("/dashboard/playlist");

          break;
        }
        case "add-songs": {
          if (!playlist) throw new Error("playlist not found");

          setIsFetching(true);

          const newPlaylistSongs = [...songs, ...props.songs];
          const newSongIds = newPlaylistSongs.map((s) => s.id);

          const playlistData: Partial<Playlist> = {
            song_ids: newSongIds,
            singer_map: newPlaylistSongs.reduce(
              (prev, s) => ({
                ...prev,
                ...s.singers.reduce(
                  (prev, singer) => ({ ...prev, [singer.id]: true }),
                  {} as Playlist["singer_map"]
                ),
              }),
              {} as Playlist["singer_map"]
            ),
          };

          if (playlist.singers.length < 5) {
            const newSingers: Singer[] = [...playlist.singers];

            for (const currentSong of props.songs) {
              if (newSingers.length == 5) break;

              currentSong.singers.forEach((s) => {
                const foundedSinger = !!newSingers.find(
                  (_s) => _s.id === s.id
                );

                if (!foundedSinger) newSingers.push(s);
              });
            }

            const data: Partial<Playlist> = {
              singers: [...playlist.singers, ...newSingers],
            };

            Object.assign(playlistData, data);
          }

          await myUpdateDoc({
            collectionName: "Playlists",
            id: playlist.id,
            data: playlistData,
            msg: ">>> api: update playlist doc",
          });

          updatePlaylistData(playlistData);

          setSongs(newPlaylistSongs);
          setSuccessToast(`Songs added`);

          break;
        }
        case "edit-playlist": {
          if (!playlist) return;
          setIsFetching(true);

          const newPlaylist = { ...playlist, ...props.playlist };

          if (props.imageFile) {
            const imageData = await optimizeAndGetHashImage(props.imageFile);

            if (playlist.image_file_path)
              await deleteFile({ filePath: playlist.image_file_path });

            Object.assign(newPlaylist, imageData);
          }

          await myUpdateDoc({
            collectionName: "Playlists",
            data: newPlaylist,
            id: playlist.id,
            msg: ">>> api: set playlist doc",
          });

          updatePlaylistData(newPlaylist);
          setSuccessToast(`Playlist edited`);

          break;
        }
        case "remove-song": {
          if (!playlist) throw new Error("playlist not found");
          setIsFetching(true);

          const newPlaylistSongs = songs.filter((s) => s.id !== props.song.id);

          const songsData: Partial<Playlist> = {
            song_ids: newPlaylistSongs.map((s) => s.id),
          };

          await myUpdateDoc({
            collectionName: "Playlists",
            id: playlist.id,
            data: songsData,
            msg: ">>> api: update playlist doc",
          });

          setSongs(newPlaylistSongs);
          setSuccessToast(`'${props.song.name}' removed`);

          break;
        }
        case "update-image": {
          if (!playlist) throw new Error("playlist not found");
          setIsFetching(true);

          const imageData: Partial<PlaylistSchema> = {
            image_url: props.song.image_url,
            blurhash_encode: props.song.blurhash_encode,
            image_file_path: "",
          };

          //  delete old image file
          if (playlist.image_file_path)
            await deleteFile({ filePath: playlist.image_file_path });

          await myUpdateDoc({
            collectionName: "Playlists",
            data: imageData,
            id: playlist.id,
            msg: ">>> api: set playlist doc",
          });

          updatePlaylistData(imageData);

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
    action,
    playlist,
  };
}
