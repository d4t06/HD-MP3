import { useMemo } from "react";
import { Frame } from "../../_components";
import EditSectionBtn from "./EditSectionBtn";

type Props = {
  section: CategoryLobbySection;
  index: number;
};

export default function PlaylistSection({ section, index }: Props) {


    const orderedPlalists = useMemo(() => {
      const result: Category[] = [];
  
      const order = section.target_ids ? section.target_ids.split("_") : [];
  
      order.forEach((id) => {
        const founded = categories.find((c) => c.id === id);
        if (founded) result.push(founded);
      });
  
      return result;
    }, [section, categories]);

  return (
    <>
      <div className="flex items-center space-x-2">
        <h1>{section.name}</h1>

        <EditSectionBtn index={index} name={section.name} variant="playlist" />
      </div>

      <Frame>
        <p></p>
      </Frame>
    </>
  );
}
