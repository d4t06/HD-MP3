import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { Modal, TimerModal, ModalRef, MyTooltip } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllPlayStatusStore,
  setPlayStatus,
} from "@/stores/redux/PlayStatusSlice";

export default function SleepTimerButton() {
  const dispatch = useDispatch();
  const { countDown } = useSelector(selectAllPlayStatusStore);

  const modalRef = useRef<ModalRef>(null);

  const handleTriggerClick = () => {
    if (!!countDown) dispatch(setPlayStatus({ countDown: 0 }));
    else modalRef.current?.open();
  };

  const classes = {
    container: "w-[54px] sm:w-[50px] flex justify-center",
    button: `rounded-[99px] p-[5px] hover:bg-[--a-5-cl]`,
    itemContainer: "flex justify-between items-center min-h-[30px]",
    text: "text-base text-[#ccc]",
  };

  return (
    <>
      <div className={classes.container}>
        {!!countDown ? (
          <MyTooltip content="Clear timer">
            <button
              className="group flex items-center"
              onClick={handleTriggerClick}
            >
              <span className="text-base opacity-70 sm:text-sm group-hover:hidden">
                {countDown.toString().padStart(2, "0")}
              </span>
              <span className={`hidden group-hover:block ${classes.button}`}>
                <XMarkIcon className="w-8 sm:w-6" />
              </span>
            </button>
          </MyTooltip>
        ) : (
          <MyTooltip content="Sleep timer">
            <button onClick={handleTriggerClick} className={classes.button}>
              <ClockIcon className="w-8 sm:w-6" />
            </button>
          </MyTooltip>
        )}
      </div>

      <Modal ref={modalRef} variant="animation">
        <TimerModal
          active={(t) => dispatch(setPlayStatus({ countDown: t }))}
          closeModal={() => modalRef.current?.close()}
        />
      </Modal>
    </>
  );
}
