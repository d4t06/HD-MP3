import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { createPortal } from "react-dom";

interface Props  {
   children: ReactNode,
   setOpenModal:  Dispatch<SetStateAction<boolean>>
}

const Modal: FC<Props> = ({ children, setOpenModal }) => {
   return (
      <>
         {createPortal(
            <div className="fixed inset-0">
               <div onClick={() => setOpenModal(false)} className="absolute bg-black opacity-60 inset-0 z-40"></div>
               <div className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{children}</div>
            </div>,
            document.getElementById("portals")!
         )}
      </>
   );
};


export default Modal;