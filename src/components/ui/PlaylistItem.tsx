import {
  Bars3Icon,
  PauseCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { nanoid } from "nanoid";
import { routes } from "../../routes";
import { Playlist, ThemeType, User } from "../../types";

import {
  myDeleteDoc,
  setUserPlaylistIdsDoc,
} from "../../utils/firebaseHelpers";
import { useToast } from "../../store/ToastContext";

import Modal from "../Modal";
import Button from "./Button";
import PopupWrapper from "./PopupWrapper";
import Image from "./Image";

interface Props {
  data: Playlist;
  theme: ThemeType & { alpha: string };
  inDetail?: boolean;
  userPlaylists: Playlist[];
  userData: User;
  setUserPlaylists: (playlist: Playlist[], adminPlaylists: Playlist[]) => void;
  onClick?: () => void;
}

const PlaylistItem: FC<Props> = ({
  data,
  inDetail,
  theme,
  userPlaylists,
  userData,
  setUserPlaylists,
  onClick,
}) => {
  const navigate = useNavigate();
  const { setToasts } = useToast();

  const [fBaseLoading, setFBaseLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleDeletePlaylist = async () => {
    setFBaseLoading(true);

    try {
      // delete playlist doc
      await myDeleteDoc({ collection: "playlist", id: data.id });

      const newUserPlaylists = [...userPlaylists];

      // eliminate 1 element from playlists
      newUserPlaylists.splice(newUserPlaylists.indexOf(data), 1);

      // update user doc
      await setUserPlaylistIdsDoc(newUserPlaylists, userData);

      // update user playlists context
      setUserPlaylists(newUserPlaylists, []);

      setToasts((t) => [
        ...t,
        {
          title: "success",
          id: nanoid(4),
          desc: `Playlist '${data.name}' deleted`,
        },
      ]);

      setFBaseLoading(false);
      setIsOpenModal(false);

      if (inDetail) {
        navigate(`${routes.Playlist}`);
      }
    } catch (error) {
      setToasts((t) => [
        ...t,
        {
          title: "error",
          id: nanoid(4),
          desc: `Playlist '${data.name}' Somethings went wrong`,
        },
      ]);
    }
  };

  const confirmComponent = useMemo(
    () => (
      <>
        <div className="w-[30vw]">
          <h1 className="text-[20px] font-semibold">Chắc chưa ?</h1>
          <p className="text-[red]">This action cannot be undone</p>

          <div className="flex gap-[10px] mt-[20px]">
            <Button
              isLoading={fBaseLoading}
              className={`${theme.content_bg} rounded-full text-[14px]`}
              variant={"primary"}
              onClick={handleDeletePlaylist}
            >
              Xóa mẹ nó đi !
            </Button>
            <Button
              onClick={() => setIsOpenModal(false)}
              className={`bg-${theme.alpha} rounded-full text-[14px]`}
              variant={"primary"}
            >
              Khoan từ từ
            </Button>
          </div>
        </div>
      </>
    ),
    [fBaseLoading, theme]
  );

  const classes = {
    button: `rounded-full p-[4px] hover:bg-${theme.alpha}`,
    container: `relative overflow-hidden rounded-xl`,
    absoluteContainer: "absolute hidden inset-0 group-hover:block",
    overlay: "absolute inset-0 bg-black opacity-60",
    buttonContainer:
      "flex flex-row justify-center items-center h-full gap-4 relative z-10",

  };
  const isOnMobile = useMemo(() => {
    return window.innerWidth < 550;
  }, [window.innerWidth]);

  return (
    <>
      <div className="group" onClick={() => isOnMobile && onClick && onClick()}>
        <div className={classes.container}>
          <Image src={data.image_url } />

          {!isOnMobile && (
            <div className={classes.absoluteContainer}>
              <div className={classes.overlay}></div>
              <div className={classes.buttonContainer}>
                {!inDetail && (
                  <>
                    <Button
                      onClick={() => setIsOpenModal(true)}
                      className={classes.button}
                    >
                      <XMarkIcon className="w-[20px]" />
                    </Button>

                    <Button
                      onClick={() => onClick && onClick()}
                      className={classes.button}
                    >
                      <PauseCircleIcon className="w-[35px]" />
                    </Button>

                    <Button className={classes.button}>
                      <Bars3Icon className="w-[20px] text-white" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        {!inDetail && (
          <h5 className="text-[20px] font-[500] mt-[5px]">{data.name}</h5>
        )}
      </div>

      {isOpenModal && (
        <Modal setOpenModal={setIsOpenModal}>
          <PopupWrapper theme={theme}>{confirmComponent}</PopupWrapper>
        </Modal>
      )}
    </>
  );
};

export default PlaylistItem;
