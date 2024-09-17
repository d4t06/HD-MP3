import {
  ArrowRightOnRectangleIcon,
  InformationCircleIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { AppInfo, Appearance, Avatar, ConfirmModal, Modal } from "..";
import { useAuthStore, useTheme } from "@/store";
import { MobileLinkSkeleton } from "../skeleton";
import { useMemo, useState } from "react";
import { useAuthActions } from "@/store/AuthContext";

type Modal = "theme" | "info" | "logout";

export default function MobileSetting() {
  const { theme } = useTheme();
  const { loading: userLoading, user } = useAuthStore();

  //    hooks
  const { logOut } = useAuthActions();

  const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

  const closeModal = () => setIsOpenModal("");

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
    switch (isOpenModal) {
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
  }, [isOpenModal]);

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
            <button className={classes.linkItem} onClick={() => setIsOpenModal("theme")}>
              <PaintBrushIcon className={classes.icon} />
              <span>Theme</span>
            </button>

            <button className={classes.linkItem} onClick={() => setIsOpenModal("info")}>
              <InformationCircleIcon className={classes.icon} />
              <span>Info</span>
            </button>

            {user && (
              <button
                className={classes.linkItem}
                onClick={() => setIsOpenModal("logout")}
              >
                <ArrowRightOnRectangleIcon className={classes.icon} />
                <span>Logout</span>
              </button>
            )}
          </>
        )}
      </div>

      {isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
    </>
  );
}
