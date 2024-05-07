import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import { PopupWrapper } from ".";
import { useTheme } from "../store";

interface Props {
   children: ReactNode;
   closeModal: () => void;
   classNames?: string;
}

// Thường không khai báo width qua prop của Modal
// mà khai báo trong từng children

const Modal: FC<Props> = ({ children, closeModal, classNames }) => {
   const { theme } = useTheme();

   return (
      <>
         {createPortal(
            <div className="fixed inset-0 z-[99]">
               <div
                  onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     closeModal();
                  }}
                  className="absolute bg-black opacity-60 inset-0 z-[90]"
               ></div>
               <div className="absolute z-[99] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <PopupWrapper className={classNames || ""} theme={theme}>
                     {children}
                  </PopupWrapper>
               </div>
            </div>,
            document.getElementById("portals")!
         )}
      </>
   );
};

export default Modal;
