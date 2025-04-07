import { useSongSelectContext, useThemeContext } from "@/stores";
import { useMemo } from "react";
import { ModalHeader } from "@/components";
import { Button, Loading, SearchBar } from "@/pages/dashboard/_components";
import { CheckIcon } from "@heroicons/react/24/outline";
import useSearchSong from "./_hooks/useSearchSong";
import SongSelectProvider from "@/stores/SongSelectContext";
import { ContentWrapper } from "@/pages/dashboard/_components/ui/ModalWrapper";

type Props = {
  closeModal: () => void;
  submit: (songs: Song[]) => void;
  isLoading: boolean;
};

function Content({ closeModal, submit, isLoading }: Props) {
  const { theme } = useThemeContext();

  const { songs, isFetching, ...rest } = useSearchSong();
  const { selectedSongs, selectSong } = useSongSelectContext();

  const handleSubmit = async () => {
    if (!selectedSongs.length) return;
    submit(selectedSongs);
    closeModal();
  };

  const otherSongs = useMemo(() => {
    const selectedSongsId = selectedSongs.map((s) => s.id);

    return songs.filter((s) => !selectedSongsId.includes(s.id));
  }, [songs, selectedSongs]);

  const classes = {
    col: "md:w-1/2 flex-1 flex flex-col px-2 overflow-hidden",
    box: `rounded-lg bg-black/10 p-2`,
    songItem: `rounded-md w-full p-1 text-left`,
  };

  return (
    <>
      <ContentWrapper className="w-[750px] h-[500px] flex flex-col overflow-hidden">
        <ModalHeader close={closeModal} title="Add song" />

        <div className="flex-grow flex flex-col md:flex-row -mx-2">

          <div className={`${classes.col}`}>
            <SearchBar {...rest} />

            <div className={`${classes.box} flex-grow mt-3`}>
              <div className={`h-full overflow-auto pace-y-2`}>
                {!isFetching ? (
                  otherSongs.map((s, i) => (
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

            <div className={`${classes.box} flex-grow overflow-auto space-y-2 `}>
              {selectedSongs.map((s, i) => (
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
            disabled={!selectedSongs.length}
            loading={isLoading}
            onClick={handleSubmit}
          >
            <CheckIcon className="w-6" />
            <span>Add</span>
          </Button>
        </p>
      </ContentWrapper>
    </>
  );
}

export default function AddSongsToPlaylistModal(props: Props) {
  return (
    <SongSelectProvider>
      <Content {...props} />
    </SongSelectProvider>
  );
}
