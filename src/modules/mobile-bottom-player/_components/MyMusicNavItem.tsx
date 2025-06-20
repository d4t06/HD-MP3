import {
  Button,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
} from "@/components";
import useAuthAction from "@/hooks/useAuthActiont";
import { useAuthContext } from "@/stores";
import { UserIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  ActiveClass: string;
};

export default function MyMusicNavItem({ ActiveClass }: Props) {
  const { user } = useAuthContext();
  const { action } = useAuthAction();

  const navigator = useNavigate();

  const modalRef = useRef<ModalRef>(null);

  const handleLogIn = async () => {
    try {
      await action("login");

      navigator("/my-music");
    } catch (error) {
      console.log(error);
    }
  };

  if (!!user)
    return (
      <Link
        className={`
                  ${ActiveClass}
                `}
        to={"/my-music"}
      >
        <div>
          <UserIcon />
          <span>My song</span>
        </div>
      </Link>
    );

  return (
    <>
      <button
        onClick={() => modalRef.current?.open()}
        className={`
                  ${ActiveClass}
                `}
      >
        <div>
          <UserIcon />
          <span>Login</span>
        </div>
      </button>

      <Modal ref={modalRef} variant="animation">
        <ModalContentWrapper>
          <ModalHeader close={() => modalRef.current?.close()} title="Login" />
          <div className="text-center my-5">
            <Button onClick={handleLogIn} color="primary">
              Login with Google
            </Button>
          </div>
        </ModalContentWrapper>
      </Modal>
    </>
  );
}
