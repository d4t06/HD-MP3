import { ModalContentWrapper, ModalHeader } from ".";

type Props = {
  closeModal: () => void;
  active: (t: number) => void;
};

const COUNT_LIST = [3, 5, 7, 10];

function TimerModal({ closeModal, active }: Props) {
  const classes = {
    list: `flex flex-wrap mt-2 -ml-2 mb-3 [&>button]:bg-[--a-5-cl]
    hover:[&>button]:bg-[--primary-cl]
    hover:[&>button]:text-white
    [&>button]:ml-2
    [&>button]:mt-2
    [&>button]:px-3
    [&>button]:py-1
    [&>button]:font-semibold
    [&>button]:rounded-[99px]`,
  };

  const handleSetTimer = (songCount: number) => {
    active(songCount);
    closeModal();
  };

  const renderItems = COUNT_LIST.map((count) => {
    return (
      <button key={count} type="button" onClick={() => handleSetTimer(count)}>
        {count} songs
      </button>
    );
  });

  return (
    <ModalContentWrapper>
      <ModalHeader closeModal={closeModal} title="Sleep timer" />
      <div className={classes.list}>{renderItems}</div>
    </ModalContentWrapper>
  );
}

export default TimerModal;
