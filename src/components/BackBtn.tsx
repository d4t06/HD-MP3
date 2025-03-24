import { ChevronLeftIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Button } from ".";
import useNavigationButton from "@/modules/navigation-button/_hooks/useNavigationButton";

type Props = {
	className?: string;
};

export default function BackBtn({ className = "" }: Props) {
	const { backward, behind, goHome } = useNavigationButton();

	const handleBack = () => {
		if (behind.length) backward();
		else goHome();
	};

	return (
		<Button
			onClick={handleBack}
			className={`p-1.5 md:hidden z-[9] relative ${className}`}
			color="primary"
			size={"clear"}
		>
			{behind.length ? <ChevronLeftIcon className="w-6" /> : <HomeIcon className="w-6" />}
		</Button>
	);
}
