import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { NavigationProvider, useThemeContext } from "@/stores";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import {
  AppInfo,
  Appearance,
  Avatar,
  ConfirmModal,
  Skeleton,
  Modal,
  SettingMenu,
  PopupWrapper,
} from "@/components";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ModalRef } from "@/components/Modal";
import MyPopup, {
  MyPopupContent,
  MyPopupTrigger,
  TriggerRef,
} from "@/components/MyPopup";
import MyTooltip from "@/components/MyTooltip";
import useAuthAction from "@/hooks/useAuthActiont";
import NavigationButton from "../navigation-button";
import Search from "../search";

export type HeaderModal = "theme" | "info" | "confirm";

function Header({ contentRef }: { contentRef: RefObject<HTMLDivElement> }) {
  const { theme } = useThemeContext();

  //  state
  const [scroll, setScroll] = useState(0);
  const [loggedInUser, loading] = useAuthState(auth);
  const [modal, setModal] = useState<HeaderModal | "">("");
  // const [isOpenMenu, setIsOpenMenu] = useState(false);
  const settingTriggerRef = useRef<TriggerRef>(null);
  const avatarTriggerRef = useRef<TriggerRef>(null);

  const modalRef = useRef<ModalRef>(null);

  //  use hooks
  const { action } = useAuthAction();

  const openModal = (modal: HeaderModal) => {
    setModal(modal);
    modalRef.current?.toggle();

    // setIsOpenMenu(false);
    settingTriggerRef.current?.close();
  };

  const handleSignOut = async () => {
    try {
      await action("logout");
    } catch (error) {
      console.log("signOut error", { message: error });
    } finally {
      modalRef.current?.toggle();
    }
  };

  //   methods
  const handleLogIn = async () => {
    try {
      avatarTriggerRef.current?.close();
      await action("login");
    } catch (error) {
      console.log({ message: error });
    }
  };

  const handleScroll = () => {
    const scrollTop = contentRef.current?.scrollTop || 0;
    setScroll(scrollTop);
  };

  const AvatarSkeleton = <Skeleton className="h-[40px] w-[40px] rounded-full" />;

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
    button: `h-[40px] w-[40px] rounded-full`,
    menuItem: `hover:bg-white/5 rounded-[4px] w-full text-sm px-[10px] h-[44px] inline-flex items-center font-[500]`,
    icon: "w-5 mr-1",
    divide: `h-[1px]  w-[calc(100%-20px)] mb-[10px] mt-[20px] mx-auto bg-${theme.alpha}`,
  };

  return (
    <>
      <div
        className={`hidden md:block h-[60px] fixed top-0 right-0 left-[180px] z-[20]  ${scroll ? "shadow-lg" : "bg-transparent"}`}
      >
        <div
          className={`${scroll ? "" : "hidden "} absolute inset-0 ${
            theme.container
          } bg-opacity-[0.9] backdrop-blur-[15px] z-[-1] `}
        ></div>

        <div className="px-[40px] items-center flex h-full">
          <NavigationProvider>
            <NavigationButton className="mr-5" />
          </NavigationProvider>

          <Search />

          {/* right */}
          <div className="flex space-x-3 ml-auto">
            <MyPopup>
              <MyPopupTrigger ref={settingTriggerRef}>
                <MyTooltip isWrapped position="top-[calc(100%+8px)]" content="Settings">
                  <button
                    className={`flex px-[6px] items-center ${classes.button} bg-${theme.alpha} ${theme.content_hover_bg}`}
                  >
                    <AdjustmentsHorizontalIcon className="w-full" />
                  </button>
                </MyTooltip>
              </MyPopupTrigger>
              <MyPopupContent
                appendTo="parent"
                className="top-[calc(100%+8px)] right-0"
                animationClassName="origin-top-right"
              >
                <SettingMenu openModal={openModal} variant="client" />
              </MyPopupContent>
            </MyPopup>

            <MyPopup>
              <MyPopupTrigger ref={avatarTriggerRef} className="flex items-center">
                <button className="flex hover:brightness-90">
                  {loading ? AvatarSkeleton : <Avatar className="w-[40px] h-[40px]" />}
                </button>
              </MyPopupTrigger>

              <MyPopupContent
                appendTo="parent"
                className="top-[calc(100%+8px)] right-0"
                animationClassName="origin-top-right"
              >
                <PopupWrapper theme={theme}>
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
                          onClick={() => openModal("confirm")}
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
              </MyPopupContent>
            </MyPopup>
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
