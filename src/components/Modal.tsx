import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { createPortal } from "react-dom";
import Button from "./ui/Button";
import { ThemeType } from "../types";

interface Props {
  children: ReactNode;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const confirmModal = ({
  loading,
  theme,
  callback,
  label,
  setOpenModal,
}: {
  callback: () => void;
  label: string;
  loading: boolean;
  theme: ThemeType & { alpha: string };
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="w-[30vw]">
      <h1 className="text-[20px] font-semibold">{label}</h1>
      <p className="text-[red] text-[18px]">This action cannot be undone</p>

      <div className="flex gap-[10px] mt-[20px]">
        <Button
          isLoading={loading}
          className={`${theme.content_bg} rounded-full text-[14px]`}
          variant={"primary"}
          onClick={() => callback()}
        >
          Xóa mẹ nó đi !
        </Button>
        <Button
          onClick={() => setOpenModal(false)}
          className={`bg-${theme.alpha} rounded-full text-[14px]`}
          variant={"primary"}
        >
          Khoan từ từ
        </Button>
      </div>
    </div>
  );
};

const Modal: FC<Props> = ({ children, setOpenModal }) => {
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
            {children}
          </div>
        </div>,
        document.getElementById("portals")!
      )}
    </>
  );
};

export default Modal;
export { confirmModal };
