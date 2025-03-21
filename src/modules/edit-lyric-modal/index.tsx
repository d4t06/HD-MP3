import { useRef } from "react";
import { ModalHeader } from "@/components";
import Header from "./_components/Header";
import LyricEditorProvider, {
  useLyricEditorContext,
} from "./_components/LyricEditorContext";
import Sliders from "./_components/Sliders";
import BottomCta from "./_components/BottomCta";
import useHandleEvent from "./_hooks/useHandleEvent";
import { useEditLyricContext } from "../lyric-editor/_components/EditLyricContext";
import useEditLyricModalSideEffect from "./_hooks/useEditLyricModalSideEffect";
import Preview from "./_components/Preview";
import WordList from "./_components/WordList";
import Record from "./_components/Record";
import PlayBtn from "./_components/PlayBtn";

type Props = {
  closeModal: () => void;
};

function Content({ closeModal }: Props) {
  const { song, currentWords } = useEditLyricContext();
  const { eleRefs, tabProps } = useLyricEditorContext();

  useHandleEvent();
  useEditLyricModalSideEffect();

  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <>
      <div className="max-w-[90vw] w-[600px] relative">
        <ModalHeader title="Edit lyric" close={closeModal} />

        <audio src={song?.song_url} ref={audioRef} />

        {/* temp words */}
        <div ref={eleRefs.tempWordRef} className="absolute inline-block opacity-0">
          {currentWords.map((w, i) => (
            <span className="leading-[1] inline-block" key={i}>
              {w}
            </span>
          ))}
        </div>

        {audioRef.current && <Header audioEle={audioRef.current} />}
        <div className="mt-5">
          {tabProps.tab === "Record" && audioRef.current && (
            <Record audioEle={audioRef.current} />
          )}
          {tabProps.tab === "Edit" && (
            <>
              <PlayBtn />
              <Sliders />
              <Preview />
              <WordList />
            </>
          )}
        </div>

        <BottomCta closeModal={closeModal} />
      </div>
    </>
  );
}

export default function EditLyricModal(props: Props) {
  return (
    <LyricEditorProvider>
      <Content {...props} />
    </LyricEditorProvider>
  );
}
