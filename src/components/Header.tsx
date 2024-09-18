import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import {
  AppInfo,
  Appearance,
  Avatar,
  ConfirmModal,
  Skeleton,
  Modal,
  SettingMenu,
  PopupWrapper,
} from ".";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuthActions } from "@/store/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { ModalRef } from "./Modal";
import MyPopup, { MyPopupContent, MyPopupTrigger, TriggerRef } from "./MyPopup";

export type HeaderModal = "theme" | "info" | "confirm";

function Header({ contentRef }: { contentRef: RefObject<HTMLDivElement> }) {
  const { theme } = useTheme();

  //  state
  const [scroll, setScroll] = useState(0);
  const [loggedInUser, loading] = useAuthState(auth);
  const [modal, setModal] = useState<HeaderModal | "">("");
  // const [isOpenMenu, setIsOpenMenu] = useState(false);
  const triggerRef = useRef<TriggerRef>(null);

  const modalRef = useRef<ModalRef>(null);

  //  use hooks
  const { logOut, logIn } = useAuthActions();

  const openModal = (modal: HeaderModal) => {
    setModal(modal);
    modalRef.current?.toggle();

    // setIsOpenMenu(false);
    triggerRef.current?.close();
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log("signOut error", { messsage: error });
    } finally {
      modalRef.current?.toggle();
    }
  };

  //   methods
  const handleLogIn = async () => {
    try {
      const btnEle = document.querySelector(".login-trigger") as HTMLElement;

      await logIn();
      if (btnEle) btnEle.click();
    } catch (error) {
      console.log(error);
    }
  };

  const handleScroll = () => {
    const scrollTop = contentRef.current?.scrollTop || 0;
    setScroll(scrollTop);
  };

  const AvatarSkeleton = <Skeleton className="w-[35px] h-[35px] rounded-full" />;

  const renderModal = useMemo(() => {
    switch (modal) {
      case "":
        return <></>;
      case "theme":
        return <Appearance close={() => modalRef.current?.toggle()} />;
      case "info":
        return <AppInfo close={() => modalRef.current?.toggle()} />;
      case "confirm":
        return (
          <ConfirmModal
            close={() => modalRef.current?.toggle()}
            callback={handleSignOut}
            loading={false}
            label="Sign out ?"
            desc=""
            theme={theme}
          />
        );
    }
  }, [modal]);

  useEffect(() => {
    contentRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const classes = {
    userName: `text-[16px] font-[500] ml-[8px] line-clamp-1`,
    button: `h-[35px] w-[35px] rounded-full`,
    menuItem: `hover:bg-${theme.alpha} ${theme.content_hover_text} rounded-[4px] w-full px-[10px] h-[44px] inline-flex items-center font-[500]`,
    icon: "w-[25px] mr-[5px]",
    divide: `h-[1px]  w-[calc(100%-20px)] mb-[10px] mt-[20px] mx-auto bg-${theme.alpha}`,
  };

  return (
    <>
      <div
        className={`${theme.container} ${
          scroll ? "shadow-lg" : ""
        } h-[60px] fixed right-0 ${scroll ? "bg-transparent" : ""} left-[180px] z-[20]`}
      >
        <div
          className={`${scroll ? "" : "hidden "} absolute  inset-0 ${
            theme.container
          } bg-opacity-[0.9] backdrop-blur-[15px] z-[-1] `}
        ></div>

        <div className="px-[40px] flex items-center justify-between h-full">
          {/* left */}
          <div className=""></div>
          {/* right */}
          <div className="flex gap-[16px]">
            {/* <Popover
              isOpenFromParent={isOpenMenu}
              setIsOpenFromParent={setIsOpenMenu}
              placement="bottom-end"
            >
              <PopoverTrigger asChild className={``}>
                <button
                  className={`flex px-[6px] items-center ${classes.button} bg-${theme.alpha} ${theme.content_hover_bg}`}
                >
                  <AdjustmentsHorizontalIcon className="w-full" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <SettingMenu openModal={openModal} loggedIn={false} />
              </PopoverContent>
            </Popover> */}

            <MyPopup>
              <MyPopupTrigger ref={triggerRef}>
                <button
                  className={`flex px-[6px] items-center ${classes.button} bg-${theme.alpha} ${theme.content_hover_bg}`}
                >
                  <AdjustmentsHorizontalIcon className="w-full" />
                </button>
              </MyPopupTrigger>
              <MyPopupContent
                className="top-[calc(100%+8px)] right-0"
                animationClassName="origin-top-right"
              >
                <SettingMenu openModal={openModal} loggedIn={false} />
              </MyPopupContent>
            </MyPopup>

            <Popover placement="bottom-end">
              <PopoverTrigger
                className={`flex login-trigger items-center hover:brightness-75 ${classes.button}`}
              >
                {loading ? AvatarSkeleton : <Avatar />}
              </PopoverTrigger>
              <PopoverContent>
                <PopupWrapper color="sidebar" variant={"thin"} theme={theme}>
                  <div className="w-[250px] max-h-[50vh]">
                    {loggedInUser && (
                      <>
                        <div className="flex items-center p-[10px] pb-0">
                          <Avatar className="login-trigger w-[46px] h-[46px]" />

                          <div className="ml-[12px]">
                            <h5 className="font-semibold line-clamp-1">
                              {loggedInUser?.displayName}
                            </h5>
                          </div>
                        </div>

                        <div className={classes.divide}></div>
                        <button
                          className={`${classes.menuItem}`}
                          onClick={() => setModal("confirm")}
                        >
                          <ArrowRightOnRectangleIcon className={classes.icon} />
                          Log out
                        </button>
                      </>
                    )}

                    {!loggedInUser && (
                      <button className={`${classes.menuItem}`} onClick={handleLogIn}>
                        <ArrowLeftOnRectangleIcon className={classes.icon} />
                        Log in
                      </button>
                    )}
                  </div>
                </PopupWrapper>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Modal variant="animation" ref={modalRef}>
        {renderModal}
      </Modal>
    </>
  );
}

export default Header;
