import { useSongSelectContext, useThemeContext } from "@/stores";
import { useMemo } from "react";
import { ModalContentWrapper, ModalHeader } from "@/components";
import { Button, Loading, SearchBar } from "@/pages/dashboard/_components";
import { CheckIcon } from "@heroicons/react/24/outline";
import SongSelectProvider from "@/stores/SongSelectContext";
import PlaylistSelectProvider, { usePlaylistSelectContext } from "@/pages/dashboard/playlist/edit-playlist/PlaylistSelectContext";
import useSearchPlaylist from "../_hooks/useSearchPlaylist";

type Props = {
  closeModal: () => void;
  submit: (playlists: Playlist[]) => void;
  isLoading: boolean;
};

function Content({ closeModal, submit, isLoading }: Props) {
  const { theme } = useThemeContext();

  const { playlists, isFetching, ...rest } = useSearchPlaylist();
  const { selectedPlaylists, selectSong } = usePlaylistSelectContext();

  const handleSubmit = async () => {
    if (!selectedPlaylists.length) return;
    submit(selectedPlaylists);
    closeModal();
  };

  const otherPlaylists = useMemo(() => {
    const selectedSongsId = selectedPlaylists.map((s) => s.id);

    return playlists.filter((s) => !selectedSongsId.includes(s.id));
  }, [playlists, selectedPlaylists]);

  const classes = {
    col: "md:w-1/2 flex-1 flex flex-col px-2 overflow-hidden",
    box: `rounded-lg bg-black/10 p-2`,
    songItem: `rounded-md w-full p-1 text-left`,
  };

  return (
    <>
      <ModalContentWrapper className="w-[600px] h-[400px]">
        <ModalHeader close={closeModal} title="Add Playlist" />

        <div className="flex-grow flex flex-col md:flex-row -mx-2">
          <div className={`${classes.col}`}>
            <SearchBar {...rest} />

            <div className={`${classes.box} flex-grow mt-3`}>
              <div className={`h-full overflow-auto pace-y-2`}>
                {!isFetching ? (
                  otherPlaylists.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => selectSong(s)}
                      className={`${classes.songItem} bg-black/10 ${theme.content_hover_bg}`}
                    >
                      <h5 className="">{s.name}</h5>
                    </button>
                  ))
                ) : (
                  <Loading className="h-full" />
                )}
              </div>
            </div>
          </div>
          <div className={`${classes.col} mt-3 md:mt-0`}>
            <div className="font-[500] mb-3">Selected:</div>

            <div
              className={`${classes.box} flex-grow overflow-auto space-y-2 `}
            >
              {selectedPlaylists.map((s, i) => (
                <button
                  key={i}
                  onClick={() => selectSong(s)}
                  className={`${classes.songItem} ${theme.content_bg} hover:bg-black/10 hover:text-black`}
                >
                  <h5 className="">{s.name}</h5>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-right mt-3 flex-shrink-0">
          <Button
            disabled={!selectedPlaylists.length}
            loading={isLoading}
            onClick={handleSubmit}
          >
            <CheckIcon className="w-6" />
            <span>Add</span>
          </Button>
        </p>
      </ModalContentWrapper>
    </>
  );
}

export default function AddPlaylistsModal(props: Props) {
  return (
    <PlaylistSelectProvider>
      <Content {...props} />
    </PlaylistSelectProvider>
  );
}
