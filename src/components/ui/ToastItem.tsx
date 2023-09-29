import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ThemeType, Toast } from "../../types";

type Props = {
   toast: Toast;
   theme: ThemeType & {alpha: string};
};

export default function ToastItem({ toast, theme }: Props) {
   const classes = {
      icon: `w-[30px] max-[549px]:w-[25px]`,
      container: `text-white px-[20px] py-[10px] rounded-[4px] flex items-center  ${theme.bottom_player_bg} border border-${theme.alpha}`,
      text: `font-[500] text-[16px] max-[549px]:text-[14px]`
   };

   return (
      <div className={`${classes.container} animate-[fadeIn_0.3s_linear]`}>
         <span className="mr-[10px]">
            {toast.title === "success" && <CheckCircleIcon className={`${classes.icon} text-emerald-500 `} />}
            {toast.title === "error" && <XCircleIcon className={`${classes.icon} text-red-500`} />}
            {toast.title === "warning" && <ExclamationCircleIcon className={`${classes.icon} text-yellow-500`} />}
         </span>
         <p className={classes.text}>{toast.desc}</p>
      </div>
   );
}
