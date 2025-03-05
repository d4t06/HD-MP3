import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useSelector } from "react-redux";
import useGetPlaylist from "@/hooks/useGetPlaylist";
import { PlaylistInfo } from "@/components";
import { useAuthContext } from "@/stores";
// import PlaylistInfoCta from "./_components/PlaylistInfoCta";
import Footer from "@/layout/primary-layout/_components/Footer";
import PlaylistSongList from "./_components/PlaylistSongList";
import usePlaylist from "./_hooks/usePlaylist";
import PlayPlaylistBtn from "./_components/PlayPlaylistBtn";
import EditPlaylistBtn from "./_components/EditPlaylistBtn";

export default function PlaylistDetail() {
  // us stores
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);
  const { user } = useAuthContext();

  const isOwnerOfPlaylist = currentPlaylist?.owner_email === user?.email;

  //   hooks
  usePlaylist();
  const { isFetching } = useGetPlaylist();

  return (
    <>
      <div className="lg:flex lg:-mx-3">
        <div className="w-full lg:w-1/4 lg:px-3">
          <PlaylistInfo loading={isFetching}>
            {isOwnerOfPlaylist ? (
              <>
                <PlayPlaylistBtn />
                <EditPlaylistBtn />
              </>
            ) : (
              <PlayPlaylistBtn />
            )}
          </PlaylistInfo>
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
      <Footer />
    </>
  );
}
