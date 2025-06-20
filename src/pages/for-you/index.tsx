import SongCardComment from "@/modules/song-card-comment";
import SongList from "./_components/SongList";
import SongsContextProvider from "./_stores/SongsContext";
import CommentProvider from "@/modules/comment/components/CommentContext";

export default function ForYouPage() {
  return (
    <SongsContextProvider>
      <div className="fixed top-0 left-0 right-0 bottom-[47px] z-[90] md:inset-0 sm:relative overflow-hidden flex-grow">
        <SongList />

        <CommentProvider target="song">
          <SongCardComment />
        </CommentProvider>
      </div>
    </SongsContextProvider>
  );
}
