import { useTheme } from "@/store/ThemeContext";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useSongsStore } from "../store";
import { useInitSong } from "../hooks";
import PlaylistList from "../components/PlaylistList";
import DashboardSongList from "@/components/DashboardSongList";

export default function DashBoard() {
  //  store
  const { theme } = useTheme();
  const { userPlaylists } = useSongsStore();

  // use hooks
  const { loading: initialLoading, errorMsg } = useInitSong({ admin: true });

  return (
    <>
      <div className={`pt-10 pb-[calc(90px+40px)]`}>
        {/* content */}
        <div className="mt-[30px]">
          <>
            {/* playlist */}
            <div className="text-xl font-playwriteCU leading-[2.4] mb-3">Playlist</div>

            <PlaylistList
              loading={initialLoading}
              playlist={userPlaylists}
              location="dashboard"
            />

            {/* userSongs */}
            <div className="mt-[30px] flex justify-between mb-[10px]">
              <div className="text-xl font-playwriteCU leading-[2.4]">Songs</div>

              <div className="flex items-center">
                <label
                  className={`${theme.content_bg} ${
                    initialLoading ? "disable" : ""
                  } rounded-full flex px-[20px] py-[4px] cursor-pointer`}
                  htmlFor="song_upload"
                >
                  <PlusCircleIcon className="w-[20px] mr-[5px]" />
                  Upload
                </label>
              </div>
            </div>

            {errorMsg && <p>Some thing went wrong</p>}
            {!errorMsg && <DashboardSongList initialLoading={initialLoading} />}
          </>
        </div>
      </div>
    </>
  );
}
