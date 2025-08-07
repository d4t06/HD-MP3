import TrendingKeyword from "./TrendingKeyword";
import TrendingSong from "./TrendingSong";

export default function DashBoardPage() {
  return (
    <>
      <div className={`space-y-5`}>
        <TrendingSong />

        <TrendingKeyword />
      </div>
    </>
  );
}
