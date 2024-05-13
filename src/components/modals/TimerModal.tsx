import { MouseEvent, useState } from "react";
import { useDispatch } from "react-redux";
import ModalHeader from "./ModalHeader";
import { Button } from "..";
import { setPlayStatus } from "../../store/PlayStatusSlice";
import { useTheme, useToast } from "../../store";
import { setLocalStorage } from "../../utils/appHelpers";

type Props = {
   close: () => void;
};

function TimerModal({ close }: Props) {
   const disPath = useDispatch();
   const { theme } = useTheme();

   const [quickMinute, setQuickMinute] = useState<"5" | "10" | "15" | "30" | "">();
   const [minute, setMinute] = useState("");
   const [hour, setHour] = useState("");

   // use hooks
   const { setSuccessToast } = useToast();

   const classes = {
      button: `text-[14px] font-[500] px-[10px]  py-[4px] rounded-[99px]`,
      input: `bg-${theme.alpha} px-[10px] rounded-[4px] outline-none mt-[10px] text-[16px]  h-[35px] w-full`,
   };

   const handleSelect = (
      value: typeof quickMinute,
      e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
   ) => {
      console.log("handleSelect", value);

      e.stopPropagation();
      e.preventDefault();
      setHour("");
      setMinute("");
      setQuickMinute(value);
   };

   const handleInput = (name: "minute" | "hour", value: string) => {
      //   setError(false)
      setQuickMinute("");
      if (name == "minute") setMinute(value);
      else setHour(value);
   };

   const handleSetTimer = () => {
      let totalMinute: number;

      if (quickMinute) {
         totalMinute = +quickMinute;
      } else totalMinute = +hour * 60 + +minute;

      disPath(setPlayStatus({ isTimer: totalMinute }));
      setLocalStorage("isTimer", totalMinute);

      setSuccessToast({ message: "Timer added" });
      close();
   };

   const valid = quickMinute || hour || minute;

   return (
      <div className="w-[300px] max-w-[calc(100vw-40px)]">
         <ModalHeader close={close} title="Sleep timer" />
         <div>
            <div className="flex space-x-[10px] mb-[12px]">
               <button
                  type="button"
                  onClick={(e) => handleSelect("5", e)}
                  className={`${classes.button} ${
                     quickMinute === "5"
                        ? theme.content_bg
                        : `${theme.content_border} border`
                  }`}
               >
                  5 min
               </button>

               <button
                  type="button"
                  onClick={(e) => handleSelect("15", e)}
                  className={`${classes.button} ${
                     quickMinute === "15"
                        ? theme.content_bg
                        : `${theme.content_border} border`
                  }`}
               >
                  15 min
               </button>

               <button
                  type="button"
                  onClick={(e) => handleSelect("30", e)}
                  className={`${classes.button} ${
                     quickMinute === "30"
                        ? theme.content_bg
                        : `${theme.content_border} border`
                  }`}
               >
                  30 min
               </button>
            </div>
            <div className="flex mx-[-10px]">
               <div className="flex flex-col w-[50%] px-[10px]">
                  <label htmlFor="hour_input">Hour</label>
                  <select
                     value={hour}
                     onChange={(e) => handleInput("hour", e.target.value)}
                     id="hour_input"
                     className={classes.input}
                  >
                     <option value="0">---</option>
                     <option value="1">1</option>
                     <option value="2">2</option>
                     <option value="3">3</option>
                  </select>
               </div>

               <div className="flex flex-col w-[50%] px-[10px]">
                  <label htmlFor="minute_input">Minute</label>

                  <select
                     value={minute}
                     onChange={(e) => handleInput("minute", e.target.value)}
                     className={classes.input}
                     id="minute_input"
                  >
                     <option className={classes.input} value="0">
                        ---
                     </option>
                     <option value="15">15</option>
                     <option value="30">30</option>
                     <option value="45">45</option>
                  </select>
               </div>
            </div>

            <p className="text-right mt-[20px]">
               <Button
                  onClick={handleSetTimer}
                  variant={"primary"}
                  className={`${theme.content_bg} rounded-full ${
                     valid ? "" : "opacity-60 pointer-events-none"
                  }`}
               >
                  Ok
               </Button>
            </p>
         </div>
      </div>
   );
}

export default TimerModal;
