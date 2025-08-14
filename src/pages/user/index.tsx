import BackBtn from "@/components/BackBtn";
import useGetUser from "./hooks/useGetUser";
import {
	Center,
	Image,
	NotFound,
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
			<div className="mb-5">
				<BackBtn />
			</div>

			<div className="space-y-5">
				<div className="flex flex-col md:flex-row items-center">
					{isFetching ? (
						<Skeleton className="w-[160px] h-[160px] rounded-full" />
					) : (
						user && (
							<div className="w-[160px] h-[160px] rounded-full overflow-hidden">
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
									<p className="font-semibold text-2xl">{user.display_name}</p>
									<p className="text-[#666]">
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
			</div>

			<Footer />
		</>
	);
}
