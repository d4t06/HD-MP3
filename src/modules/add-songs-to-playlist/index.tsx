import { useSongSelectContext } from "@/stores";
import {
  Label,
  LoadingOverlay,
  ModalContentWrapper,
  ModalHeader,
  Tab,
} from "@/components";
import { Button, Loading, SearchBar } from "@/pages/dashboard/_components";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import useSearchSong from "./_hooks/useSearchSong";
import SongSelectProvider from "@/stores/SongSelectContext";

type Props = {
  closeModal: () => void;
  submit: (songs: Song[]) => void;
  isLoading: boolean;
  current: string[];
};

function Content({ closeModal, submit, isLoading, current }: Props) {
  const {
    uploadedSongs,
    result,
    getNewestSongs,
    isFetching,
    setTab,
    tabs,
    tab,
    ...rest
  } = useSearchSong();
  const { selectedSongs, selectSong } = useSongSelectContext();

  const handleSubmit = async () => {
    if (!selectedSongs.length) return;
    submit(selectedSongs);
    closeModal();
  };

  const classes = {
    col: "md:w-1/2 flex-1 flex flex-col px-2 overflow-hidden",
    box: `rounded-lg bg-[--a-5-cl] p-2`,
    songItem: `rounded-md w-full p-1 text-sm font-semibold text-left hover:bg-[--a-5-cl]`,
  };

  const renderSongs = (songs: Song[]) =>
    songs.map((s, i) => {
      const isCurrent = current.includes(s.id);

      return (
        <button
          key={i}
          onClick={() => selectSong(s)}
          className={`${classes.songItem} ${isCurrent || !!selectedSongs.find((song) => song.id === s.id) ? `text-[--primary-cl]` : ``} `}
        >
          {s.name}
        </button>
      );
    });

  return (
    <>
      <ModalContentWrapper className="w-[600px] min-h-[400px]">
        <ModalHeader closeModal={closeModal} title="Add songs" />

        <SearchBar className="w-fit" {...rest} />
        <div className="flex-grow flex flex-col md:flex-row -mx-2 overflow-hidden mt-3">
          <div className={`${classes.col}`}>
            <Tab
              className="w-fit mb-1"
              buttonClasses="[&_button]:px-3 [&_button]:py-1/2"
              tabs={tabs}
              setTab={setTab}
              tab={tab}
              render={(t) => t}
            />

            <div className={`${classes.box} flex-grow overflow-auto`}>
              {!isFetching ? (
                <>
                  {tab === "Result" ? (
                    renderSongs(result)
                  ) : (
                    <>
                      {renderSongs(uploadedSongs)}

                      <p className="text-center mt-3">
                        <Button
                          onClick={getNewestSongs}
                          size={"clear"}
                          className="p-1"
                        >
                          <ArrowPathIcon className="w-5" />
                        </Button>
                      </p>
                    </>
                  )}
                </>
              ) : (
                <Loading className="h-full" />
              )}
            </div>
          </div>
          <div className={`${classes.col} mt-3 md:mt-0`}>
            <Label className="mb-1 md:h-[36px]">Selected</Label>

            <div className={`${classes.box} flex-grow overflow-auto`}>
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

        {isLoading && <LoadingOverlay />}
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
