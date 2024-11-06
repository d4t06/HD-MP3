import useKaraoke from "@/hooks/useKaraoke";
import KaraokeItem from "./KaraokeItem";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function Karaoke({ audioEle }: Props) {
  const { loading, evenOverlay, oddOverlay, tempEventText, tempOddText, textData } =
    useKaraoke({
      audioEle,
    });

  if (loading) return "loading";

  return (
    <>
      <div ref={tempEventText} className="inline-flex h-0 opacity-0">
        {textData.even.split(" ").map((w, i) => (
          <span key={i} className="leading-1">{w}</span>
        ))}
      </div>

      <div ref={tempOddText} className="inline-flex h-0 opacity-0">
        {textData.odd.split(" ").map((w, i) => (
          <span key={i} className="k leading-1">{w}</span>
        ))}
      </div>
      <KaraokeItem overlayRef={evenOverlay} text={textData.even} />
      <KaraokeItem overlayRef={oddOverlay} text={textData.odd} />
    </>
  );
}
