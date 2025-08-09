import { useAuthContext } from "@/stores";
import { useMemo, useRef } from "react";
import {
  Center,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
  Tab,
} from "@/components";
import { Button, Loading, SearchBar } from "@/pages/dashboard/_components";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import PlaylistSelectProvider, {
  usePlaylistSelectContext,
} from "@/pages/dashboard/playlist/edit-playlist/PlaylistSelectContext";
import useSearchPlaylist from "../_hooks/useSearchPlaylist";
import AddPlaylistModal from "@/modules/add-playlist-modal";
import { useAddPlaylist } from "@/hooks";

type Props = {
  closeModal: () => void;
  submit: (playlists: Playlist[]) => void;
  isLoading: boolean;
  current: string[];
};

function Content({ closeModal, submit, isLoading, current }: Props) {
  const { user } = useAuthContext();

  const {
    playlists,
    isFetching,
    getNewestPlaylists,
    result,
    lastSubmit,
    tabs,
    setTab,
    tab,

    ...rest
  } = useSearchPlaylist();
  const { selectedPlaylists, selectPlaylist } = usePlaylistSelectContext();

  const modalRef = useRef<ModalRef>(null);

  const { addPlaylist, isFetching: addPlaylistFetching } = useAddPlaylist();

  const handleSubmit = async () => {
    if (!selectedPlaylists.length) return;
    submit(selectedPlaylists);
    closeModal();
  };

  const _handleAddPlaylist = async (p: PlaylistSchema, imageFile?: File) => {
    // important !!!
    p.is_official = true;

    const playlist = await addPlaylist(
      {
        variant: "add",
        playlist: p,
        imageFile,
      },
      { push: false },
    );

    if (playlist) submit([playlist as Playlist]);

    modalRef.current?.close();

    closeModal();
  };

  const otherPlaylists = useMemo(() => {
    const selectedSongsId = selectedPlaylists.map((s) => s.id);

    return result.filter((s) => !selectedSongsId.includes(s.id));
  }, [result, selectedPlaylists]);

  const classes = {
    col: "md:w-1/2 flex-1 flex flex-col px-2 overflow-hidden",
    box: `rounded-lg bg-black/5 p-2`,
    boxItem: `w-full px-3 py-1.5 text-left hover:bg-[--a-5-cl] rounded-md text-sm`,
  };

  const renderPlaylists = (playlists: Playlist[]) =>
    playlists.map((p, i) => {
      const isCurrent = current.includes(p.id);

      return (
        <button
          key={i}
          onClick={() => !isCurrent && selectPlaylist(p)}
          className={`${classes.boxItem} ${isCurrent || selectedPlaylists.includes(p) ? `text-[--primary-cl]` : ``} `}
        >
          {p.name}
        </button>
      );
    });

  return (
    <>
      <ModalContentWrapper className="w-[600px] h-[500px]">
        <ModalHeader closeModal={closeModal} title="Add playlists" />

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

            <div className={`${classes.box} relative flex-grow overflow-auto`}>
              {/* <div className={`h-full overflow-auto space-y-2`}> */}
              {!isFetching ? (
                <>
                  {tab === "Result" ? (
                    renderPlaylists(otherPlaylists)
                  ) : (
                    <>
                      {renderPlaylists(playlists)}

                      <p className="mt-3 text-center">
                        <Button
                          onClick={getNewestPlaylists}
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

              {!isFetching &&
                lastSubmit &&
                rest.value == lastSubmit &&
                !otherPlaylists.length && (
                  <Center>
                    <Button onClick={() => modalRef.current?.open()}>
                      Add playlist
                    </Button>
                  </Center>
                )}
              {/* </div> */}
            </div>
          </div>
          <div className={`${classes.col} mt-3 md:mt-0`}>
            <p className="font-bold mb-1 h-[36px]">Selected</p>

            <div className={`${classes.box} flex-grow overflow-auto`}>
              {renderPlaylists(selectedPlaylists)}
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

      <Modal variant="animation" ref={modalRef}>
        <ModalContentWrapper className="w-[650px]">
          <AddPlaylistModal
            modalRef={modalRef}
            isLoading={addPlaylistFetching}
            variant="add"
            submit={_handleAddPlaylist}
            user={user as User}
            name={rest.value}
          />
        </ModalContentWrapper>
      </Modal>
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
