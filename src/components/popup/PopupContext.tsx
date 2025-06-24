"use client";

import { createContext, ReactNode, useContext, useRef, useState } from "react";

// context
type PopupProps = {
   appendOnPortal?: boolean;
};

const usePopup = ({ appendOnPortal }: PopupProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const [isMounted, setIsMounted] = useState(false);

   const triggerRef = useRef<HTMLButtonElement | null>(null);
   const contentRef = useRef<HTMLDivElement | null>(null);

   const setTriggerRef = (ele: HTMLButtonElement) => {
      triggerRef.current = ele;
   };

   const setContentRef = (ele: HTMLDivElement) => {
      contentRef.current = ele;
   };

   const close = () => {
      setIsMounted(false);
   };

   const toggle = () => {
      if (isMounted) setIsMounted(false);
      if (!isOpen) setIsOpen(true);
   };

   return {
      refs: { triggerRef, contentRef },
      setTriggerRef,
      setContentRef,
      state: { isMounted, isOpen },
      setIsMounted,
      setIsOpen,
      appendOnPortal,
      close,
      toggle,
   };
};

type ContextType = ReturnType<typeof usePopup>;

const Context = createContext<ContextType | null>(null);

export const usePopoverContext = () => {
   const context = useContext(Context);

   if (context) return context;
   else return {} as ContextType;
};

export default function Popup({
   children,
   appendOnPortal,
   className = "",
   ...rest
}: { children: ReactNode; className?: string } & PopupProps) {
   return (
      <Context.Provider value={usePopup({ ...rest, appendOnPortal })}>
         {!appendOnPortal ? (
            <div className={`relative ${className}`}>{children}</div>
         ) : (
            children
         )}
      </Context.Provider>
   );
}
