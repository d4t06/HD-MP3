import ModalHeader from "./ModalHeader";
import { useTheme } from "@/store";

type Props = {
  closeModal: () => void;
  active: (t: number) => void;
};

const COUNT_LIST = [3, 5, 7, 10];

function TimerModal({ closeModal, active }: Props) {
  const { theme } = useTheme();

  const classes = {
    button: `bg-${theme.alpha} ${theme.content_hover_bg} ml-2 mt-2 px-3  py-1 rounded-[99px]`,
  };

  const handleSetTimer = (songCount: number) => {
    active(songCount);
    closeModal();
  };

  const renderItems = COUNT_LIST.map((count) => {
    return (
      <button
        key={count}
        type="button"
        onClick={() => handleSetTimer(count)}
        className={`${classes.button} `}
      >
        {count} songs
      </button>
    );
  });

  return (
    <div className="w-[300px] max-w-[calc(100vw-40px)]">
      <ModalHeader close={closeModal} title="Sleep timer" />
      <div>
        <div className="flex flex-wrap -mt-2 -ml-2 mb-3">{renderItems}</div>
      </div>
    </div>
  );
}

export default TimerModal;
