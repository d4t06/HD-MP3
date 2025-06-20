import {
  Image,
  NotFound,
  PlaylistList,
  SingerItem,
  Tab,
  Title,
} from "@/components";
import { PlaylistSkeleton, SongItemSkeleton } from "@/components/skeleton";
import useSetSong from "@/hooks/useSetSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import useGetSearchResult from "./_hooks/useGetSearchResult";
import SongList from "@/modules/song-item/_components/SongList";
import useGetRecommend from "@/hooks/useGetRecomemded";
import { Link } from "react-router-dom";
import Search from "@/modules/search";
// import BackBtn from "@/components/BackBtn";

export default function SearchResultPage() {
  const { isFetching, result, tab, setTab, tabs } = useGetSearchResult();

  const { handleSetSong } = useSetSong({ variant: "search-bar" });
  const { getRecommend } = useGetRecommend();

  const _handleSetSong = (song: Song) => {
    handleSetSong(song.queue_id, [song]);
    getRecommend(song);
  };

  const renderSkeleton = () => {
    switch (tab) {
      case "Song":
        return SongItemSkeleton;
      case "Playlist":
        return <div className="flex">{PlaylistSkeleton}</div>;
    }
  };

  const renderResult = () => {
    switch (tab) {
      case "Song":
        if (result.songs.length)
          return <SongList setSong={_handleSetSong} songs={result.songs} />;
        else return <NotFound className="mx-auto" />;

      case "Playlist":
        if (result.playlists.length)
          return <PlaylistList loading={false} playlists={result.playlists} />;
        else return <NotFound className="mx-auto" />;

      case "Singer":
        if (result.singers.length)
          return (
            <div className={`flex flex-row flex-wrap -mx-2 mt-3`}>
              {result.singers.map((s, i) => (
                <SingerItem variant="singer-item" singer={s} key={i} />
              ))}
            </div>
          );
        else return <NotFound className="mx-auto" />;
      case "User":
        if (result.users.length)
          return (
            <div>
              {result.users.map((u) => (
                <div key={u.email} className="flex items-start">
                  <div className="w-[46px] h-[46px] rounded-full overflow-hidden">
                    <Image src={u.photo_url} />
                  </div>

                  <Link
                    to={`/user/${u.email}`}
                    className="font-semibold mt-3 md:mt-0 md:ml-3"
                  >
                    {u.display_name}
                  </Link>
                </div>
              ))}
            </div>
          );
        else return <NotFound className="mx-auto" />;
    }
  };

  return (
    <>
      <div className="md:hidden">
        <Search />
      </div>

      <Title title="Result" className="mt-1 md:mt-0" />
      <Tab
        className="w-fit [&_button]:text-sm md:[&_button]:text-base"
        tabs={tabs}
        render={(t) => t}
        tab={tab}
        setTab={setTab}
      />

      <SongSelectProvider>
        <div className="mt-5">
          {isFetching && renderSkeleton()}
          {!isFetching && renderResult()}
        </div>
      </SongSelectProvider>
    </>
  );
}
