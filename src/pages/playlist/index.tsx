import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useSelector } from "react-redux";
import useGetPlaylist from "@/hooks/useGetPlaylist";
import { Center, NotFound, PageWrapper } from "@/components";
import { useAuthContext } from "@/stores";
import Footer from "@/layout/primary-layout/_components/Footer";
import PlaylistSongList from "./_components/PlaylistSongList";
import PLaylistInfo from "@/modules/playlist-info";
// import BackBtn from "@/components/BackBtn";

export default function PlaylistDetail() {
  // us stores
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);
  const { user } = useAuthContext();

  const isOwnerOfPlaylist = user
    ? currentPlaylist
      ? currentPlaylist.owner_email === user.email &&
        !currentPlaylist.is_official
      : false
    : false;

  const isLiked = user
    ? currentPlaylist
      ? user.liked_playlist_ids.includes(currentPlaylist.id)
      : false
    : null;

  //   hooks
  const { isFetching } = useGetPlaylist();

  if (!isFetching && !currentPlaylist)
    return (
      <Center>
        <NotFound variant="with-home-button" />
      </Center>
    );

  return (
    <>
      {/*<div className="mb-5">
        <BackBtn />
      </div>*/}

      <PageWrapper>
        <div className="lg:flex lg:-mx-3">
          <div className="w-full lg:w-1/4 lg:px-3">
            <PLaylistInfo
              showSkeleton={isFetching}
              variant={isOwnerOfPlaylist ? "my-playlist" : "others-playlist"}
              playlist={currentPlaylist}
              isLiked={isLiked}
            />
          </div>
          <div className="w-full lg:w-3/4 lg:px-3">
            <div className="mt-[30px] lg:mt-0">
              <PlaylistSongList
                loading={isFetching}
                variant={isOwnerOfPlaylist ? "my-playlist" : "others-playlist"}
              />
            </div>
          </div>
        </div>
      </PageWrapper>

      <Footer />
    </>
  );
}
