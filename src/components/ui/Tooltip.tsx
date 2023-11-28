import {
   useFloating,
   autoUpdate,
   offset,
   useDismiss,
   useRole,
   useInteractions,
   Placement,
   FloatingFocusManager,
   useHover,
} from "@floating-ui/react";
import { HTMLProps, ReactNode, createContext, useContext, useState } from "react";
import { useTheme } from "../../store";

interface TooltipOptions {
   initialOpen?: boolean;
   placement?: Placement;
   open?: boolean;
   onOpenChange?: (open: boolean) => void;
}

export function useTooltip({ placement = "bottom" }: TooltipOptions = {}) {
   const [isOpen, setIsOpen] = useState(false);
   const { context, floatingStyles, refs } = useFloating({
      placement,
      open: isOpen,
      onOpenChange: setIsOpen,
      whileElementsMounted: autoUpdate,
      middleware: [
         offset(10),
         // flip({
         //    crossAxis: placement.includes("-"),
         //    fallbackAxisSideDirection: "end",
         //    padding: 5,
         // }),
         // shift({ padding: 5 }),
      ],
   });
   const hover = useHover(context, {
      move: false,
      // enabled: true,
   });
   const dismiss = useDismiss(context);
   const role = useRole(context, { role: "tooltip" });

   const { getFloatingProps, getReferenceProps } = useInteractions([hover, dismiss, role]);

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

const TooltipContext = createContext<ReturnType<typeof useTooltip> | null>(null);

const useTooltipContext = () => {
   const context = useContext(TooltipContext);
   if (context == null) {
      throw new Error("Popover components must be wrapped in <Popover />");
   }
   return context;
};

export function Tooltip({
   children,
   ...restOptions
}: {
   children: ReactNode;
} & TooltipOptions) {
   const Tooltip = useTooltip({ ...restOptions });
   return <TooltipContext.Provider value={Tooltip}>{children}</TooltipContext.Provider>;
}

interface TiggerProps extends HTMLProps<HTMLElement> {
   children: ReactNode;
}

export function TooltipTrigger({
   children,
   ...props
}: TiggerProps) {
   const { getReferenceProps, refs, isOpen } = useTooltipContext();

   return (
      <button
         ref={refs.setReference}
         data-state={isOpen ? "open" : "closed"}
         {...getReferenceProps(props)}
      >
         {children}
      </button>
   );
}

export function TooltipContent({
   children,
   className,
   ...props
}: {
   className?: string;
   children: ReactNode;
}) {
   const {theme} = useTheme()

   const { context, refs, getFloatingProps, floatingStyles, isOpen } = useTooltipContext();

   const classes = {
      container: `${theme.type === 'dark' ? 'bg-[#fff] text-[#000]' : 'bg-[#222] text-white'}`
   }

   if (!isOpen) return;

   return (
      <FloatingFocusManager context={context} modal={false}>
         <div className={`${classes.container} text-[13px] px-[8px] py-[2px] rounded-[4px]`} ref={refs.setFloating} style={{ ...floatingStyles }} {...getFloatingProps(props)}>
            {children}
         </div>
      </FloatingFocusManager>
   );
}
