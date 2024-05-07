import { CheckCircleIcon } from "@heroicons/react/24/outline";
;

type Props = {
   theme: ThemeType;
   onClick: (theme: ThemeType) => void;
   active: boolean;
};

export default function ThemeItem({ onClick, theme, active }: Props) {
   return (
      <>
         <div className="w-[25%] px-[10px] max-[549px]:w-[50%]">
            <div
               onClick={() => onClick(theme)}
               className={`relative border-l-[20px] ${theme.content_border} pt-[100%] rounded-xl ${
                  theme.side_bar_bg
               } ${active ? theme.content_border : ""}`}
            >
               {active && (
                  <div className="absolute bottom-[10px] right-[10px]">
                     <CheckCircleIcon className={`${theme.content_text} w-[25px]`} />
                  </div>
               )}
            </div>
            <p className="text-[14px] mt-[6px]">{theme.name}</p>
         </div>
      </>
   );
}
