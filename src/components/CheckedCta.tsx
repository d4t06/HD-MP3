import { StopIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { Button } from ".";

type Base = {
   children: ReactNode;
   reset: () => void;
};

type SelectAll = Base & {
   location: "my-playlist" | "my-songs" | "admin-playlist";
   selectAll: () => void;
};

type NoSelectAll = Base & {
   location: "home";
};

type Props = SelectAll | NoSelectAll;

export default function CheckedCta({ children, reset, ...props }: Props) {
   switch (props.location) {
      case "home":
         return (
            <>
               {children}

               <Button onClick={reset} className={`px-[5px] flex-shrink-0`}>
                  <XMarkIcon className="w-[20px]" />
               </Button>
            </>
         );

      case "my-playlist":
      case "my-songs":
      case "admin-playlist":
         return (
            <>
               <button onClick={props.selectAll} className="ml-[10px]">
                  <StopIcon className="w-[18px]" />
               </button>

               {children}

               <Button onClick={reset} className={`px-[5px] flex-shrink-0`}>
                  <XMarkIcon className="w-[20px]" />
               </Button>
            </>
         );
   }
}
