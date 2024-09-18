import {
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { AppInfo, Appearance, Avatar, ConfirmModal, Modal } from "..";
import { useAuthStore, useTheme } from "@/store";
import { MobileLinkSkeleton } from "../skeleton";
import { useMemo, useRef, useState } from "react";
import { useAuthActions } from "@/store/AuthContext";
import { ModalRef } from "../Modal";

type Modal = "theme" | "info" | "logout";

export default function MobileSetting() {
  const { theme } = useTheme();
  const { loading: userLoading, user } = useAuthStore();
  const modalRef = useRef<ModalRef>(null);

  //    hooks
  const { logOut } = useAuthActions();

  const [modal, setModal] = useState<Modal | "">("");

  const closeModal = () => modalRef.current?.toggle();

  const openModal = (modal: Modal) => {
    setModal(modal);
    modalRef.current?.toggle();
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log("signOut error", { messsage: error });
    } finally {
      closeModal();
    }
  };

  const renderModal = useMemo(() => {
    switch (modal) {
      case "theme":
        return <Appearance close={closeModal} />;
      case "info":
        return <AppInfo close={closeModal} />;
      case "logout":
        return (
          <ConfirmModal
            close={closeModal}
            callback={handleSignOut}
            loading={false}
            theme={theme}
            label="Log out ?"
          />
        );
    }
  }, [modal]);

  // define styles
  const classes = {
    linkItem: `py-[10px] w-full border-b border-${theme.alpha} space-x-2 last:border-none flex items-center`,
    icon: `w-6`,
  };

  return (
    <>
      <div className="pb-[30px]">
        <div className="text-xl font-playwriteCU leading-[2.2] mb-3">Setting</div>

        {user && (
          <div className={`bg-${theme.alpha} p-3 rounded-md flex mb-2`}>
            <Avatar className="h-[65px] w-[65px]" />
            <div className="ml-3">
              <p className="text-lg font-[500]">{user ? user.display_name : "Guest"}</p>
              <p className="opacity-70 font-[500]">Vip member 💗</p>
            </div>
          </div>
        )}

        {userLoading ? (
          [...Array(3).keys()].map(() => MobileLinkSkeleton)
        ) : (
          <>
            <button className={classes.linkItem} onClick={() => openModal("theme")}>
              <PaintBrushIcon className={classes.icon} />
              <span>Theme</span>
            </button>

            <button className={classes.linkItem} onClick={() => openModal("info")}>
              <InformationCircleIcon className={classes.icon} />
              <span>Info</span>
            </button>

            {user && (
              <button className={classes.linkItem} onClick={() => openModal("logout")}>
                <ArrowRightOnRectangleIcon className={classes.icon} />
                <span>Logout</span>
              </button>
            )}
          </>
        )}
      </div>

      {
        <Modal ref={modalRef} variant="animation">
          {renderModal}
        </Modal>
      }
    </>
  );
}