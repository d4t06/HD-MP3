import { useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Song, ThemeType } from "../types";

import {
  selectAllSongStore,
  setSong,
  useTheme,
  useSongsStore,
  useAuthStore,
} from "../store";
import {
  SongItem,
  Button,
  LinkItem,
  MobileSongItem,
  Modal,
  confirmModal,
} from "../components";
// hooks
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useSongs, useSongItemActions } from "../hooks";
// config
import { routes } from "../routes";
import { auth } from "../config/firebase";
import { SongItemSkeleton, mobileLinkSkeleton } from "../components/skeleton";
import { signOut } from "firebase/auth";
import { initialState } from "../store/AuthContext";
import { themes } from "../config/themes";
import ThemeItem from "../components/child/ThemeItem";

export default function HomePage() {
  // use store
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const { userInfo, setUserInfo } = useAuthStore();
  const { loading: useSongLoading } = useSongs();
  const { adminSongs, userPlaylists, initSongsContext } = useSongsStore();
  const { song: songInStore } = useSelector(selectAllSongStore);

  // use hooks
  const songItemActions = useSongItemActions();
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  // component states
  const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
  const [isCheckedSong, setIsCheckedSong] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const modalName = useRef<"theme" | "info" | "confirm">("theme");

  // define callback functions
  const handleSetSong = (song: Song, index: number) => {
    if (songInStore.id === song.id) return;
    dispatch(setSong({ ...song, currentIndex: index, song_in: "admin" }));
  };

  const isOnMobile = useMemo(() => window.innerWidth < 800, []);

  //   methods
  const signIn = () => {
    signInWithGoogle();
  };
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // clear auth store
      setUserInfo({ ...initialState.userInfo, status: "finish" });
      // reset song context
      initSongsContext({
        adminSongs: [],
        userSongs: [],
        userPlaylists: [],
        adminPlaylists: [],
      });
    } catch (error) {
      console.log("signOut error", { messsage: error });
    } finally {
      setIsOpenModal(false);
    }
  };
  const handleSetTheme = (theme: ThemeType) => {
    localStorage.setItem("theme", JSON.stringify(theme.id));
    setTheme(theme);
  };
  const handleOpenModal = (name: typeof modalName.current) => {
    modalName.current = name;
    setIsOpenModal(true);
  };

  // define styles
  const classes = {
    songItemContainer: `w-full border-b border-${theme.alpha} last:border-none`,
    icon: `w-6 h-6 mr-2 inline`,
    popupWrapper: "w-[400px] max-w-[calc(90vw-40px)]",
    themeContainer: "overflow-auto no-scrollbar h-[calc(70vh-60px)]  pb-[5vh]",
    themeList: "flex flex-row -mx-[10px] flex-wrap gap-y-[20px]",
    linkItem: `py-[10px] border-b border-${theme.alpha} last:border-none`,
  };

  // define jsx
  const renderAdminSongs = useMemo(() => {
    return adminSongs.map((song, index) => {
      const active = song.id === songInStore.id && songInStore.song_in === "admin";

      if (isOnMobile) {
        return (
          <MobileSongItem
            theme={theme}
            onClick={() => handleSetSong(song, index)}
            active={active}
            key={index}
            data={song}
            isCheckedSong={isCheckedSong}
            selectedSongList={selectedSongList}
            setIsCheckedSong={setIsCheckedSong}
            setSelectedSongList={setSelectedSongList}
          />
        );
      }
      return (
        <SongItem
          theme={theme}
          onClick={() => handleSetSong(song, index)}
          active={active}
          key={index}
          data={song}
          userInfo={userInfo}
          isCheckedSong={isCheckedSong}
          userPlaylists={userPlaylists}
          selectedSongList={selectedSongList}
          setIsCheckedSong={setIsCheckedSong}
          setSelectedSongList={setSelectedSongList}
          songItemActions={songItemActions}
        />
      );
    });
  }, [adminSongs, theme, songInStore, selectedSongList, isCheckedSong]);

  // modal
  const renderHeader = (title: string) => {
    return (
      <div className="flex justify-between py-[15px]">
        <h1 className="text-[26px] font-semibold">{title}</h1>
        <Button onClick={() => setIsOpenModal(false)} size={"normal"} variant={"circle"}>
          <XMarkIcon />
        </Button>
      </div>
    );
  };

  const infoScreen = useMemo(
    () => (
      <div className={classes.popupWrapper}>
        {renderHeader("Zingmp3 clone")}
        <div className="">
          <h5 className="text-lg font-bold">Các công nghệ sử dụng:</h5>
          <ul>
            {/* <li className="text-lg my-[10px] ml-[20px]">- React - Vite</li>
                   <li className="text-lg my-[10px]  ml-[20px]">- Tailwind css</li> */}
            {/* <li className="text-lg my-[10px]  ml-[20px]">
                  - Này tui lấy của người ta nên hông biết &#128535; &#128535; &#128535;
                </li> */}
          </ul>
          <a href="asldj" target="_blank" className="text-lg font-bold">
            #Github
          </a>
        </div>
      </div>
    ),
    []
  );

  const darkTheme: JSX.Element[] = [];
  const lightTheme: JSX.Element[] = [];

  useMemo(() => {
    themes.forEach((themeItem, index) => {
      const active = themeItem.id === theme.id;
      if (themeItem.type === "dark")
        return darkTheme.push(
          <ThemeItem
            active={active}
            key={index}
            theme={themeItem}
            onClick={handleSetTheme}
          />
        );

      lightTheme.push(
        <ThemeItem
          active={active}
          key={index}
          theme={themeItem}
          onClick={handleSetTheme}
        />
      );
    });
  }, [theme]);

  const themesScreen = useMemo(
    () => (
      <div className={classes.popupWrapper}>
        {renderHeader("Appearance")}
        <div className={classes.themeContainer}>
          <h2 className="text-md font-semibold mb-[10px]">Dark</h2>
          <div className={classes.themeList}>{darkTheme}</div>

          <h2 className="text-md font-semibold mb-[10px] mt-[30px]">Light</h2>
          <div className={classes.themeList}>{lightTheme}</div>
        </div>
      </div>
    ),
    [theme]
  );

  const logoutModal = useMemo(
    () =>
      confirmModal({
        loading: false,
        label: "Log out ?",
        theme: theme,
        callback: handleSignOut,
        className: classes.popupWrapper,
        setOpenModal: setIsOpenModal,
      }),
    [theme]
  );

  return (
    <>
      {/* mobile nav */}
      {isOnMobile && (
        <div className="pb-[20px]">
          <div className="flex flex-col gap-3 items-start ">
            <h1 className="text-[24px] font-bold">Library</h1>
            {userInfo.status === "loading" ? (
              mobileLinkSkeleton
            ) : (
              <>
                {userInfo.email ? (
                  <LinkItem
                    className={classes.linkItem}
                    to={routes.MySongs}
                    icon={
                      <MusicalNoteIcon className={classes.icon + theme.content_text} />
                    }
                    label="All songs"
                    arrowIcon={<ChevronRightIcon className="w-5 h-5 text-gray-500" />}
                  />
                ) : (
                  <Button
                    onClick={signIn}
                    className={`${theme.content_bg} rounded-[4px] px-[40px]`}
                    variant={"primary"}
                  >
                    Login
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      {/* admin song */}
      <div className="pb-[30px]">
        <h3 className="text-[24px] font-bold mb-[10px]">Popular</h3>
        {useSongLoading && SongItemSkeleton}

        {!useSongLoading && (
          <>{!!adminSongs.length ? renderAdminSongs : "No songs jet..."}</>
        )}
      </div>

      {/* mobile setting */}
      {isOnMobile && (
        <div className="pb-[30px]">
          <h3 className="text-[24px] font-bold mb-[10px]">Setting</h3>
          <div className="h-[65px] w-[65px]">
            <img src={userInfo.photoURL} className="w-full rounded-full" alt="" />
          </div>
          <p className="text-[18px] font-[500] my-[8px]">{userInfo.display_name}</p>
          <LinkItem
            className={classes.linkItem}
            icon={<PaintBrushIcon className={classes.icon} />}
            label="Theme"
            onClick={() => handleOpenModal("theme")}
          />
          <LinkItem
            className={classes.linkItem}
            icon={<InformationCircleIcon className={classes.icon} />}
            label="Info"
            onClick={() => handleOpenModal("info")}
          />
          <LinkItem
            className={classes.linkItem}
            icon={<ArrowRightOnRectangleIcon className={classes.icon} />}
            label="Logout"
            onClick={() => handleOpenModal("confirm")}
          />
        </div>
      )}

      {isOpenModal && (
        <Modal theme={theme} setOpenModal={setIsOpenModal}>
            {modalName.current === "confirm" && logoutModal}
            {modalName.current === "info" && infoScreen}
            {modalName.current === "theme" && themesScreen}
        </Modal>
      )}
    </>
  );
}
