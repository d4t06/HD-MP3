import { useRef, useState } from "react";

export default function useAddPlaylistForm() {
  const [playlistData, setPlaylistData] = useState<PlaylistSchema>();
  const [imageFile, setImageFile] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  const updatePlaylistData = (data?: Partial<PlaylistSchema>) => {
    if (!playlistData) return;
    setPlaylistData({ ...playlistData, ...data });
  };

  return {
    playlistData,
    imageFile,
    setImageFile,
    updatePlaylistData,
    setPlaylistData,
    inputRef,
  };
}
