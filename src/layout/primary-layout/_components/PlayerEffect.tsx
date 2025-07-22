import { ReactNode, useMemo } from "react";
import useCountDown from "../_hooks/useCountDown";
import usePlayerEffect from "../_hooks/usePlayerEffect";
import useIdle from "../_hooks/useIdle";
import appConfig from "@/config/app";
import { useThemeContext } from "@/stores";
import usePlayCount from "../_hooks/usePlayCount";

type Props = {
  children: ReactNode;
  audioEle: HTMLAudioElement;
};

export default function PlayerEffect({ children, audioEle }: Props) {
  const { isOnMobile } = useThemeContext();

  usePlayerEffect();
  useCountDown();
  useIdle(appConfig.focusDelay, isOnMobile);
  usePlayCount({ audioEle });

  return useMemo(() => children, []);
}
