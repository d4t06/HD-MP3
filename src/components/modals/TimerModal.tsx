import React, { Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import ModalHeader from "./ModalHeader";
import { ThemeType } from "../../types";
import { Button } from "..";
import { setPlayStatus } from "../../store/PlayStatusSlice";

type Props = {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  theme: ThemeType & { alpha: string };
  cb?: () => void;
};

function TimerModal({ setIsOpenModal, theme, cb }: Props) {
  const disPath = useDispatch();

  const [quickMinute, setQuickMinute] = useState<"5" | "10" | "15" | "30" | "">();
  const [minute, setMinute] = useState("");
  const [hour, setHour] = useState("");

  const [erorr, setError] = useState(false);

  const classes = {
    button: `text-[14px] font-[500] px-[10px]  py-[4px] rounded-[99px]`,
    input: `bg-${theme.alpha} px-[10px] rounded-[4px] outline-none mt-[10px] text-[16px]  h-[35px] w-full`,
  };

  const handleSelect = (value: typeof quickMinute) => {
    setError(false);
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
      disPath(setPlayStatus({ isTimer: totalMinute }));
    }

    // else {
    //   if (!Number.isNaN(+hour) && !Number.isNaN(+minute)) {
    //   } else setError(true);
    // }
  };

  return (
    <div className="w-[300px] max-w-[calc(100vw-40px)]:">
      <ModalHeader setIsOpenModal={setIsOpenModal} title="Timer" />
      <div>
        <div className="flex gap-[10px] mb-[12px]">
          <button
            onClick={() => handleSelect("5")}
            className={`${classes.button} ${
              quickMinute === "5" ? theme.content_bg : `${theme.content_border} border`
            }`}
          >
            5 min
          </button>

          <button
            onClick={() => handleSelect("15")}
            className={`${classes.button} ${
              quickMinute === "15" ? theme.content_bg : `${theme.content_border} border`
            }`}
          >
            15 min
          </button>

          <button
            onClick={() => handleSelect("30")}
            className={`${classes.button} ${
              quickMinute === "30" ? theme.content_bg : `${theme.content_border} border`
            }`}
          >
            30 min
          </button>
        </div>
        <div className="flex gap-[10px]">
          <div className="flex flex-col w-[50%]">
            <label htmlFor="hour_input">Hour</label>
            <input
              className={`${classes.input}`}
              type="text"
              id="hour_input"
              placeholder=""
              value={hour}
              onChange={(e) => handleInput("hour", e.target.value)}
            />
          </div>

          <div className="flex flex-col w-[50%]">
            <label htmlFor="hour_input">Minute</label>
            <input
              className={`${classes.input}`}
              type="text"
              id="hour_input"
              placeholder=""
              value={minute}
              onChange={(e) => handleInput("minute", e.target.value)}
            />
          </div>
        </div>

        <p className="text-right mt-[20px]">
          <Button
            onClick={handleSetTimer}
            variant={"primary"}
            className={`${theme.content_bg} rounded-full`}
          >
            Ok
          </Button>
        </p>
      </div>
    </div>
  );
}

export default TimerModal;
