import SongCartComment from "@/modules/song-cart-comment";
import SongList from "./_components/SongList";
import SongsContextProvider from "./_stores/SongsContext";
import CommentProvider from "@/modules/comment/components/CommentContext";

export default function ForYouPage() {
  return (
    <SongsContextProvider>
      <div className="fixed inset-0 sm:flex-grow sm:relative overflow-hidden">
        <SongList />

        <CommentProvider target="song">
          <SongCartComment />
        </CommentProvider>
      </div>
    </SongsContextProvider>
  );
}
