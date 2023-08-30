import { MouseEvent, useEffect, useRef, useState } from "react";

type Props = {
   label : string;
   autoScroll?: boolean;
}

export default function ScrollText({label, autoScroll} : Props) {

   const nameWrapper = useRef<HTMLDivElement>(null)
   const name = useRef<HTMLDivElement>(null)

   const [isScroll, setIsScroll] = useState(false)

   const handleScrollText = (e : MouseEvent<HTMLDivElement>) => {
      if (isScroll) return;

      const node = e.target as HTMLElement
      const wrapperNode = nameWrapper.current as HTMLElement
      let distance = node.offsetWidth - wrapperNode.offsetWidth

      if (distance <= 0) return;
      setIsScroll(true);
      const songName = node.innerText;

      node.innerHTML = songName + "&nbsp; &nbsp; &nbsp;" + songName
      distance += node.offsetWidth / 2 ;

      const duration = (distance / 50).toFixed(1)

      node.style.transition = `transform linear ${duration}s`
      node.style.transform = `translateX(-${distance}px)`

      setTimeout(() => {
      node.style.transition = `none`
      node.style.transform = `translateX(0)`
      node.innerText = songName;
      setIsScroll(false)
      }, +duration * 1000)
   }

   return (
      <div onClick={(e) => handleScrollText(e)} ref={nameWrapper} className="name-container overflow-hidden scroll-smooth relative h-[32px]">
         <h2
            ref={name}
            className="absolute left-0 text-2xl font-bold whitespace-nowrap pr-[20px] line-clamp-1"
         >
            {label || "Some song"}
         </h2>
      </div>
   );
}
