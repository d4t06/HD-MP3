import {
  Loading,
  ModalContentWrapper,
  ModalHeader,
  NotFound,
} from "@/components";
import useSearchLyricModal from "../_hooks/useSearchLyricModal";
import Searchbar from "./SearchBar";
import { formatTime } from "@/utils/appHelpers";
import { useThemeContext } from "@/stores";
import { useEditLyricContext } from "./EditLyricContext";

type Props = {
  closeModal: () => void;
};

export default function SearchLyricModal({ closeModal }: Props) {
  const { theme } = useThemeContext();
  const { setLyrics, setIsPreview, setIsChanged } = useEditLyricContext();
  const { isFetching, isShowResult, result, ...rest } = useSearchLyricModal();

  const handleChoose = (rawSongLyric: RawSongLyric) => {
    setLyrics(JSON.parse(rawSongLyric.lyrics));
    setIsPreview(true);
    setIsChanged(true);

    closeModal();
  };

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader closeModal={closeModal} title="Search lyric" />

        <Searchbar {...rest} />

        <div className="h-[40vh] mt-3 space-y-1.5 overflow-auto">
          {isShowResult &&
            (isFetching ? (
              <Loading />
            ) : (
              <>
                {result.length ? (
                  result.map((songLyric, i) => (
                    <div
                      key={i}
                      onClick={() => handleChoose(songLyric)}
                      className={`bg-white/10 cursor-pointer rounded-md p-2 ${theme.content_hover_bg}`}
                    >
                      <p>{songLyric.name}</p>
                      <p>{formatTime(songLyric.duration)}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <NotFound />
                  </>
                )}
              </>
            ))}
        </div>
      </ModalContentWrapper>
    </>
  );
}
