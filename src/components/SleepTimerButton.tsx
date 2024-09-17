import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/Tooltip";
import { useTheme } from "@/store";
import { useRef } from "react";
import { Modal, Switch, TimerModal } from ".";
import useCountDown from "@/hooks/useCountDown";
import { formatTime } from "@/utils/appHelpers";
import { ModalRef } from "./Modal";

type Props = {
  audioEle: HTMLAudioElement;
  variant: "desktop" | "mobile";
};

export default function SleepTimerButton({ audioEle, variant = "desktop" }: Props) {
  const { theme } = useTheme();

  const modalRef = useRef<ModalRef>(null);

  const { countDown, isActive, handleEndTimer, setIsActive } = useCountDown({ audioEle });

  const activeTimer = (t: number) => setIsActive(t);

  const handleTriggerClick = () => {
    if (isActive) handleEndTimer(true);
    else modalRef.current?.toggle();
  };

  const classes = {
    container: "w-[50px] flex justify-center",
    button: `rounded-[99px]  hover:bg-${theme.alpha} p-[5px]`,
    itemContainer: "flex justify-between items-center min-h-[30px]",
    text: "text-base text-[#ccc]",
  };

  const renderElement = () => {
    switch (variant) {
      case "desktop":
        return (
          <div className={classes.container}>
            {!!isActive ? (
              <Tooltip placement="top">
                <TooltipTrigger onClick={handleTriggerClick}>
                  <div className="group">
                    <div className="text-sm group-hover:hidden">
                      {formatTime(countDown)}
                    </div>
                    <div className={`hidden group-hover:block ${classes.button}`}>
                      <XMarkIcon className="w-6" />
                    </div>
                  </div>
                </TooltipTrigger>

                <TooltipContent>Clear timer</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip placement="top">
                <TooltipTrigger onClick={handleTriggerClick} className={classes.button}>
                  <ClockIcon className="w-6" />
                </TooltipTrigger>

                <TooltipContent>Sleep timer</TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      case "mobile":
        return (
          <div className={`${classes.itemContainer}`}>
            <p className={classes.text}>
              {isActive ? formatTime(countDown) : "Sleep timer"}
            </p>
            <Switch
              size="thin"
              className="bg-white/10"
              active={!!isActive}
              cb={handleTriggerClick}
            />
          </div>
        );
    }
  };

  return (
    <>
      {renderElement()}

      <Modal ref={modalRef} variant="animation">
        <TimerModal active={activeTimer} close={() => modalRef.current?.toggle()} />
      </Modal>
    </>
  );
}
