import { PlaylistList, Title } from "@/components";
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

  return (
    <>
      <div>
        {title && <Title variant={"h2"} title={title} />}
        <PlaylistList loading={isFetching} playlists={playlists} />
      </div>
    </>
  );
}
