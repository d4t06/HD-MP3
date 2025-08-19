import { ConfirmModal, Image, Modal, ModalRef } from "@/components";
import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useAuthContext, usePlayerContext } from "@/stores";
import useCommentAction from "../hooks/useCommentAction";
import { useRef, useState } from "react";
import { daysSinceTimestamp } from "@/utils/daysSinceTimestamp";
import UserInput from "./UserInput";
import GetReplyBtn from "./GetReplyBtn";

type Props = {
  comment: UserComment;
  index: number;
  level: 1 | 2;
  variant?: "dark-bg" | "theme-bg";
};

export default function CommentItem({
  comment,
  index,
  level,
  variant = "dark-bg",
}: Props) {
  const { setIsOpenFullScreen, isOpenFullScreen } = usePlayerContext();
  const { user } = useAuthContext();

  const { action, isFetching } = useCommentAction();

  const [isReplying, setIsReplying] = useState(false);

  const currentAction = useRef<"like" | "delete">("like");
  const modalRef = useRef<ModalRef>(null);

  const isLiked = user?.liked_comment_ids.includes(comment.id);
  const isOwner = user?.email === comment.user_email;

  const closeFullScreen = () => {
    if (isOpenFullScreen) setIsOpenFullScreen(false);
  };

  const handleDeleteComment = async () => {
    await action({
      type: "delete",
      comment: comment,
    });

    modalRef.current?.close();
  };

  return (
    <>
      <div className={`${level == 1 ? "py-3" : "mt-2"} `}>
        <div className="flex w-full items-start space-x-1.5">
          <div
            className={`flex-shrink-0 ${level === 1 ? "w-[40px] h-[40px]" : "w-[36px] h-[36px]"} rounded-full overflow-hidden`}
          >
            <Image src={comment.user_image_url} />
          </div>

          <div className="flex-grow text-[13px]">
            <div className="flex">
              <div className="ml-2">
                <div
                  className={`${variant === "theme-bg" ? "text-black dark:text-white" : "text-white"}`}
                >
                  <Link
                    onClick={closeFullScreen}
                    className={`font-semibold inline-block hover:underline line-clamp-1 ${variant === "theme-bg" ? "text-[#333] dark:text-[#f1f1f1]" : "text-[#f1f1f1]"}`}
                    to={`/user/${comment.user_email}`}
                  >
                    {comment.user_name}
                  </Link>
                  <div className="text-base break-all whitespace-break-spaces">
                    {comment.text}
                  </div>
                </div>

                <div className="flex space-x-2 mt-1">
                  <span className="opacity-[.7]">
                    {daysSinceTimestamp(comment.created_at)}
                  </span>

                  {user && (
                    <>
                      {isOwner ? (
                        <button
                          onClick={() => {
                            currentAction.current = "delete";
                            modalRef.current?.open();
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        level === 1 && (
                          <button onClick={() => setIsReplying(true)}>
                            Reply
                          </button>
                        )
                      )}
                    </>
                  )}
                </div>

                {!!comment.reply && level === 1 && !comment.replies.length && (
                  <GetReplyBtn comment={comment} commentIndex={index} />
                )}
              </div>

              <div className="flex flex-col items-center ml-auto">
                {user ? (
                  <button
                    className="p-1"
                    onClick={() => {
                      currentAction.current = "like";
                      action({ type: "like", id: comment.id });
                    }}
                  >
                    {isFetching && currentAction.current === "like" ? (
                      <ArrowPathIcon className="w-6 animate-spin" />
                    ) : (
                      <>
                        {isLiked ? (
                          <HeartIconSolid className={`w-6 text-red-500`} />
                        ) : (
                          <HeartIcon className="w-6" />
                        )}
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-lg">❤️</span>
                )}
                <span className="font-semibold">{comment.like}</span>
              </div>
            </div>

            {!!comment.replies.length &&
              comment.replies.map((c, i) => (
                <CommentItem key={i} comment={c} index={index} level={2} />
              ))}

            {isReplying && (
              <div className="mt-2">
                <UserInput
                  onSubmited={() => setIsReplying(false)}
                  commentIndex={index}
                  variant="reply"
                  comment={comment}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal variant="animation" ref={modalRef}>
        <ConfirmModal
          label="Delete comment"
          closeModal={() => modalRef.current?.close()}
          loading={isFetching}
          callback={handleDeleteComment}
        />
      </Modal>
    </>
  );
}
