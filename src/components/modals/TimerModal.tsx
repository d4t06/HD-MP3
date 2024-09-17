import ModalHeader from "./ModalHeader";
import { useTheme } from "@/store";

type Props = {
  close: () => void;
  active: (t: number) => void;
};

function TimerModal({ close, active }: Props) {
  const { theme } = useTheme();

  const classes = {
    button: `bg-${theme.alpha} ${theme.content_hover_bg} text-[14px] font-[500] px-[10px]  py-[4px] rounded-[99px]`,
    input: `bg-${theme.alpha} px-[10px] rounded-[4px] outline-none mt-[10px] text-[16px]  h-[35px] w-full`,
  };

  const handleSetTimer = (minute: number) => {
    active(minute);
    close();
  };

  return (
    <div className="w-[300px] max-w-[calc(100vw-40px)]">
      <ModalHeader close={close} title="Sleep timer" />
      <div>
        <div className="flex space-x-[10px] mb-[12px]">
          <button
            type="button"
            onClick={() => handleSetTimer(15)}
            className={`${classes.button} `}
          >
            15 min
          </button>

          <button
            type="button"
            onClick={() => handleSetTimer(20)}
            className={`${classes.button} `}
          >
            20 min
          </button>

          <button
            type="button"
            onClick={() => handleSetTimer(30)}
            className={`${classes.button} `}
          >
            30 min
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerModal;
