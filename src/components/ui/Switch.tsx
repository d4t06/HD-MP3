import { useThemeContext } from "@/stores";

type Props = {
   cb: () => void;
   active: boolean;
   size?: "default" | "thin";
   className?: string;
};

export default function Switch({ cb, active, className, size = "default" }: Props) {
   const { theme } = useThemeContext();

   const classes = {
      circle: `${
         size === "default" ? "w-[20px] h-[20px]" : "w-[16px] h-[16px]"
      }  absolute bg-white left-[3px] rounded-[50%] transition-transform top-[50%] translate-y-[-50%]`,
      active: `${size === "default" ? "translate-x-[14px]" : "translate-x-[18px]"} `,
      inActive: "translate-x-[0]",
   };

   return (
      <div
         onClick={cb}
         className={`relative  cursor-pointer ${
            size === "default" ? "h-[24px]" : "h-[20px]"
         } rounded-[99px] w-[40px] ${className || ""} 
         ${active ? theme.content_bg : "bg-" + theme.alpha} `}
      >
         <div
            className={`${classes.circle} ${active ? classes.active : classes.inActive}`}
         ></div>
      </div>
   );
}
