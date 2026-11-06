const letters = [...Array(26).keys()].map((n) => String.fromCharCode(n + 65));

export default function FirstLetterCol() {
	const handleClick = (letter: string) => {
		const firstElement = document.querySelector(
			`div.song-item[data-first_letter=${letter.toLowerCase()}]`,
		);


		console.log(firstElement)

		if (firstElement)
			firstElement.scrollIntoView({
				block: "start",
				behavior: "instant",
			});
	};

	return (
		<div className="relative">
			<div
				className="sticky right-2 top-5 [&_button]:block [&_button]:w-full [&_button]:px-1 text-sm font-bold"
			>
				{letters.map((letter, i) => {
					return (
						<button key={i} onClick={() => handleClick(letter)}>
							{letter}
						</button>
					);
				})}
			</div>
		</div>
	);
}
