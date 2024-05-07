import { useMemo, useState, SetStateAction, Dispatch } from "react";
import { useSongsStore } from "../../store/SongsContext";
import Button from "../ui/Button";
import MobileSongItem from "../MobileSongItem";
import usePlaylistActions from "../../hooks/usePlaylistActions";
import ModalHeader from "./ModalHeader";
import { useSelector } from "react-redux";
import { selectAllSongStore, useActuallySongsStore, useTheme } from "../../store";

type Props = {
   admin?: boolean;
   playlist: Playlist;
   playlistSongs: Song[];
   setPlaylistSongs: Dispatch<SetStateAction<Song[]>>;
   close: () => void;
};

export default function SongListModal({
   admin,
   playlist,
   playlistSongs,
   setPlaylistSongs,
   close,
}: Props) {

   const {theme} = useTheme()

   const { song: songInStore } = useSelector(selectAllSongStore);
   const { actuallySongs, setActuallySongs } = useActuallySongsStore();
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);

   // hook
   const { userSongs, adminSongs } = useSongsStore();
   const { addSongsToPlaylist, isFetching } = usePlaylistActions();

   const classes = {
      addSongContainer: "pb-[40px] relative",
      addSongContent: "max-h-[calc(60vh)] w-[700px] max-w-[80vw] overflow-auto",
      songItem: "w-full max-[549px]:w-full",
   };

   const isAbleToSubmit = useMemo(() => !!selectedSongList.length, [selectedSongList]);
   const targetSongs = useMemo(
      () => (admin ? adminSongs : userSongs),
      [userSongs, adminSongs]
   );

   const handleAddSongsToPlaylist = async () => {
      try {
         if (!playlist || !selectedSongList.length || !setPlaylistSongs) {
            return;
         }

         await addSongsToPlaylist(selectedSongList, playlist);

         const newPlaylistSongs = [...playlistSongs, ...selectedSongList];
         setPlaylistSongs(newPlaylistSongs);

         if (songInStore.song_in === `playlist_${playlist.id}`) {
            console.log("set actually songs");
            const newSongs = [...actuallySongs, ...selectedSongList];
            setActuallySongs(newSongs);
         }
      } catch (error) {
         console.log(error);
      } finally {
         close();
      }
   };

   return (
      <div className={classes.addSongContainer}>
         <ModalHeader close={close} title="Add song to playlist" />
         <div className={classes.addSongContent}>
            <Button
               onClick={handleAddSongsToPlaylist}
               variant={"primary"}
               isLoading={isFetching}
               className={`rounded-full ${
                  theme.content_bg
               } absolute bottom-0 right-[15px] min-w-[34px] h-[32px] ${
                  !isAbleToSubmit && "opacity-60 pointer-events-none"
               }`}
            >
               Add
               {`${selectedSongList.length ? ` (${selectedSongList.length})` : ""}`}
            </Button>
            {targetSongs.map((song, index) => {
               const isDifferenceSong =
                  playlistSongs.findIndex((s) => s.id === song.id) === -1;

               if (isDifferenceSong) {
                  return (
                     <div key={index} className={classes.songItem}>
                        <MobileSongItem
                           isChecked={true}
                           selectedSongs={selectedSongList}
                           setSelectedSongs={setSelectedSongList}
                           theme={theme}
                           data={song}
                           active={false}
                           onClick={() => {}}
                           setIsChecked={() => {}}
                        />
                     </div>
                  );
               }
            })}
         </div>
      </div>
   );
}
