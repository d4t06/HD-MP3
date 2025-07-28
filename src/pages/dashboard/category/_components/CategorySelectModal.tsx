import { ModalContentWrapper, ModalHeader, NotFound } from "@/components";
import { Frame } from "@/pages/dashboard/_components";
import { usePageContext } from "@/stores";

// import { useCategoryLobbyContext } from "../CategoryLobbyContext";

type Props = {
  closeModal: () => void;
  choose: (category: Category) => void;
};
export default function CategorySelectModal({ closeModal, choose }: Props) {
  const { categories } = usePageContext();

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader title="Category" closeModal={closeModal} />

        <div className="h-[40vh] mt-3 space-y-1.5 overflow-auto">
          {categories.length ? (
            categories.map((c, i) => (
              <Frame key={i} onClick={() => choose(c)}>
                <p className={`text-lg`}>{c.name}</p>
              </Frame>
            ))
          ) : (
            <NotFound />
          )}
        </div>
      </ModalContentWrapper>
    </>
  );
}
