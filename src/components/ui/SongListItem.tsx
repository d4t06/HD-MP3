import {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Song, ThemeType } from "../../types";
import Button from "./Button";
import {
  ArrowPathIcon,
  Bars3Icon,
  DocumentMagnifyingGlassIcon,
  DocumentPlusIcon,
  HeartIcon,
  PauseCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import handleTimeText from "../../utils/handleTimeText";
import {
  FloatingFocusManager,
  autoPlacement,
  autoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import PopupWrapper from "./PopupWrapper";
import Modal from "../Modal";
import { deleteDoc, doc } from "firebase/firestore";
import { db, store } from "../../config/firebase";
import { deleteObject, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { songItem } from "../../store/songsList";

interface Props {
  data: Song;
  active?: boolean;
  autoScroll?: boolean;
  onClick?: () => void;
  theme: ThemeType & { alpha: string };
  inProcess?: boolean;
}

export default function SongListItem({
  data,
  active,
  autoScroll,
  onClick,
  theme,
  inProcess,
}: Props) {
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [inputFields, setInputFields] = useState({
    name: data.name,
    singer: data.singer,
  });
  const [modalComponent, setModalComponent] = useState<ReactNode>();
  const [loading, setLoading] = useState<boolean>(false);

  const item = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpenPopup,
    onOpenChange: setIsOpenPopup,
    // placement: "left-end",
    middleware: [autoPlacement()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  // const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const handleInput = (field: keyof typeof inputFields, value: string) => {
    setInputFields({ ...inputFields, [field]: value });
  };

  const handleDeleteSong: MouseEventHandler = async () => {
    try {
      setLoading(true);
      // console.log("check data", data);

      // Create a reference to the file to delete
      const songFileRef = ref(store, data.file_name);

      // Delete the file
      await deleteObject(songFileRef);

      // Delete the song doc
      await deleteDoc(doc(db, "songs", data.id));

      if (data.lyric_id) {
        // Delete lyric doc
        await deleteDoc(doc(db, "lyrics", data.lyric_id));
      }

      // setIsOpenModal(false)
    } catch (error) {
      console.log({ message: error });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!autoScroll) return;
    console.log("scroll");
  }, [active]);

  const buttonClasses = "h-[35px] w-[35px] p-[8px] rounded-full";
  const inputClasses =
    "px-[10px] py-[5px] rounded-[4px] bg-transparent border text-[#fff] text-[14px] font-[500]";

  const songCompoent = (
    <>
      <div
        className={`flex flex-row ${inProcess ? "opacity-60" : ''}`}
        onClick={() => window.innerWidth <= 549 && onClick && onClick()}
      >
        <div className="h-[54px] w-[54px] relative rounded-[4px] overflow-hidden group/image flex-shrink-0">
          <img
            className=""
            src={data?.image_path || "https://placehold.co/100"}
            alt=""
          />

          {active && !inProcess && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="relative h-[18px] w-[18px]">
                <img
                  src="https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif"
                  alt=""
                />
              </div>
            </div>
          )}
          {!active && !inProcess && (
            <div
              className="absolute  inset-0 bg-black bg-opacity-60 
    items-center justify-center hidden max-[549px]:hidden group-hover/image:flex"
            >
              <Button
                onClick={onClick}
                variant={"default"}
                className="h-[25px] w-[25px] text-white"
              >
                <PauseCircleIcon />
              </Button>
            </div>
          )}
        </div>
        <div className="ml-[10px]">
          <h5 className="text-mg line-clamp-1">{data.name}</h5>
          <p className="text-xs text-gray-500 line-clamp-1">{data.singer}</p>
        </div>
      </div>
    </>
  );

  const editComponent = (
    <div className="w-[50vw] h-[auto]">
      <h1 className="text-[20px] font-semibold">Chỉnh sửa</h1>
      <div className="flex mt-[10px]">
        <div className="w-[130px] h-[13px] flex-shrink-0 rounded-[5px]">
          <img
            className="w-[100%] object-cover object-center rounded-[5px]"
            src={data.image_path || "https://placehold.co/200"}
            alt=""
          />
        </div>
        <div className="ml-[20px] w-full flex flex-col gap-[10px]">
          <div className="flex flex-col gap-[5px]">
            <p className="text-[14px]">Tên: </p>
            <input
              className={inputClasses}
              value={inputFields.name}
              type="text"
              onChange={(e) => handleInput("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="text-[14px]">Thể hiện: </p>
            <input
              className={inputClasses}
              value={inputFields.singer}
              onChange={(e) => handleInput("singer", e.target.value)}
              type="text"
            />
          </div>

          <div className="flex gap-[10px] mt-[10px]">
            <Button
              className={`bg-${theme.alpha} rounded-full text-[14px]`}
              variant={"primary"}
            >
              Lưu
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenModal(false);
              }}
              className={`${theme.content_bg} rounded-full text-[14px]`}
              variant={"primary"}
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  const dialogComponent = useMemo(
    () => (
      <>
        <div className="w-[30vw]">
          <h1 className="text-[20px] font-semibold">Chắc chưa ?</h1>
          <p className="text-[red]">This action cannot be undone</p>

          <div className="flex gap-[10px] mt-[20px]">
            <Button
              isLoading={loading}
              className={`${theme.content_bg} rounded-full text-[14px]`}
              variant={"primary"}
              onClick={handleDeleteSong}
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
    [loading, theme]
  );

  const handleMenu = (target: "edit" | "confirm") => {
    switch (target) {
      case "edit":
        setModalComponent(editComponent);
        setIsOpenModal(true);
        break;
      case "confirm":
        setModalComponent(dialogComponent);
        setIsOpenModal(true);
        break;

      default:
        setIsOpenModal(true);
    }
  };

  //   console.log("Check lading", loading);

  return (
    <div
      ref={item}
      className={`group/main flex flex-row rounded justify-between items-center p-[10px] hover:bg-${
        theme.alpha
      } ${active && "bg-" + theme.alpha} bg-${isOpenPopup && theme.alpha} `}
    >
      {songCompoent}

      {/* cta */}
      {inProcess ? (
        <div className="flex">
          <span>
            <ArrowPathIcon className="w-[20px] mr-[10px] animate-spin" />
          </span>
          <p className="text-[14px]">In process...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-x-[5px]">
            <Button
              className={`${buttonClasses} ${theme.content_hover_bg} ${
                theme.type === "light" ? "hover:text-[#33]" : "hover:text-white"
              }`}
            >
              <HeartIcon />
            </Button>

            <div className="w-[40px] flex justify-center items-center">
              <button
                ref={refs.setReference}
                {...getReferenceProps()}
                className={`group-hover/main:block ${buttonClasses}
            ${
              isOpenPopup
                ? "block cursor-default"
                : "hidden " + theme.content_hover_bg
            }
            ${theme.type === "light" ? "hover:text-[#33]" : "hover:text-white"}
            max-[549px]:block
            `}
              >
                <Bars3Icon />
              </button>
              <span
                className={`pr-[8px] text-xs group-hover/main:hidden ${
                  isOpenPopup && "hidden"
                } max-[549px]:hidden`}
              >
                {handleTimeText(data.duration)}
              </span>
            </div>
          </div>
        </>
      )}

      {isOpenPopup && !inProcess && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="z-[99]"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <PopupWrapper theme={theme}>
              <div className="w-[200px]">
                {window.innerWidth > 549 && songCompoent}

                {/* cta */}

                <Button
                  className={`mt-[15px] ${theme.content_hover_text}`}
                  variant={"list"}
                >
                  <PlusCircleIcon className="w-[18px] mr-[5px]" />
                  Thêm vào playlist
                </Button>

                {data.by != "admin" && (
                  <>
                    <Button
                      onClick={() => handleMenu("edit")}
                      className={`${theme.content_hover_text}`}
                      variant={"list"}
                    >
                      <PencilSquareIcon className="w-[18px] mr-[5px]" />
                      Chỉnh Sửa
                    </Button>

                    {data.lyric_id ? (
                      <Button
                        className={`${theme.content_hover_text}`}
                        variant={"list"}
                        onClick={handleDeleteSong}
                      >
                        <DocumentMagnifyingGlassIcon className="w-[18px] mr-[5px]" />
                        Chỉnh sủa lời bài hát
                      </Button>
                    ) : (
                      <Link to={`/React-Zingmp3/edit/${data.id}`}>
                        <Button
                          className={`${theme.content_hover_text}`}
                          variant={"list"}
                        >
                          <DocumentPlusIcon className="w-[18px] mr-[5px]" />
                          Thêm lời bài hát
                        </Button>
                      </Link>
                    )}

                    <Button
                      onClick={() => handleMenu("confirm")}
                      className={`${theme.content_hover_text}`}
                      variant={"list"}
                    >
                      <TrashIcon className="w-[18px] mr-[5px]" />
                      Xóa
                    </Button>
                  </>
                )}

                <p className="opacity-60 text-center text-[13px] mt-[10px">
                  Thêm bởi {data.by}
                </p>
              </div>
            </PopupWrapper>
          </div>
        </FloatingFocusManager>
      )}

      {isOpenModal && !inProcess && (
        <Modal setOpenModal={setIsOpenModal}>
          <PopupWrapper theme={theme}>{modalComponent}</PopupWrapper>
        </Modal>
      )}
    </div>
  );
}
