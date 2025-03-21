import { AudioSetting } from "@/components";
import Tab from "@/components/Tab";
import { useLyricEditorContext } from "./LyricEditorContext";
import EditLyricModalPlayer from "./Player";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function Header({ audioEle }: Props) {
  const { tabProps } = useLyricEditorContext();

  return (
    <>
      <EditLyricModalPlayer audioEle={audioEle} />

      <div className="flex items-center justify-between">
        <div className="bg-black/10 p-1 rounded-full [&>button]:border-none">
          <Tab {...tabProps} render={(t) => t} />
        </div>

        <AudioSetting
          positions="left"
          bg="bg-[#5a9e87]"
          className="bg-transparent hover:bg-black/10 p-1"
          audioEle={audioEle}
          postLocalStorageKey="edit_lyric_tune"
        />
      </div>
    </>
  );
}
