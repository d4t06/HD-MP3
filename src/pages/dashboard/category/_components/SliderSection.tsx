import { useMemo } from "react";
import { Frame } from "../../_components";
import { useCategoryLobbyContext } from "../CategoryLobbyContext";
import SliderSectionCta from "./SliderSectionCta";
import SliderItem from "./SliderItem";

export default function SliderSection() {
  const { page, categories } = useCategoryLobbyContext();

  const orderedCategories = useMemo(() => {
    const result: Category[] = [];

    const order = page?.category_ids ? page.category_ids.split("_") : [];

    order.forEach((id) => {
      const founded = categories.find((c) => c.id === id);
      if (founded) result.push(founded);
    });

    return result;
  }, [page, categories]);

  return (
    <>
      <h1>Slider</h1>

      <Frame>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderedCategories.length
            ? orderedCategories.map((c, i) => (
                <SliderItem category={c} key={i} />
              ))
            : ""}
        </div>

        <div className="mt-3">
          <SliderSectionCta orderedCategories={orderedCategories} />
        </div>
      </Frame>
    </>
  );
}
