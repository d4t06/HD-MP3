import { Frame, ItemRightCtaFrame, Loading } from "../_components";
import useGetKeyword from "./useGetKeyword";

export default function TrendingKeyword() {
  const { trendingKeywords, isFetching } = useGetKeyword();

  return (
    <>
      <h1 className="text-xl font-bold text-[#333]">Trending search now</h1>

      {isFetching && <Loading />}

      {!isFetching && (
        <Frame>
          <div className="flex flex-wrap -ml-2">
            {trendingKeywords.map((k, i) => (
              <ItemRightCtaFrame key={i}>
                <span>{k} 🔥🔥🔥</span>
              </ItemRightCtaFrame>
            ))}
          </div>
        </Frame>
      )}
    </>
  );
}
