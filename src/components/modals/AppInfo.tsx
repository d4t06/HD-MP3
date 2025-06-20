import { ModalContentWrapper, ModalHeader } from ".";

export default function AppInfo({ close }: { close: () => void }) {
  return (
    <ModalContentWrapper >
      <ModalHeader close={close} title={"HD MP3"} />
      <p>
        <span className="font-[500]">Technologies: </span> React, Tailwind Css,
        Google firebase
      </p>
    </ModalContentWrapper>
  );
}
