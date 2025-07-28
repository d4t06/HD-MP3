// import { useMemo } from "react";
import { Frame } from "../../_components";
import SliderSectionCta from "./SliderSectionCta";
import SliderItem from "./SliderItem";
import { usePageContext } from "@/stores";
import { Title } from "@/components";

export default function SliderSection() {
  const { categorySliders, homeSliders } = usePageContext();

  const TARGET_PAGE = location.hash.includes("homepage") ? "home" : "category";

  const sliders = TARGET_PAGE === "home" ? homeSliders : categorySliders;

  return (
    <>
      <Title title="Slider" variant={"h2"} className="mb-3" />

      <Frame>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sliders.length
            ? sliders.map((c, i) => <SliderItem category={c} key={i} />)
            : ""}
        </div>

        <div className="mt-3">
          <SliderSectionCta orderedCategories={sliders} />
        </div>
      </Frame>
    </>
  );
}
