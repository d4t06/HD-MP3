import { useMemo, useState } from "react";
import { useSongsStore } from "@/store/SongsContext";
import Button from "../ui/Button";
import MobileSongItem from "../mobile/MobileSongItem";
import usePlaylistActions from "@/hooks/usePlaylistActions";
import ModalHeader from "./ModalHeader";
import { useTheme } from "@/store";

type Props = {
   close: () => void;
   playlistSongs: Song[];
};

export default function SongListModal({ close, playlistSongs }: Props) {
   const { theme } = useTheme();
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);

   // hook
   const { userSongs } = useSongsStore();
   const { addSongsToPlaylist, isFetching } = usePlaylistActions();

   const classes = {
      addSongContainer: "pb-[40px] relative",
      addSongContent: "max-h-[calc(60vh)] w-[700px] max-w-[80vw] overflow-auto",
      songItem: "w-full max-[549px]:w-full",
   };

   const isAbleToSubmit = useMemo(() => !!selectedSongList.length, [selectedSongList]);

   const handleAddSongsToPlaylist = async () => {
      try {
         if (!selectedSongList.length) {
            return;
         }

         await addSongsToPlaylist(selectedSongList);
      } catch (error) {
         console.log({ message: error });
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
            {userSongs.map((song, index) => {
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
