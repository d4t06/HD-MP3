import { useThemeContext } from "@/stores";
import { getLinearBg } from "@/utils/getLinearBg";

type Props = {
  process: number;
};

function ProcessBar({ process }: Props) {
  const { theme } = useThemeContext();

  const classes = {
    processLineBase: `h-[6px] w-full rounded-[99px] `,
  };

  return (
    <div
      style={{ background: getLinearBg(theme.content_code, process) }}
      className={`${classes.processLineBase} `}
    ></div>
  );
}
export default ProcessBar;
