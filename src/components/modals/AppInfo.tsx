import { ModalContentWrapper, ModalHeader } from ".";

export default function AppInfo({ closeModal }: { closeModal: () => void }) {
  return (
    <ModalContentWrapper >
      <ModalHeader closeModal={closeModal} title={"HD MP3"} />
      <p>
        <span className="font-[500]">Technologies: </span> React, Tailwind Css,
        Google firebase
      </p>
    </ModalContentWrapper>
  );
}
