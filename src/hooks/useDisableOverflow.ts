import { useEffect } from "react";

type Props = {
   isOpenFullScreen: boolean;
};
export default function useDisableOverflow({ isOpenFullScreen }: Props) {
   const handleOverflow = () => {
      const body = document.querySelector("body");
      if (body) {
         if (isOpenFullScreen) body.style.overflow = "hidden";
         else body.style.overflow = "auto";
      }
   };
   useEffect(() => {
      handleOverflow();
   }, [isOpenFullScreen]);
}
