import {
  Button,
  Image,
  PopupWrapper,
  Modal,
  ModalContentWrapper,
  MyPopupContent,
  MyPopupTrigger,
  Title,
} from "@/components";
import simonCat from "@/assets/simon_empty.png";
import useCommentAction from "../hooks/useCommentAction";
import { useAuthContext } from "@/stores";
import {
  PlayIcon,
  ArrowPathIcon,
  FaceSmileIcon,
} from "@heroicons/react/20/solid";
import { inputClasses } from "@/components/ui/Input";
import Popup from "@/components/popup/PopupContext";
import useCommentInput from "../hooks/useCommentInput";
import { meoVoTri } from "@/constants/app";
import { getDisable } from "@/utils/appHelpers";
import Twemoji from "react-twemoji";

type Props = {
  onSubmited?: () => void;
  bg?: string;
};

type SendComment = {
  variant: "comment";
  targetId: string;
};

type SendReply = {
  variant: "reply";
  comment: UserComment;
  commentIndex: number;
};

export default function UserInput({
  onSubmited,
  bg = "bg-[--a-10-cl]",
  ...props
}: (SendComment | SendReply) & Props) {
  const { user } = useAuthContext();
  // const { theme } = useThemeContext();

  const { action, isFetching, modalRef } = useCommentAction();
  const { EMOJIS, textareaRef, addEmoji, value, setValue } = useCommentInput();

  const handleAddComment = async () => {
    if (!value || !value.trim()) return;

    switch (props.variant) {
      case "comment":
        await action({
          type: "add",
          target_id: props.targetId,
          text: value,
        });

        break;
      case "reply":
        await action({
          type: "reply",
          text: value,
          comment: props.comment,
          comment_index: props.commentIndex,
        });

        break;
    }

    setValue("");
    onSubmited && onSubmited();
  };

  const inputPlaceholder =
    props.variant === "comment"
      ? "..."
      : `Reply to ${props.comment.user_name}...`;

  return (
    <>
      <div className="flex w-full">
        <div className="w-[40px] h-[40px] flex-shrink-0">
          <Image
            fallback={meoVoTri.image}
            src={user?.photo_url}
            blurHashEncode={user?.photo_url ? "" : meoVoTri.blurhash}
            className="rounded-full"
          />
        </div>

        <div
          className={`rounded-lg ml-2 flex-grow  p-1.5 flex items-end ${getDisable(isFetching)} ${bg}`}
        >
          <textarea
            ref={textareaRef}
            placeholder={inputPlaceholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={1}
            className={`${inputClasses} no-scrollbar resize-none max-h-[30vh] w-full !bg-transparent border-none`}
          />

          <Popup appendOnPortal>
            <MyPopupTrigger>
              <button className="hover p-1.5 hover:bg-[--a-5-cl] rounded-full">
                <FaceSmileIcon className="w-6" />
              </button>
            </MyPopupTrigger>

            <MyPopupContent>
              <PopupWrapper className="w-[270px]">
                <div className="p-1.5 grid grid-cols-5 justify-items-center max-h-60 overflow-y-auto pr-2 [&_button]:p-1  [&_button]:rounded-md  [&_img]:w-7  hover:[&_button]:bg-gray-200">
                  {EMOJIS.map((emoji, index) => (
                    <button onClick={() => addEmoji(emoji)} key={index}>
                      <Twemoji options={{ className: "twemoji" }}>
                        {emoji}
                      </Twemoji>
                    </button>
                  ))}
                </div>
              </PopupWrapper>
            </MyPopupContent>
          </Popup>

          <button
            onClick={handleAddComment}
            className={`p-1.5 hover:bg-white/10 rounded-full`}
          >
            {isFetching ? (
              <ArrowPathIcon className="w-6 animate-spin" />
            ) : (
              <PlayIcon className="w-6" />
            )}
          </button>
        </div>
      </div>

      <Modal variant="animation" ref={modalRef}>
        <ModalContentWrapper>
          <Image
            className="mx-auto"
            width="w-[130px]"
            // src="https://zalo-api.zadn.vn/api/emoticon/sticker/webpc?eid=46991&size=130"
            src={simonCat}
          />
          <Title
            variant={"h2"}
            className="text-center"
            title="Your commment is not allow"
          />

          <p className="mt-5 text-right">
            <Button onClick={() => modalRef.current?.close()} color="primary">
              Ok
            </Button>
          </p>
        </ModalContentWrapper>
      </Modal>
    </>
  );
}
