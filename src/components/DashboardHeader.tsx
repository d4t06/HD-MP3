import { useTheme } from "../store";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebase";

import { useMemo, useRef, useState } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { AppInfo, Appearance, Button, ConfirmModal, Modal, SettingMenu } from ".";

import { useAuthActions } from "@/store/AuthContext";
import { Link } from "react-router-dom";
import { ModalRef } from "./Modal";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "./MyPopup";

type Modal = "logout" | "info" | "theme";

export default function DashboardHeader() {
  const { theme } = useTheme();
//   const [loggedInUser] = useAuthState(auth);

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  // hook
  const { logOut } = useAuthActions();

  const closeModal = () => modalRef.current?.toggle();
  const openModal = (modal: Modal) => setModal(modal);

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
      case "":
        return <></>;
      case "logout":
        return (
          <ConfirmModal
            callback={handleSignOut}
            close={closeModal}
            loading={false}
            theme={theme}
            label="Log out ?"
          />
        );
      case "info":
        return <AppInfo close={closeModal} />;
      case "theme":
        <Appearance close={closeModal} />;
        return;
    }
  }, [modal]);

  const classes = {
    header: `${theme.side_bar_bg} fixed top-0 w-full z-[99]`,
    container: "container flex justify-between items-center h-[60px]",
  };

  return (
    <>
      <div className={`${classes.header}`}>
        <div className={classes.container}>
          <Link to={"/dashboard"} className="text-[24px] font-semibold">
            HD
            <span className={`${theme.content_text} ml-[4px] uppercase`}>Dashboard</span>
          </Link>

          {/* <div className="flex items-center"> */}
          {/* {loggedInUser?.displayName && (
              <p className="text-[14px] mr-[8px]">{loggedInUser.displayName}</p>
            )} */}

          <MyPopup>
            <MyPopupTrigger>
              <Button
                size={"clear"}
                variant={"circle"}
                className={`p-2 ${theme.content_hover_bg} bg-${theme.alpha}`}
              >
                <Cog6ToothIcon className="w-6" />
              </Button>
            </MyPopupTrigger>

            <MyPopupContent
              className="top-[calc(100%+8px)] right-0"
              animationClassName="origin-top-right"
              appendTo="parent"
            >
              <SettingMenu loggedIn={false} openModal={openModal} />
            </MyPopupContent>
          </MyPopup>
        </div>
      </div>
      {/* </div> */}

      <Modal variant="animation" ref={modalRef}>
        {renderModal}
      </Modal>
    </>
  );
}
