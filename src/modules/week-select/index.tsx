import useWeekSelect from "./useWeekSelect";
import {
  PopupWrapper,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
} from "@/components";
import VerticalMenu from "@/components/popup/VerticalMenu";
import WeekList from "./WeekList";

type Props = {
  submit: (value: string) => void;
};

export default function WeekSelect(props: Props) {
  const { weekOptions, currentIndex, currentWeekData, setCurrentIndex } =
    useWeekSelect(props);

  return (
    <MyPopup appendOnPortal>
      <MyPopupTrigger>
        <button
          className={`py-2 text-sm font-semibold px-4 rounded-full bg-[--a-5-cl]`}
        >
          {currentWeekData?.label}
        </button>
      </MyPopupTrigger>

      <MyPopupContent position="right-bottom" origin="top left">
        <PopupWrapper>
          <VerticalMenu className="w-[160px] h-[30vh] overflow-auto">
            <WeekList
              weekOptions={weekOptions}
              currentIndex={currentIndex}
              submit={(i) => {
                setCurrentIndex(i);
                props.submit(weekOptions[i].value);
              }}
            />
          </VerticalMenu>
        </PopupWrapper>
      </MyPopupContent>
    </MyPopup>
  );
}
