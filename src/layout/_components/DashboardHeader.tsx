import { useTheme } from "@/store";

import { Link } from "react-router-dom";
import NavigationButton from "@/components/NavigationButton";
import NavigationProvider from "@/store/NavigationContext";
import { useEffect, useState, useRef } from "react";
import MyPopup, { MyPopupContent, MyPopupTrigger, TriggerRef } from "@/components/MyPopup";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import Modal, { ModalRef } from "@/components/Modal";
import { AppInfo, Appearance, SettingMenu } from "@/components";

type Modal = "theme" | "info";

export default function DashboardHeader() {
  const { theme } = useTheme();

  const [scroll, setScroll] = useState(0);
  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);
  const triggerRef = useRef<TriggerRef>(null);

  const openModal = (m: Modal) => {
    setModal(m);

    triggerRef.current?.close();
    modalRef.current?.open();
  };

  const closeModal = () => modalRef.current?.close();

  const handleScroll = (e: Event) => {
    const scrollTop = (e.target as Element).scrollTop || 0;
    setScroll(scrollTop);
  };

  const renderModal = () => {
    switch (modal) {
      case "":
        return <></>;
      case "theme":
        return <Appearance close={closeModal} />;
      case "info":
        return <AppInfo close={closeModal} />;
    }
  };

  useEffect(() => {
    const mainContainer = document.querySelector(".main-container");

    mainContainer?.addEventListener("scroll", handleScroll);

    return () => {
      mainContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`"px-[10px] md:px-[40px] h-[60px] flex-shrink-0 flex items-center justify-between ${scroll ? " shadow-lg" : ""}`}
      >
        <div className="flex">
          <Link to={"/dashboard"} className="text-xl font-[500]">
            HD
            <span className={`${theme.content_text} ml-[4px] uppercase`}>Dashboard</span>
          </Link>

          <NavigationProvider>
            <NavigationButton className="ml-5" />
          </NavigationProvider>
        </div>

        <div className="flex">
          <MyPopup>
            <MyPopupTrigger ref={triggerRef}>
              <button
                className={`flex p-2 items-center rounded-full bg-${theme.alpha} ${theme.content_hover_bg}`}
              >
                <AdjustmentsHorizontalIcon className="w-5" />
              </button>
            </MyPopupTrigger>
            <MyPopupContent
              appendTo="parent"
              className="top-[calc(100%+8px)] right-0"
              animationClassName="origin-top-right"
            >
              <SettingMenu openModal={openModal} variant="dashboard" />
            </MyPopupContent>
          </MyPopup>
        </div>
      </div>

      <Modal ref={modalRef} variant="animation">
        {renderModal()}
      </Modal>
    </>
  );
}
