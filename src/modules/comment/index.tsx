import { useAuthContext } from "@/stores";
import CommentItem from "./components/CommentItem";
import UserInput from "./components/UserInput";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ComponentProps } from "react";
import { Center } from "@/components";

type Props = {
  comments: UserComment[];
  isFetching?: boolean;
  className?: string;
  variant?: ComponentProps<typeof CommentItem>["variant"];
};

export default function CommentList({
  comments,
  isFetching = false,
  className = "",
  variant,
}: Props) {
  const { user } = useAuthContext();

  return (
    <>
      <div
        className={`flex-grow relative overflow-auto no-scrollbar ${className}`}
      >
        {isFetching && (
          <Center>
            <ArrowPathIcon className="animate-spin w-7" />
          </Center>
        )}

        {!isFetching && (
          <>
            {comments.length ? (
              comments.map((c, i) => (
                <CommentItem
                  variant={variant}
                  level={1}
                  index={i}
                  key={c.id}
                  comment={c}
                />
              ))
            ) : (
              <p className="text-center">...</p>
            )}
          </>
        )}
      </div>

      {user && (
        <div className="pt-1.5">
          <UserInput variant="comment" />
        </div>
      )}
    </>
  );
}
