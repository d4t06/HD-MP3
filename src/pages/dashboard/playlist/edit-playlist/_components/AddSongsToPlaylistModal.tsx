import { useThemeContext } from "@/stores";
import { useMemo } from "react";
import { ModalHeader } from "@/components";
import { Button, Loading, SearchBar } from "@/pages/dashboard/_components";
import useAddSongToPlaylistModal from "../_hooks/useAddSongToPlaylistModal";
import { CheckIcon } from "@heroicons/react/24/outline";

type Props = {
  closeModal: () => void;
};

export default function AddSongsToPlaylistModal({ closeModal }: Props) {
  const { theme } = useThemeContext();

  const {
    isFetching,
    songs,
    selectedSongs,
    handleAddSongsToPlaylist,
    selectSong,
    actionFetching,
    ...rest
  } = useAddSongToPlaylistModal();

  const _handleAddSongsToPlaylist = async () => {
    await handleAddSongsToPlaylist();
    closeModal();
  };

  const otherSongs = useMemo(() => {
    const selectedSongsId = selectedSongs.map((s) => s.id);

    return songs.filter((s) => !selectedSongsId.includes(s.id));
  }, [songs, selectedSongs]);

  const classes = {
    col: "w-1/2 flex flex-col px-2",
    box: `rounded-lg bg-white/10 overflow-hidden p-2`,
    songItem: `rounded-md w-full p-1 text-left`,
  };

  return (
    <div className="w-[700px] max-w-[85vw] h-[80vh] flex flex-col">
      <ModalHeader close={closeModal} title="Add song to playist" />

      <div className="flex-grow flex flex-col md:flex-row md:-mx-3 overflow-hidden">
        <div className={`${classes.col}`}>
          <SearchBar {...rest} />

          <div className={`${classes.box} flex-grow mt-3`}>
            <div className={`h-full overflow-auto space-y-2`}>
              {!isFetching ? (
                otherSongs.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => selectSong(s)}
                    className={`${classes.songItem} bg-${theme.alpha} ${theme.content_hover_bg}`}
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
        <div className={classes.col}>
          <div className="h-[70px] font-[500]">Selected:</div>

          <div className={`${classes.box} flex-grow mt-3 space-y-2`}>
            {selectedSongs.map((s, i) => (
              <button
                key={i}
                onClick={() => selectSong(s)}
                className={`${classes.songItem} ${theme.content_bg} hover:bg-${theme.alpha}`}
              >
                <h5 className="">{s.name}</h5>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-right mt-3">
        <Button loading={actionFetching} onClick={_handleAddSongsToPlaylist}>
          <CheckIcon className="w-6" />
          <span>Add</span>
        </Button>
      </p>
    </div>
  );
}
