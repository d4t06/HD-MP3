import ModalHeader from "./ModalHeader";

export default function AppInfo({ close }: { close: () => void }) {
  return (
    <div className="w-[400px] max-w-[calc(90vw-40px)]">
      <ModalHeader close={close} title={"HD MP3"} />
      <p>
        <span className="font-[500]">Technologies: </span> React, Tailwind Css,
        Google firebase
      </p>
    </div>
  );
}
