import { useThemeContext } from "@/stores";
import useWeekSelect from "./useWeekSelect";
import {
  MenuWrapper,
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
  const { theme } = useThemeContext();

  const { weekOptions, currentIndex, currentWeekData, setCurrentIndex } =
    useWeekSelect(props);

  return (
    <MyPopup appendOnPortal>
      <MyPopupTrigger>
        <button
          className={`py-2 text-sm font-semibold px-4 rounded-full bg-${theme.alpha}`}
        >
          {currentWeekData?.label}
        </button>
      </MyPopupTrigger>

      <MyPopupContent position="right-bottom" origin="top left">
        <MenuWrapper>
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
        </MenuWrapper>
      </MyPopupContent>
    </MyPopup>
  );
}
