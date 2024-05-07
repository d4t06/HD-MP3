import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useState,
} from "react";
type PlaylistContext = {
   playlistSongs: Song[];
   setPlaylistSongs: Dispatch<SetStateAction<Song[]>>;
};

const PlaylistContext = createContext<PlaylistContext | null>(null);

export default function PlaylistProvider({ children }: { children: ReactNode }) {
   const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);

   return (
      <PlaylistContext.Provider value={{ setPlaylistSongs, playlistSongs }}>
         {children}
      </PlaylistContext.Provider>
   );
}

export const usePlaylistContext = () => {
   const context = useContext(PlaylistContext);

   if (!context) {
      // console.log("Playlist context not found");
      // throw new Error("Playlist context not found");

      return { playlistSongs: [], setPlaylistSongs: () => {} } as PlaylistContext;
   }

   return context;
};
