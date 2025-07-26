import { Image, Loading, NotFound } from "@/components";
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

  if (isFetching) return <Loading />;

  if (!category) return <NotFound />;

  return (
    <>
      <div className="relative aspect-[16/4]">
        <Image src={category.banner_image_url} className="rounded-lg object-cover h-full" />
      </div>

      <SongSection songIds={songIds} />

      <PlaylistSection playlistIds={playlistIds} />

      <Footer />
    </>
  );
}
