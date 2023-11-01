import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { createPortal } from "react-dom";
import Button from "./ui/Button";
import { ThemeType } from "../types";
import { PopupWrapper } from ".";

const confirmModal = ({
   loading,
   theme,
   callback,
   label,
   setOpenModal,
   buttonLabel,
   desc,
   className,
}: {
   callback: () => void;
   label?: string;
   desc?: string;
   buttonLabel?: string;
   loading: boolean;
   theme: ThemeType & { alpha: string };
   className?: string;
   setOpenModal?: Dispatch<SetStateAction<boolean>>;
}) => {
   return (
      <div className={className || "w-[30vw] relative"}>
         <h1 className="text-[20px] text-red-500 font-semibold">
            {label || "Wait a minute"}
         </h1>
         <p className=" text-[16px]">{desc}</p>

         <div className="flex gap-[10px] mt-[20px]">
            <Button
               isLoading={loading}
               className={` bg-${theme.alpha} hover:bg-red-500 rounded-full text-[14px]`}
               variant={"primary"}
               onClick={callback}
            >
               {buttonLabel || "Yes please"}
            </Button>
            <Button
               onClick={() => setOpenModal && setOpenModal(false)}
               className={`${theme.content_bg} rounded-full text-[14px]`}
               variant={"primary"}
            >
               Close
            </Button>
         </div>
      </div>
   );
};

interface Props {
   children: ReactNode;
   setOpenModal: Dispatch<SetStateAction<boolean>>;
   theme: ThemeType & { alpha: string };
   classNames?: string;
}

const Modal: FC<Props> = ({ children, setOpenModal, theme, classNames }) => {
   return (
      <>
         {createPortal(
            <div className="fixed inset-0 z-[99]">
               <div
                  onClick={(e) => {
                     e.stopPropagation;
                     setOpenModal(false);
                  }}
                  className="absolute bg-black opacity-60 inset-0 z-[90]"
               ></div>
               <div className="absolute z-[99] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <PopupWrapper classNames={classNames} theme={theme}>{children}</PopupWrapper>
               </div>
            </div>,
            document.getElementById("portals")!
         )}
      </>
   );
};

export default Modal;
export { confirmModal };
