import { FC, useEffect, useRef } from "react";

interface Props {
   children: string;
   active: boolean
   done: boolean,
   firstTimeRender?: boolean
}

const LyricItem: FC<Props> = ({ children, active, done, firstTimeRender }) => {
   const lyricRef = useRef<HTMLLIElement>(null)

   useEffect(() => {
      if (active) {
         const node = lyricRef.current as HTMLElement;         
      
         node.scrollIntoView({ behavior: firstTimeRender ? "instant" : 'smooth' , block: "center" })
      }
   }, [active])

   return <li ref={lyricRef} className={`px=[20px] text-[40px] max-[549px]:text-[24px] font-bold ${active ? 'text-indigo-600' : ''} ${done ? 'opacity-60' : ''}`}>{children}</li>
}

export default LyricItem;