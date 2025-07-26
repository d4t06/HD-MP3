import { useState } from "react";
import { useAuthContext, useToastContext } from "@/stores";
import {
  commentCollectionRef,
  deleteFile,
  myUpdateDoc,
} from "@/services/firebaseService";
import { useNavigate } from "react-router-dom";
import { usePlaylistContext } from "@/stores/dashboard/PlaylistContext";
// import { optimizeAndGetHashImage } from "@/services/appService";
import { doc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { useAddPlaylist } from "@/hooks";

type DeletePlaylist = {
  variant: "delete-playlist";
};

type AddSongs = {
  variant: "add-songs";
  songs: Song[];
};

type EditPlaylist = {
  variant: "edit-playlist";
  playlist: Partial<PlaylistSchema>;
  imageFile?: File;
};

type RemoveSong = {
  variant: "remove-song";
  song: Song;
};

type RemoveSinger = {
  variant: "remove-singer";
  singer: Singer;
};

type AddSinger = {
  variant: "add-singer";
  singer: Singer;
};

type UpdateImage = {
  variant: "update-image";
  song: Song;
};

export type PlaylistActionProps =
  | DeletePlaylist
  | AddSongs
  | EditPlaylist
  | RemoveSong
  | UpdateImage
  | RemoveSinger
  | AddSinger;

export default function useDashboardPlaylistActions() {
  // stores
  const { user } = useAuthContext();
  //   const { setPlaylists } = useSongContext();
  const { playlist, songs, setSongs, updatePlaylistData } =
    usePlaylistContext();

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const navigate = useNavigate();
  const { addPlaylist } = useAddPlaylist({ setIsFetching });
  const { setErrorToast, setSuccessToast } = useToastContext();

  const updatePlaylistSinger = async (singers: Singer[], id: string) => {
    const newSingerMap: Playlist["singer_map"] = {};
    singers.forEach((s) => (newSingerMap[s.id] = true));

    const playlistData: Partial<Playlist> = {
      singers: singers,
      singer_map: newSingerMap,
    };

    await myUpdateDoc({
      collectionName: "Playlists",
      id: id,
      data: playlistData,
    });

    updatePlaylistData(playlistData);
  };

  const action = async (props: PlaylistActionProps) => {
    try {
      if (!user) throw new Error("User not found");
      if (!playlist) throw new Error("playlist not found");

      setIsFetching(true);

      switch (props.variant) {
        case "delete-playlist": {
          const batch = writeBatch(db);

          const playlistRef = doc(db, "Playlists", playlist.id);
          const commentSnap = await getDocs(
            query(commentCollectionRef, where("target_id", "==", playlist.id)),
          );

          // delete playlist doc
          batch.delete(playlistRef);

          // delete comments doc
          if (!commentSnap.empty) {
            console.log(`Delete ${commentSnap.docs.length} comments`);
            commentSnap.forEach((snap) => batch.delete(snap.ref));
          }

          await Promise.all([
            batch.commit(),
            playlist.image_file_id
              ? deleteFile({ fileId: playlist.image_file_id })
              : () => {},
          ]);

          setSuccessToast("Delete playlsit sucessful");

          navigate("/dashboard/playlist");

          break;
        }
        case "add-songs": {
          const newPlaylistSongs = [...songs, ...props.songs];
          const newSongIds = newPlaylistSongs.map((s) => s.id);

          const playlistData: Partial<Playlist> = {
            song_ids: newSongIds,
            // singer_map: newPlaylistSongs.reduce(
            //   (prev, s) => ({
            //     ...prev,
            //     ...s.singers.reduce(
            //       (prev, singer) => ({ ...prev, [singer.id]: true }),
            //       {} as Playlist["singer_map"],
            //     ),
            //   }),
            //   {} as Playlist["singer_map"],
            // ),
          };

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
          const success = await addPlaylist({
            variant: "edit",
            id: playlist.id,
            playlist: props.playlist,
            imageFile: props.imageFile,
          });

          if (success) {
            const newPlaylist = { ...playlist, ...props.playlist };

            updatePlaylistData(newPlaylist);
            setSuccessToast(`Playlist edited`);
          }

          break;
        }
        case "remove-song": {
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
          const imageData: Partial<PlaylistSchema> = {
            image_url: props.song.image_url,
            blurhash_encode: props.song.blurhash_encode,
            image_file_id: "",
          };

          //  delete old image file
          if (playlist.image_file_id)
            await deleteFile({ fileId: playlist.image_file_id });

          await myUpdateDoc({
            collectionName: "Playlists",
            data: imageData,
            id: playlist.id,
            msg: ">>> api: set playlist doc",
          });

          updatePlaylistData(imageData);

          setSuccessToast(`Playlist edited;`);

          break;
        }
        case "remove-singer": {
          const newPlaylistSingers = playlist.singers.filter(
            (s) => s.id !== props.singer.id,
          );

          updatePlaylistSinger(newPlaylistSingers, playlist.id);

          setSuccessToast("Singer removed");
          break;
        }

        case "add-singer": {
          const newPlaylistSingers = [...playlist.singers];

          const founded = newPlaylistSingers.find(
            (s) => s.id === props.singer.id,
          );
          if (founded) return;

          newPlaylistSingers.push(props.singer);

          updatePlaylistSinger(newPlaylistSingers, playlist.id);
          setSuccessToast("Singer added");
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
