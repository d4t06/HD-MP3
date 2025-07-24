import { Loading } from "@/components";
import useGetPage from "./hooks/useGetPage";

export default function CategoryPage() {
	const { isFetching } = useGetPage();

	if (isFetching) return <Loading />;

	return (

		<>
			

			<div className="space-y-5">
					
			</div>

		</>
		)
}
