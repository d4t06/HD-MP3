import useGetUser from "./hooks/useGetUser";
import {
	Center,
	Image,
	NotFound,
	PageWrapper,
	PlaylistList,
	Skeleton,
	Title,
} from "@/components";
import { daysSinceTimestamp } from "@/utils/daysSinceTimestamp";
import Footer from "@/layout/primary-layout/_components/Footer";
import { choVoTri } from "@/constants/app";

export default function UserPage() {
	const { playlists, isFetching, user } = useGetUser();

	if (!isFetching && !user)
		return (
			<Center>
				<NotFound variant="with-home-button" />
			</Center>
		);

	return (
		<>
			<PageWrapper>
				<div className="flex flex-col md:flex-row items-center md:items-start">
					{isFetching ? (
						<Skeleton className="w-3/5 md:w-[200px] aspect-[1/1] rounded-full" />
					) : (
						user && (
							<div className="w-3/5 md:w-[200px] aspect-[1/1] rounded-full overflow-hidden">
								<Image
									fallback={choVoTri.image}
									blurHashEncode={user.photo_url ? "" : choVoTri.blurhash}
									src={user.photo_url}
								/>
							</div>
						)
					)}

					<div className="text-center mt-3 md:mt-0 md:ml-3 md:text-left ">
						{isFetching ? (
							<>
								<Skeleton className="w-[300px] h-[30px]" />
								<Skeleton className="w-[200px] h-[22px] mt-1" />
							</>
						) : (
							user && (
								<>
									<Title title={user.display_name} />
									<p className="item-info">
										Last seen: {daysSinceTimestamp(user.last_seen)}
									</p>
								</>
							)
						)}
					</div>
				</div>

				<div>
					<Title title="Playlists" />
					<PlaylistList loading={isFetching} playlists={playlists} />
				</div>
			</PageWrapper>

			<Footer />
		</>
	);
}
