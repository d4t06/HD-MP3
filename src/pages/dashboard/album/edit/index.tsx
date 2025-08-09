import useGetAlbum from "./_hooks/useGetAlbum";
import { Center, Image, Title } from "@/components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import DetailFrame from "../../_components/ui/DetailFrame";
import { LikeBtn } from "../../_components";
import { useMemo } from "react";
import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { dateFromTimestamp } from "@/utils/dateFromTimestamp";
// import AlbumSongSelect from "@/modules/add-album-form/_components/SongSelect";
// import AddAlbumProvider from "@/modules/add-album-form/_components/AddAlbumContext";
import AlbumCta from "./_components/AlbumCta";
import AlbumProvider, { useAlbumContext } from "./AlbumContext";
import SongSelectProvider from "@/stores/SongSelectContext";
import AlbumSongSection from "./_components/SongsSection";

function Content() {
  const { album, songs } = useAlbumContext();
  const { isFetching } = useGetAlbum();

  const lastUpdate = useMemo(() => album?.updated_at, [album?.id]);

  if (isFetching)
    return (
      <Center>
        <ArrowPathIcon className="w-6 animate-spin" />
      </Center>
    );

  if (!album) return <></>;

  return (
    <>
      {/* <DashboardPageWrapper> */}
      <Title title="Edit album" className="mb-3" />
      {/* <AddAlbumForm variant="edit" album={album} /> */}

      <div className="md:flex md:-mx-3">
        <div className="space-y-5 md:px-3">
          <div className="w-[200px] h-[200px] mx-auto rounded-md overflow-hidden">
            <Image
              className="object-cover h-full rounded-lg"
              blurHashEncode={album.blurhash_encode}
              src={album.image_url}
            />
          </div>

          <DetailFrame className="space-y-2">
            <p>
              <span>Public:</span>
              {album.is_public ? "Public" : "Private"}
            </p>

            <p>
              <span>Song:</span>
              {songs.length}
            </p>

            <p>
              <span>Comments:</span>
              {abbreviateNumber(album.comment)}
            </p>

            <LikeBtn init={album.like} loading={false} submit={() => {}} />

            <p>
              <span>Last update:</span>
              {lastUpdate ? dateFromTimestamp(lastUpdate) : ""}
            </p>
          </DetailFrame>

          <AlbumCta />
        </div>

        <div className="w-full mt-3 md:mt-0 md:w-3/4 md:px-3 space-y-5">
          <div>
            <Title title="Info" variant={"h2"} className="mb-3" />

            <DetailFrame>
              <div>
                <span>Name:</span>
                <Title variant={"h1"} title={album.name} />
              </div>

              <div>
                <span>Singer:</span>
                <Title variant={"h2"} title={album.singers[0].name} />
              </div>
            </DetailFrame>
          </div>

          <AlbumSongSection />
        </div>
      </div>

      {/* </DashboardPageWrapper> */}
    </>
  );
}

export default function DashboardEditAlbumPage() {
  return (
    <AlbumProvider>
      <SongSelectProvider>
        <Content />
      </SongSelectProvider>
    </AlbumProvider>
  );
}
