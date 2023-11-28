import {
   useFloating,
   autoUpdate,
   offset,
   FloatingFocusManager,
   useClick,
   useDismiss,
   useRole,
   useInteractions,
   UseFloatingOptions,
} from "@floating-ui/react";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
   isOpen: boolean;
   setIsOpen: Dispatch<SetStateAction<Boolean>>;
   children: ReactNode;
   reference: ReactNode
}

function MyFloatingUI({ isOpen, setIsOpen, children, reference }: Props) {
   const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: "bottom-end",
      middleware: [offset(6)],
      whileElementsMounted: autoUpdate,
   });

   const click = useClick(context);
   const dismiss = useDismiss(context);
   const role = useRole(context);
   const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

   return (
      <>
      <reference />
         {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
               <div
                  className="z-[99] floating-ui"
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
               >
                  {children}
               </div>
            </FloatingFocusManager>
         )}
      </>
   );
}

export default MyFloatingUI;
