import { ModalContentWrapper, ModalHeader } from ".";

type Props = {
  closeModal: () => void;
  active: (t: number) => void;
};

const COUNT_LIST = [3, 5, 7, 10];

function TimerModal({ closeModal, active }: Props) {

  const classes = {
    button: `bg-[--a-5-cl] hover:bg-[--primary-cl] ml-2 mt-2 px-3  py-1 rounded-[99px]`,
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
    <ModalContentWrapper>
      <ModalHeader closeModal={closeModal} title="Sleep timer" />
      <div>
        <div className="flex flex-wrap -mt-2 -ml-2 mb-3">{renderItems}</div>
      </div>
    </ModalContentWrapper>
  );
}

export default TimerModal;
