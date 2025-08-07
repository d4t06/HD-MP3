import {
  Center,
  Image,
  Loading,
  NotFound,
  PageWrapper,
  Title,
} from "@/components";
import { useGetCategory } from "@/hooks";
import { useMemo, useState } from "react";
import PlaylistSection from "./_components/PlaylistSection";
import Footer from "@/layout/primary-layout/_components/Footer";
import SongSection from "./_components/SongSection";

export default function CategoryDetail() {
  const [category, setCategory] = useState<Category>();

  const { isFetching } = useGetCategory({ setCategory });

  const [songIds, playlistIds] = useMemo(
    () => [
      category?.song_ids ? category.song_ids.split("_") : [],
      category?.playlist_ids ? category.playlist_ids.split("_") : [],
    ],
    [category],
  );

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );

  if (!category)
    return (
      <Center>
        <NotFound variant="with-home-button" />
      </Center>
    );

  return (
    <>
      <PageWrapper>
        <div>
          <Title title={category.name} />

          <div className="relative rounded-lg overflow-hidden aspect-[16/4] mt-5">
            <Image
              src={category.banner_image_url}
              blurHashEncode={category.banner_blurhash_encode}
              className="object-cover h-full"
            />
          </div>
        </div>

        <SongSection songIds={songIds} />

        <PlaylistSection playlistIds={playlistIds} />
      </PageWrapper>
      <Footer />
    </>
  );
}
