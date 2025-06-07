import { useRef } from "react";
import { ModalContentWrapper, ModalHeader } from "@/components";
import Header from "./_components/Header";
import LyricEditorProvider, {
  useLyricEditorContext,
} from "./_components/LyricEditorContext";
import BottomCta from "./_components/BottomCta";
import useHandleEvent from "./_hooks/useHandleEvent";
import { useEditLyricContext } from "../lyric-editor/_components/EditLyricContext";
import useEditLyricModalSideEffect from "./_hooks/useEditLyricModalSideEffect";
import Record from "./_components/Record";
import Sliders from "./_components/Sliders";
import Preview from "./_components/Preview";
import WordList from "./_components/WordList";
import PlayBtn from "./_components/PlayBtn";
import useControlEvent from "./_hooks/useControlEvent";

type Props = {
  closeModal: () => void;
};

function Content({ closeModal }: Props) {
  const { song } = useEditLyricContext();
  const { eleRefs, currentWords, tabProps } = useLyricEditorContext();

  useHandleEvent();
  useEditLyricModalSideEffect();
  useControlEvent();

  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <>
      <ModalContentWrapper  className="w-[800px]">
        <ModalHeader title="Edit lyric" close={closeModal} />

        <audio src={song?.song_url} ref={audioRef} />

        {/* temp words */}
        <div ref={eleRefs.tempWordRef} className="absolute inline-block opacity-0">
          {currentWords.map((w, i) => (
            <span key={i}>
              {w}
              <span>&nbsp;</span>
            </span>
          ))}
        </div>

        {audioRef.current && <Header audioEle={audioRef.current} />}
        <div className="mt-5">
          {audioRef.current && (
            <div className={`${tabProps.tab === "Record" ? "block" : "hidden"}`}>
              <Record audioEle={audioRef.current} />
            </div>
          )}
          <div className={`${tabProps.tab === "Edit" ? "block" : "hidden"}`}>
            <PlayBtn />
            <Sliders />
            <Preview />

            {/*<p>
              {growList.map((g, i) => (
                <span key={i} className="w-[30px] inline-block">
                  {(!!i ? " " : "") + g}
                </span>
              ))}
            </p>
            <p>
              {mergedGrowListRef.current.map((g, i) => (
                <span key={i} className="w-[30px] inline-block">
                  {(!!i ? " " : "") + g}
                </span>
              ))}
            </p>*/}
            <WordList />
          </div>
        </div>

        <BottomCta closeModal={closeModal} />
      </ModalContentWrapper>
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
