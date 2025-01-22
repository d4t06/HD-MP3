import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/store";
import { useTheme } from "@/store/ThemeContext";
import ToastItem from "./_components/ToastItem";

interface Props {
  time?: number;
  autoClose: boolean;
  variant: "dashboard" | "client";
}

const ToastPortal = ({ time = 6000, autoClose, variant }: Props) => {
  const { setToasts, toasts } = useToast();
  const { theme } = useTheme();
  const [removing, setRemoving] = useState("");

  const removeToast = (id: string) => {
    setToasts((t) => t.filter((toast) => toast.id != id));
  };

  useEffect(() => {
    if (removing) {
      // console.log("set toast");
      setToasts((t) => t.filter((toast) => toast.id != removing));
    }
  }, [removing]);

  // problem
  // 3 time add toast => run useEffect 3 times, generate setToast time out 3 in background
  // when each setToast time out finish
  // toasts change lead to useEffect run trigger setToast time out after that;
  useEffect(() => {
    if (!autoClose || !toasts.length) return;
    // console.log("run main useEffect");

    const id = toasts[toasts.length - 1].id;
    setTimeout(() => {
      // console.log("run time out check id ", id);
      setRemoving(id);
    }, time);
  }, [toasts]);

  const classes = {
    container: `toast-portal fixed z-[199] bottom-[20px] ${variant === "client" ? "left-[20px]" : "right-[20px]"} max-[549px]:bottom-[unset] max-[540px]:top-[10px] max-[540px]:right-[10px]`,
  };

  return (
    <>
      {createPortal(
        <div className={classes.container}>
          <div className="flex flex-col gap-[10px]">
            {!!toasts.length &&
              toasts.map((toast, index) => (
                <ToastItem
                  onClick={removeToast}
                  key={index}
                  theme={theme}
                  toast={toast}
                />
              ))}
          </div>
        </div>,
        document.getElementById("portals")!,
      )}
    </>
  );
};

export default ToastPortal;
