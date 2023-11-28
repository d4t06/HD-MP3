import {
   useFloating,
   autoUpdate,
   offset,
   useClick,
   useDismiss,
   useRole,
   useInteractions,
   Placement,
   FloatingFocusManager,
} from "@floating-ui/react";
import { ReactNode, createContext, useContext, useState } from "react";

interface PopoverOptions {
   initialOpen?: boolean;
   placement?: Placement;
   modal?: boolean;
   isOpen?: boolean;
   setIsOpen?: (open: boolean) => void;
}

export function usePopover({ placement = "bottom" }: PopoverOptions = {}) {
   const [isOpen, setIsOpen] = useState(false);
   const { context, floatingStyles, refs } = useFloating({
      placement,
      open: isOpen,
      onOpenChange: setIsOpen,
      whileElementsMounted: autoUpdate,
      middleware: [
         offset(6),
         // flip({
         //    crossAxis: placement.includes("-"),
         //    fallbackAxisSideDirection: "end",
         //    padding: 5,
         // }),
         // shift({ padding: 5 }),
      ],
   });
   const click = useClick(context);
   const dismiss = useDismiss(context, {escapeKey: false, outsidePress: true});
   const role = useRole(context);

   const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role]);

   return {
      isOpen,
      setIsOpen,
      getFloatingProps,
      getReferenceProps,
      floatingStyles,
      refs,
      context,
   };
}

const PopoverContext = createContext<ReturnType<typeof usePopover> | null>(null);

const usePopoverContext = () => {
   const context = useContext(PopoverContext);
   if (context == null) {
      throw new Error("Popover components must be wrapped in <Popover />");
   }
   return context;
};

export function Popover({
   children,
   ...restOptions
}: {
   children: ReactNode;
} & PopoverOptions) {
   const popover = usePopover({ ...restOptions });
   return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

export function PopoverTrigger({
   children,
   className,
   ...props
}: {
   children: ReactNode;
   className?: string;
}) {
   const { getReferenceProps, refs, isOpen } = usePopoverContext();

   return (
      <button
         ref={refs.setReference}
         data-state={isOpen ? "open" : "closed"}
         className={className ?? ''}
         {...getReferenceProps(props)}
      >
         {children}
      </button>
   );
}

export function PopoverContent({
   children,
   className,
   ...props
}: {
   className?: string;
   children: ReactNode;
}) {
   const { context, refs, getFloatingProps, floatingStyles, isOpen } = usePopoverContext();

   if (!isOpen) return;

   return (
      <FloatingFocusManager context={context} modal={false}>
         <div ref={refs.setFloating} style={{ ...floatingStyles }} {...getFloatingProps(props)}>
            {children}
         </div>
      </FloatingFocusManager>
   );
}
