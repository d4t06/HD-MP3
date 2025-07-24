import { Frame } from "../../_components";
import EditSectionBtn from "./EditSectionBtn";

type Props = {
  section: CategoryLobbySection;
  index: number;
};

export default function PlaylistSection({ section, index }: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1>{section.name}</h1>

        <EditSectionBtn index={index} name={section.name} variant="playlist" />
      </div>

      <Frame>
        <p></p>
      </Frame>
    </>
  );
}
