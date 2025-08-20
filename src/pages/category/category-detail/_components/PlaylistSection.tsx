import { PlaylistItem, PlaylistList, Title } from "@/components";
import { useGetPlaylists } from "@/hooks";
import { useState } from "react";

type Props = {
  playlistIds: string[];
  title?: string;
};

export default function PlaylistSection({ playlistIds, title }: Props) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  // const loadingElement = [...Array(4).keys()].map((i) => (
  //   <Skeleton key={i} className="aspect-[1/1]" />
  // ));

  const { isFetching } = useGetPlaylists({ setPlaylists, playlistIds });

  if (isFetching)
    return (
      <div className={`flex flex-row flex-wrap -mx-3`}>
        {[...Array(4).keys()].map((index) => (
          <PlaylistItem key={index} variant="skeleton" />
        ))}
      </div>
    );

  if (!playlists.length) return <></>;

  return (
    <>
      <div>
        {title && <Title variant={"h2"} title={title} />}
        <PlaylistList loading={isFetching} playlists={playlists} />
      </div>
    </>
  );
}
