import Table from "@/components/ui/Table";
import { Center, Image, NotFound, Square, Title } from "@/components";
import { DashboardSongItem, Frame, Loading } from "../../_components";
import DashboardPlaylistCta from "./_components/PlaylistCta";
import useGetPlaylist from "./_hooks/useGetPlaylist";
import { useMemo } from "react";
import { formatTime } from "@/utils/appHelpers";
import SingerItem from "./_components/SingerItem";
import ItemRightCtaFrame from "../../_components/ui/ItemRightCtaFrame";
import PlaylistLike from "./_components/PlaylistLike";

export default function DashboardPlaylistDetail() {
  const { isFetching, songs, playlist } = useGetPlaylist();

  const playlistDuration = useMemo(
    () => songs.reduce((prev, c) => prev + c.duration, 0),
    [songs],
  );

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );

  if (!playlist) return <></>;

  return (
    <div className="pb-[46px]">
      <Title title="Edit playlist" className="mb-3" />

      <div className="md:flex md:-mx-3">
        <div className="space-y-2.5 md:px-3">
          <div className="w-[200px] h-[200px] mx-auto">
            <Square>
              <Image
                className="object-cover h-full"
                blurHashEncode={playlist.blurhash_encode}
                src={playlist.image_url}
              />
            </Square>
          </div>

          <div>
            <Title title={playlist.name} />

            <Frame className="mt-1">
              <p>{playlist.is_public ? "Public" : "Private"}</p>
              <p>
                {songs.length} songs - {formatTime(playlistDuration)}
              </p>

              <PlaylistLike  variant="edit" playlist={playlist} />
            </Frame>
          </div>

          <DashboardPlaylistCta />
        </div>

        <div className="w-full mt-3 md:mt-0 md:w-3/4 md:px-3">
          <Title title={"Singers"} />

          <Frame className="mt-1">
            {playlist.singers.length ? (
              <div className="-mt-2 -ml-2 flex ">
                {playlist.singers.map((s, i) => (
                  <ItemRightCtaFrame key={i}>
                    <SingerItem singer={s} />
                  </ItemRightCtaFrame>
                ))}
              </div>
            ) : (
              <NotFound />
            )}
          </Frame>

          <Title title={"Songs"} className="mt-3" />

          <Frame className="mt-1">
            <div className={`overflow-hidden`}>
              <Table
                className="[&_td]:text-sm [&_tbody>tr]:border-t [&_tr]:border-black/10 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2 hover:[&_tr:not(div.absolute)]:bg-black/5"
                colList={["Name", "Singer", "Like", ""]}
              >
                {songs.length ? (
                  songs.map((s, i) => (
                    <DashboardSongItem variant="playlist" key={i} song={s} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>
                      <NotFound />
                    </td>
                  </tr>
                )}
              </Table>
            </div>
          </Frame>
        </div>
      </div>
    </div>
  );
}
