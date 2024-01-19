import { useTheme } from "../../store";

type Props = {
   cb: () => void;
   active: boolean;
   size?: "default" | "thin";
};

export default function Switch({ cb, active, size = "default" }: Props) {
   const { theme } = useTheme();

   const classes = {
      circle: `${
         size === "default" ? "w-[20px] h-[20px]" : "w-[16px] h-[16px]"
      }  absolute bg-white left-[3px] rounded-[50%] transition-transform top-[50%] translate-y-[-50%]`,
   };

   return (
      <div
         onClick={cb}
         className={`relative  ${size === "default" ? "h-[24px]" : "h-[20px]"} rounded-[99px] w-[40px]  ${
            active ? theme.content_bg : "bg-" + theme.alpha
         }`}
      >
         <div className={`${classes.circle} ${active ? "translate-x-[14px]" : "translate-x-[0]"}`}></div>
      </div>
   );
}
