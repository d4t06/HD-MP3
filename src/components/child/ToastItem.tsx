import {
   CheckCircleIcon,
   ExclamationCircleIcon,
   XCircleIcon,
} from "@heroicons/react/24/outline";
;

type Props = {
   toast: Toast;
   theme: ThemeType & { alpha: string };
   onClick?: (id: string) => void;
};

export default function ToastItem({ toast, theme, onClick }: Props) {
   const classes = {
      icon: `w-[30px] max-[549px]:w-[25px]`,
      container: `text-white px-[12px] py-[6px] rounded-[4px] flex items-center  ${theme.side_bar_bg} border border-${theme.alpha}`,
      text: `font-[500] text-[14px] max-[549px]:text-[14px] ${
         theme.type === "light" ? "text-[#333]" : ""
      }`,
   };

   return (
      <div
         onClick={() => (onClick ? onClick(toast.id) : undefined)}
         className={`${classes.container} animate-[fadeIn_0.3s_linear]`}
      >
         {toast.title && (
            <span className="mr-[10px]">
               {toast.title === "success" && (
                  <CheckCircleIcon className={`${classes.icon} text-emerald-500 `} />
               )}
               {toast.title === "error" && (
                  <XCircleIcon className={`${classes.icon} text-red-500`} />
               )}
               {toast.title === "warning" && (
                  <ExclamationCircleIcon className={`${classes.icon} text-yellow-500`} />
               )}
            </span>
         )}
         <p className={classes.text}>{toast.desc}</p>
      </div>
   );
}
