import { Center } from "@/components";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import useKaraoke from "./_hooks/useKaraoke";
import KaraokeItem from "./_components/KaraokeItem";

type Props = {
  active: boolean;
};

export default function Karaoke({ active }: Props) {
  const { loading, evenOverlay, oddOverlay, tempEventText, tempOddText, textData } =
    useKaraoke({ active });

  if (loading)
    return (
      <Center>
        <ArrowPathIcon className="w-7 animate-spin" />
      </Center>
    );

  return (
    <>
      <div ref={tempEventText} className="inline-flex h-0 opacity-0">
        {textData.even.split(" ").map((w, i) => (
          <span key={i} className="leading-1">
            {w}
          </span>
        ))}
      </div>

      <div ref={tempOddText} className="inline-flex h-0 opacity-0">
        {textData.odd.split(" ").map((w, i) => (
          <span key={i} className="k leading-1">
            {w}
          </span>
        ))}
      </div>
      <KaraokeItem overlayRef={evenOverlay} text={textData.even} />
      <div className="mt-8"></div>
      <KaraokeItem overlayRef={oddOverlay} text={textData.odd} />
    </>
  );
}
