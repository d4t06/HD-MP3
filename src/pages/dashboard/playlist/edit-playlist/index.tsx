import Table from "@/components/ui/Table";
import { Center, Image, NotFound, Square, Title } from "@/components";
import { Frame, Loading } from "../../_components";
import DashboardPlaylistCta from "./_components/PlaylistCta";
import useGetPlaylist from "./_hooks/useGetPlaylist";
import { useMemo } from "react";
import SingerItem from "./_components/SingerItem";
import ItemRightCtaFrame from "../../_components/ui/ItemRightCtaFrame";
import PlaylistLike from "./_components/PlaylistLike";
import { Link } from "react-router-dom";
import DashboardSongMenu from "../../_modules/song-menu";
import { dateFromTimestamp } from "@/utils/dateFromTimestamp";
import DetailFrame from "../../_components/ui/DetailFrame";
import { abbreviateNumber } from "@/utils/abbreviateNumber";

export default function DashboardPlaylistDetail() {
  const { isFetching, songs, playlist } = useGetPlaylist();

  const lastUpdate = useMemo(() => playlist?.updated_at, [playlist?.id]);

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );

  if (!playlist) return <></>;

  return (
    <div className="pb-[46px]">
      <Title title="Edit playlist" className="mb-8" />

      <div className="md:flex md:-mx-3">
        <div className="space-y-3 md:px-3">
          <div className="w-[200px] h-[200px] mx-auto">
            <Square>
              <Image
                className="object-cover h-full"
                blurHashEncode={playlist.blurhash_encode}
                src={playlist.image_url}
              />
            </Square>
          </div>

          <Title variant={"h2"} title={playlist.name} />

          <DetailFrame>
            <p>
              <span>Public:</span>
              {playlist.is_public ? "Public" : "Private"}
            </p>
            <p>
              <span>Songs:</span>
              {songs.length} songs
            </p>

            <p>
              <span>Comments:</span>
              {abbreviateNumber(playlist.comment)}
            </p>

            <PlaylistLike />

            <p>
              <span>Last update:</span>
              {dateFromTimestamp(lastUpdate)}
            </p>
          </DetailFrame>

          <DashboardPlaylistCta />
        </div>

        <div className="w-full mt-3 md:mt-0 md:w-3/4 md:px-3">
          <Title variant={"h3"} title={"Singers"} />

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

          <Title title={"Songs"} variant={"h3"} className="mt-3" />

          <Frame className="mt-1">
            <div className={`overflow-hidden`}>
              <Table
                className="[&_td]:text-sm [&_tbody>tr]:border-t [&_tr]:border-black/10 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2 hover:[&_tr:not(div.absolute)]:bg-black/5"
                colList={["Name", "Singer", "Genre", ""]}
              >
                {songs.length ? (
                  songs.map((s, i) => (
                    <tr key={i}>
                      <td>
                        <Link
                          to={`/dashboard/song/${s.id}/edit`}
                          className="hover:underline"
                        >
                          {s.name}
                        </Link>
                      </td>
                      <td>
                        {s.singers.map((s, i) => (
                          <Link
                            className="hover:underline"
                            to={`/dashboard/singer/${s.id}`}
                            key={i}
                          >
                            {!!i && ", "}
                            {s.name}
                          </Link>
                        ))}
                      </td>

                      <td>{s.main_genre?.name}</td>

                      <td>
                        <DashboardSongMenu variant={"playlist"} song={s} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
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
