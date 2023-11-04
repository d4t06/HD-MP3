import { useMemo, useState } from "react";
import { Song, ThemeType } from "../../types"
import { useSongsStore } from "../../store/SongsContext";
import Button from "../ui/Button";
import MobileSongItem from "../MobileSongItem";

type Props = {
   playlistSongs: Song[];
   theme: ThemeType & {alpha: string};
   handleAddSongsToPlaylist: (song: Song[]) => {}
}


export default function AddSongToPlaylistModal ({playlistSongs, theme, handleAddSongsToPlaylist} :Props) {
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);

   const {userSongs} = useSongsStore()

   const classes = {
      addSongContainer: "pb-[50px] relative",
      addSongContent: "max-h-[calc(90vh-50px)] w-[700px] max-w-[80vw] overflow-auto",
      songItem: "w-full max-[549px]:w-full",
   };

   const isAbleToSubmit = useMemo(() => !!selectedSongList.length, [selectedSongList])   

   return (
      <div className={classes.addSongContainer}>
      <div className={classes.addSongContent}>
         <Button
            onClick={() => handleAddSongsToPlaylist(selectedSongList)}
            variant={"primary"}
            className={`rounded-full ${theme.content_bg} absolute bottom-0 right-15px ${!isAbleToSubmit  && 'opacity-60 pointer-events-none'}`}
         >
            Save
         </Button>
         {userSongs.map((song, index) => {
            const isDifference = playlistSongs.indexOf(song) == -1;

            if (isDifference) {
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
   )
}