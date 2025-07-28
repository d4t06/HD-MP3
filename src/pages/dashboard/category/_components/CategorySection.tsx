import { useMemo } from "react";
import { Frame } from "../../_components";
// import { useCategoryLobbyContext } from "../CategoryLobbyContext";
import CategorySectionCta from "./CategorySectionCta";
import CategoryItem from "./CategoryItem";
import SectionCta from "./SectionCta";
import { usePageContext } from "@/stores";

type Props = {
  section: PageSection;
  index: number;
};

export default function CategorySection({ section, index }: Props) {
  const { categories } = usePageContext();

  const orderedCategories = useMemo(() => {
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
      <div className="flex items-center">
        <h1>{section.name}</h1>

        <SectionCta section={section} index={index} name={section.name} variant="category" />
      </div>

      <Frame>
        <div className="flex flex-wrap -mt-2 -mx-2">
          {orderedCategories.map((c, i) => (
            <CategoryItem category={c} key={i} />
          ))}
        </div>

        <p className="text-center mt-5">
          <CategorySectionCta sectionIndex={index} />
        </p>
      </Frame>
    </>
  );
}
