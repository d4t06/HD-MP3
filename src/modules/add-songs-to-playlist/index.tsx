import { useSongSelectContext } from "@/stores";
import { ModalContentWrapper, ModalHeader, Title } from "@/components";
import { Button, Loading, SearchBar } from "@/pages/dashboard/_components";
import { CheckIcon } from "@heroicons/react/24/outline";
import useSearchSong from "./_hooks/useSearchSong";
import SongSelectProvider from "@/stores/SongSelectContext";

type Props = {
  closeModal: () => void;
  submit: (songs: Song[]) => void;
  isLoading: boolean;
  current: string[];
};

function Content({ closeModal, submit, isLoading, current }: Props) {
  const { songs, isFetching, ...rest } = useSearchSong();
  const { selectedSongs, selectSong } = useSongSelectContext();

  const handleSubmit = async () => {
    if (!selectedSongs.length) return;
    submit(selectedSongs);
    closeModal();
  };

  const classes = {
    col: "md:w-1/2 flex-1 flex flex-col px-2 overflow-hidden",
    box: `rounded-lg bg-[--a-5-cl] p-2`,
    songItem: `rounded-md w-full p-1 font-semibold text-left hover:bg-[--a-5-cl]`,
  };

  const renderSongs = (s: Song[]) =>
    s.map((p, i) => {
      const isCurrent = current.includes(p.id);

      return (
        <button
          key={i}
          onClick={() => !isCurrent && selectSong(p)}
          className={`${classes.songItem} ${isCurrent || selectedSongs.includes(p) ? `text-[--primary-cl]` : ``} `}
        >
          {p.name}
        </button>
      );
    });

  return (
    <>
      <ModalContentWrapper className="w-[600px] min-h-[400px]">
        <ModalHeader closeModal={closeModal} title="Add songs" />

        <SearchBar {...rest} />
        <div className="flex-grow flex flex-col md:flex-row -mx-2 overflow-hidden mt-3">
          <div className={`${classes.col}`}>
            <div className={`${classes.box} flex-grow overflow-auto`}>
              {!isFetching ? (
                renderSongs(songs)
              ) : (
                <Loading className="h-full" />
              )}
            </div>
          </div>
          <div className={`${classes.col} mt-3 md:mt-0`}>
            <Title title="Selected" variant={'h3'} className="mb-1" />

            <div
              className={`${classes.box} flex-grow overflow-auto space-y-2 `}
            >
              {renderSongs(selectedSongs)}
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
      </ModalContentWrapper>
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
