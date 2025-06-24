import { AudioSetting, Tab } from "@/components";
import { useLyricEditorContext } from "./LyricEditorContext";
import EditLyricModalPlayer from "./Player";
import { useThemeContext } from "@/stores";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function Header({ audioEle }: Props) {
  const { tabProps } = useLyricEditorContext();

  const { theme } = useThemeContext();

  return (
    <>
      <EditLyricModalPlayer audioEle={audioEle} />

      <div className="flex items-center justify-between">
        <Tab className="bg-white/10" {...tabProps} render={(t) => t} />

        <AudioSetting
          positions="left"
          bg={theme.content_bg}
          audioEle={audioEle}
          postLocalStorageKey="edit_lyric_tune"
        />
      </div>
    </>
  );
}
