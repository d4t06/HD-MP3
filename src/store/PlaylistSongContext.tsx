import { Dispatch, ReactNode, SetStateAction, createContext, useContext } from "react";
import { Song } from "../types";

type PlaylistContext = {
   playlistSongs: Song[];
   setPlaylistSongs: Dispatch<SetStateAction<Song[]>>;
};

const PlaylistContext = createContext<PlaylistContext | null>(null);

export default function PlaylistProvider({
   children,
   playlistSongs,
   setPlaylistSongs,
}: {
   children: ReactNode;
   playlistSongs: Song[];
   setPlaylistSongs: Dispatch<SetStateAction<Song[]>>;
}) {
   return <PlaylistContext.Provider value={{ setPlaylistSongs, playlistSongs }}>{children}</PlaylistContext.Provider>;
}

export const usePlaylistContext = () => {
   const context = useContext(PlaylistContext);

   if (!context) {
      console.log("Playlist context not found");

      throw new Error("Playlist context not found");
   }

   return context;
};
