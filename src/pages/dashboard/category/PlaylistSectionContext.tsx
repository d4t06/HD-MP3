import { createContext, ReactNode, useContext, useState } from "react";

function usePlaylistSection() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  return {
    playlists,
    setPlaylists,
  };
}

type ContextType = ReturnType<typeof usePlaylistSection>;

const Context = createContext<ContextType | null>(null);

export default function PlaylistSectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Context.Provider value={usePlaylistSection()}>{children}</Context.Provider>
  );
}

export const usePlaylistSectionContext = () => {
  const ct = useContext(Context);

  if (!ct) throw new Error("PlaylistSectionProvider is not provided");

  return ct;
};
