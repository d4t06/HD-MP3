import { useGetCategory } from "@/hooks";
import CategoryProvider, { useCategoryContext } from "./CategoryContext";
import { Loading } from "@/components";

export function Content() {
	const { category, setCategory } = useCategoryContext();

	const { isFetching } = useGetCategory({
		setCategory,
	});

	if (isFetching) {
		return <Loading />;
	}

	return <>{JSON.stringify(category)}</>;
}

export default function CategoryDetailPage() {
	return (
		<CategoryProvider>
			<Content />
		</CategoryProvider>
	);
}
