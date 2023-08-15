import { useEffect } from "react";

const useScrollIntoView = (node: HTMLElement, containerEle: HTMLElement, active: boolean) => {

   useEffect(() => {
      if (active) {
         const windowWidth = window.innerWidth;

         const rect = node.getBoundingClientRect();

         const lefDiff = rect.left;
         const rightDiff = windowWidth - (lefDiff + node.offsetWidth);

         const needToScroll = Math.abs(lefDiff - rightDiff) / 2;

         if (Math.abs(lefDiff) > windowWidth ||
            Math.abs(rightDiff) > windowWidth) {

            containerEle.style.scrollBehavior = 'auto';
         } else {
            containerEle.style.scrollBehavior = 'smooth';
         }

         // on the left side
         if (rightDiff > lefDiff) {

            setTimeout(() => {
               containerEle.scrollLeft = containerEle.scrollLeft - needToScroll;
            }, 300);

            // on the right side
         } else if (rightDiff < lefDiff) {
            setTimeout(() => {
               containerEle.scrollLeft = containerEle.scrollLeft + needToScroll;
            }, 300);
         }
      }
   }, [active]);
}

export default useScrollIntoView