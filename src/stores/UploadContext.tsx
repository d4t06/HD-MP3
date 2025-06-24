import { ReactNode, createContext, useContext, useState } from "react";

function useUpload() {
  const [uploadingSongs, setUploadingSongs] = useState<SongSchema[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const resetUploadContext = () => {
    setIsUploading(false);
    setUploadingSongs([]);
  };

  return {
    uploadingSongs,
    setUploadingSongs,
    isUploading,
    setIsUploading,
    resetUploadContext,
  };
}

type ContextType = ReturnType<typeof useUpload>;

const Context = createContext<ContextType | null>(null);

const UploadSongProvider = ({ children }: { children: ReactNode }) => {
  return <Context.Provider value={useUpload()}>{children}</Context.Provider>;
};

const useUploadContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("UploadSongProvider not provided");
  return ct;
};

export default UploadSongProvider;
export { useUploadContext };
