import SongCardComment from "@/modules/song-card-comment";
import SongList from "./_components/SongList";
import SongsContextProvider from "./_stores/SongsContext";
import CommentProvider from "@/modules/comment/components/CommentContext";

export default function ForYouPage() {
  return (
    <SongsContextProvider>
      <div className="fixed inset-0 sm:relative overflow-hidden flex-grow">
        <SongList />

        <CommentProvider target="song">
          <SongCardComment />
        </CommentProvider>
      </div>
    </SongsContextProvider>
  );
}
