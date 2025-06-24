import { ComponentProps, useEffect, useRef } from "react";
import { usePopoverContext } from "./PopupContext";
import { MyPopupContent } from "./MyPopup";

export default function usePopupContent(
   props: ComponentProps<typeof MyPopupContent>,
) {
   const {
      state: { isOpen },
      refs,
      close,
      appendOnPortal,
   } = usePopoverContext();

   const animationRef = useRef<HTMLDivElement>(null);

   //    use for append on portal only
   const setContentPos = () => {
      const { origin = "top right", position, spacer = 8 } = props;

      const triggerEle = refs.triggerRef.current;
      const contentEle = refs.contentRef.current;
      const animationEle = animationRef.current;

      if (!triggerEle || !contentEle) return;

      const triggerRect = triggerEle.getBoundingClientRect();

      // default is left bottom
      const contentPos = {
         top: triggerRect.top + triggerEle.clientHeight,
         left: triggerRect.left - contentEle.clientWidth - spacer,
      };

      if (appendOnPortal) {
         contentPos.top = triggerRect.top + triggerEle.clientHeight + spacer;

         switch (position) {
            // case "left-bottom": {}
            case "right-bottom":
               contentPos.left = triggerRect.left + spacer;
               break;
         }

         const isOverScreenHeight =
            contentPos.top + contentEle.clientHeight > window.innerHeight - 90;
         if (isOverScreenHeight) {
            let newTop =
               contentPos.top -
               contentEle.clientHeight -
               triggerEle.clientHeight;

            if (newTop - 60 < 0) newTop = 60;

            contentPos.top = newTop;
         }

         if (animationEle) {
            let finalOrigin = origin;

            if (isOverScreenHeight) finalOrigin = "bottom right";

            animationEle.style.transformOrigin = finalOrigin;
         }
      }

      contentEle.style.left = `${contentPos.left}px`;
      contentEle.style.top = `${contentPos.top}px`;
   };

   const handleWheel: EventListener = close;

   useEffect(() => {
      if (!appendOnPortal) return;

      if (isOpen) setContentPos();
      else return;

      const mainContainer = document.querySelector(".main-container");
      if (!mainContainer) return;

      mainContainer.addEventListener("wheel", handleWheel);

      return () => {
         if (mainContainer)
            mainContainer.removeEventListener("wheel", handleWheel);
      };
   }, [isOpen]);

   return { animationRef };
}
