import { AudioSetting, Tab } from "@/components";
import { useLyricEditorContext } from "./LyricEditorContext";
import EditLyricModalPlayer from "./Player";
import PlayBtn from "./PlayBtn";
import SplitBtn from "./SplitBtn";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function Header({ audioEle }: Props) {
  const { tabProps } = useLyricEditorContext();

  return (
    <>
      <EditLyricModalPlayer audioEle={audioEle} />

      <div className="flex items-center justify-between">
        <Tab {...tabProps} render={(t) => t} />

        <div className="flex space-x-2">
          <PlayBtn />

          <SplitBtn />

          <AudioSetting
            positions="left"
            audioEle={audioEle}
            postLocalStorageKey="edit_lyric_tune"
          />
        </div>
      </div>
    </>
  );
}
