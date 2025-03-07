export default function DashBoard() {
  return (
    <>
      <div className={``}>
        <p>This is dashboard page</p>

        {/* <div className="mt-[30px]">
          <>
            <div className="text-xl font-playwriteCU leading-[2.4] mb-3">Playlist</div>

            <PlaylistList loading={isFetching} variant="dashboard" />

            <div className="mt-[30px] flex justify-between mb-[10px]">
              <div className="text-xl font-playwriteCU leading-[2.4]">Songs</div>

              <div className="flex items-center">
                <label
                  className={`${theme.content_bg} ${
                    isFetching ? "disable" : ""
                  } rounded-full flex px-[20px] py-[4px] cursor-pointer`}
                  htmlFor="song_upload"
                >
                  <PlusCircleIcon className="w-[20px] mr-[5px]" />
                  Upload
                </label>
              </div>
            </div>

            <DashboardSongList initialLoading={isFetching} />
          </>
        </div> */}
      </div>
    </>
  );
}
