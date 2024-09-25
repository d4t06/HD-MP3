import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/store";
import { useRef } from "react";
import { Modal, TimerModal } from ".";
import useCountDown from "@/hooks/useCountDown";
import { formatTime } from "@/utils/appHelpers";
import { ModalRef } from "./Modal";
import MyTooltip from "./MyTooltip";

type Props = {
  audioEle: HTMLAudioElement;
};

export default function SleepTimerButton({ audioEle }: Props) {
  const { theme } = useTheme();

  const modalRef = useRef<ModalRef>(null);

  const { countDown, isActive, handleEndTimer, setIsActive } = useCountDown({ audioEle });

  const activeTimer = (t: number) => setIsActive(t);

  const handleTriggerClick = () => {
    if (isActive) handleEndTimer(true);
    else modalRef.current?.toggle();
  };

  const classes = {
    container: "w-[54px] sm:w-[50px] flex justify-center",
    button: `rounded-[99px]  hover:bg-${theme.alpha} p-[5px]`,
    itemContainer: "flex justify-between items-center min-h-[30px]",
    text: "text-base text-[#ccc]",
  };

  return (
    <>
      <div className={classes.container}>
        {!!isActive ? (
          <MyTooltip content="Clear timer">
            <button className="group flex items-center" onClick={handleTriggerClick}>
              <span className="text-base opacity-70 sm:text-sm group-hover:hidden">
                {formatTime(countDown)}
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
        <TimerModal active={activeTimer} close={() => modalRef.current?.toggle()} />
      </Modal>
    </>
  );
}
