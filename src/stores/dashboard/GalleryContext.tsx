import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

const useCategories = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [uploadingImages, setUploadingImages] = useState<ImageType[]>([]);
  const [isLast, setIsLast] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const shoudFetchingImage = useRef(true);

  return {
    page,
    setPage,
    images,
    setImages,
    uploadingImages,
    setUploadingImages,
    isLast,
    setIsLast,
    isFetching,
    setIsFetching,
    shoudFetchingImage,
  };
};

type ContextType = ReturnType<typeof useCategories>;

const context = createContext<ContextType | null>(null);

export default function GalleryProvider({ children }: { children: ReactNode }) {
  return (
    <context.Provider value={useCategories()}>{children}</context.Provider>
  );
}

export function useGalleryContext() {
  const ct = useContext(context);
  if (!ct) throw new Error("productProvider not provided");

  return ct;
}
