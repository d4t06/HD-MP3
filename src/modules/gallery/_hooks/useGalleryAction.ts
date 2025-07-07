import { useGalleryContext } from "@/stores/dashboard/GalleryContext";
import { request } from "@/utils/appHelpers";

type ImagesRes = {
  page: number;
  images: ImageType[];
  page_size: number;
  count: number;
};

export default function useGalleryAction() {
  const { setIsFetching, setPage, setIsLast, setImages } = useGalleryContext();


  const getImages = async (page: number) => {
    try {
      setIsFetching(true);

      const res = await request.get<ImagesRes>(`/images?page=${page}`);

      setImages((prev) => [...prev, ...res.data.images]);

      setIsLast(res.data.count - page * res.data.page_size < 0);

      setPage(page);
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  return { getImages };
}
