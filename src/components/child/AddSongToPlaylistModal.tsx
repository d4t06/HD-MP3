import { useMemo, useState } from "react";
import { Song, ThemeType } from "../../types";
import { useSongsStore } from "../../store/SongsContext";
import Button from "../ui/Button";
import MobileSongItem from "../MobileSongItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
   playlistSongs: Song[];
   theme: ThemeType & { alpha: string };
   addSongsToPlaylist: (song: Song[]) => Promise<void>;
   admin?: boolean;
};

export default function AddSongToPlaylistModal({
   playlistSongs,
   theme,
   addSongsToPlaylist,
   admin,
}: Props) {
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [loading, setLoading] = useState(false);

   const { userSongs, adminSongs } = useSongsStore();

   const classes = {
      addSongContainer: "pb-[50px] relative",
      addSongContent: "max-h-[calc(90vh-50px)] w-[700px] max-w-[80vw] overflow-auto",
      songItem: "w-full max-[549px]:w-full",
   };

   const isAbleToSubmit = useMemo(() => !!selectedSongList.length, [selectedSongList]);
   const targetSongs = useMemo(
      () => (admin ? adminSongs : userSongs),
      [userSongs, adminSongs]
   );

   const handleAddSongsToPlaylist = async (selectedSongList: Song[]) => {
      try {
         setLoading(true);
         await addSongsToPlaylist(selectedSongList);
      } catch (error) {
         console.log(error);
         throw new Error("Error when add song to playlist");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className={classes.addSongContainer}>
         <div className={classes.addSongContent}>
            <Button
               onClick={() => handleAddSongsToPlaylist(selectedSongList)}
               variant={"primary"}
               className={`rounded-full ${
                  theme.content_bg
               } absolute bottom-0 right-15px min-w-[34px] h-[32px] ${
                  !isAbleToSubmit && "opacity-60 pointer-events-none"
               }`}
            >
               {loading ? <ArrowPathIcon className="w-[20px] animate-spin" /> : "Save"}
            </Button>
            {targetSongs.map((song, index) => {
               const isDifferenceSong =
                  playlistSongs.findIndex((s) => s.id === song.id) === -1;

               if (isDifferenceSong) {
                  return (
                     <div key={index} className={classes.songItem}>
                        <MobileSongItem
                           isCheckedSong={true}
                           selectedSongList={selectedSongList}
                           setSelectedSongList={setSelectedSongList}
                           theme={theme}
                           data={song}
                           active={false}
                           onClick={() => {}}
                        />
                     </div>
                  );
               }
            })}
         </div>
      </div>
   );
}
