import { Modal, ModalContentWrapper, ModalRef, SlideModal } from "@/components";
import { useCommentContext } from "@/modules/comment/components/CommentContext";
import MobileComment from "@/modules/comment/components/MobileComment";
import PlaylistComment from "@/modules/comment/components/PlaylistComment";
import { useThemeContext } from "@/stores";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export default function ChatBtn() {
  const { theme, isOnMobile } = useThemeContext();
  const { setIsOpenComment } = useCommentContext();
  const modalRef = useRef<ModalRef>(null);

  const openModal = () => {
    modalRef.current?.open();
    setIsOpenComment(true);
  };

  // define style
  const classes = {
    button: `bg-${theme.alpha} hover:brightness-90 rounded-full w-[40px] flex items-center justify-center`,
  };

  return (
    <>
      <button onClick={() => openModal()} className={classes.button}>
        <ChatBubbleLeftRightIcon className="w-5" />
      </button>

      {!isOnMobile && (
        <Modal
          onClose={() => setIsOpenComment(false)}
          variant="animation"
          ref={modalRef}
        >
          <ModalContentWrapper className="h-[400px] w-[500px]">
            <PlaylistComment />
          </ModalContentWrapper>
        </Modal>
      )}

      {isOnMobile && (
        <SlideModal ref={modalRef} onClose={() => setIsOpenComment(false)}>
          <MobileComment>
            <PlaylistComment />
          </MobileComment>
        </SlideModal>
      )}
    </>
  );
}
