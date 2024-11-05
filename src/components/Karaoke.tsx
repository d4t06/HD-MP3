import useKaraoke from "@/hooks/useKaraoke";
import { useLyricContext } from "@/store/LyricContext";
import { ElementRef, useRef } from "react";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function Karaoke({ audioEle }: Props) {
  const lyricElementsRef = useRef<ElementRef<"p">[]>([]);

  const { loading, evenOverlay, currentIndex, oddOverlay, textData } = useKaraoke({
    lyricElementsRef,
    audioEle,
  });

  const classes = {
    lyric: "absolute text-[40px] opacity-0 pointer-none whitespace-nowrap",
  };

  if (loading) return "loading";

  return (
    <>
      <div className="relative">
        {textData.even || "..."}
        <p ref={evenOverlay} className="absolute left-0 top-0 h-full">
          {textData.even || "..."}
        </p>
      </div>

      <div className="relative">
        {textData.odd || "..."}
        <p ref={oddOverlay} className="absolute left-0 top-0 h-full">
          {textData.odd || "..."}
        </p>
      </div>
    </>
  );
}
