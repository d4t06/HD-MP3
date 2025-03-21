import Table from "@/components/ui/Table";
import { Center, Image, NotFound, Square, Title } from "@/components";
import { DashboardSongItem, Frame, Loading } from "../../_components";
import DashboardPlaylistCta from "./_components/PlaylistCta";
import useGetPlaylist from "./_hooks/useGetPlaylist";
import { useMemo } from "react";
import { formatTime } from "@/utils/appHelpers";
import SingerItem from "./_components/SingerItem";

export default function DashboardPlaylistDetail() {
  const { isFetching, songs, playlist } = useGetPlaylist();

  const playlistDuration = useMemo(
    () => songs.reduce((prev, c) => prev + c.duration, 0),
    [songs]
  );

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );

  if (!playlist)
    return (
      <Center>
        <NotFound />
      </Center>
    );

  return (
    <>
      <Title className="mb-5" title="Playlist detail" />
      <div className="md:flex md:-mx-3 overflow-hidden">
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

          <Title title={playlist.name} />

          <DashboardPlaylistCta />
        </div>

        <div className="w-full mt-3 md:mt-0 md:w-3/4 md:px-3">
          <Title title={"Info"} />

          <Frame>
            <p>{playlist.is_public ? "Public" : "Private"}</p>
            <p>
              {songs.length} songs - {formatTime(playlistDuration)}
            </p>

            <p>{playlist.like} likes</p>
          </Frame>

          <Title title={"Singers"} className="mt-3" />

          <Frame>
            <div className="-mt-2 -mx-1 [&>*]:px-3 [&>*]:py-1 [&>*]:text-sm [&>*]:rounded-md [&>*]:border [&>*]:bg-[#f1f1f1] [&>*]:border-transparent hover:[&>*]:border-red-500">
              {playlist.singers.map((s, i) => (
                <SingerItem singer={s} key={i} />
              ))}
            </div>
          </Frame>
          <Title title={"Songs"} className="mt-3" />

          <Frame className="">
            <div className={`overflow-hidden`}>
              <Table
                className="[&_td]:text-sm [&_tbody>tr]:border-t [&_tr]:border-black/10 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2 hover:[&_tr:not(div.absolute)]:bg-black/5"
                colList={["Name", "Singer", ""]}
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
    </>
  );
}
