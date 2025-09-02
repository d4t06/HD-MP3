import { Title } from "@/components";
import { Button, Frame, ItemRightCtaFrame, Loading } from "../_components";
import useGetKeyword from "./useGetKeyword";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function TrendingKeyword() {
  const { trendingKeywords, isFetching, actionFetching, refreshSearchLog } =
    useGetKeyword();

  return (
    <>
      <div className="flex flex-col mt-3 sm:mt-0 sm:flex-row justify-between items-center">
        <Title title="Trending search now" />

        <div className="flex items-center space-x-1">
          <Button
            onClick={() => refreshSearchLog("Reset")}
            disabled={actionFetching}
          >
            <ArrowPathIcon className="w-6" />
            <span>Reset</span>
          </Button>

          <Button
            onClick={() => refreshSearchLog("Refresh")}
            disabled={actionFetching}
          >
            <ArrowPathIcon className="w-6" />
            <span>Refresh now</span>
          </Button>
        </div>
      </div>

      {isFetching && <Loading />}

      {!isFetching && (
        <Frame>
          <div className="flex flex-wrap -ml-2">
            {trendingKeywords.map((k, i) => (
              <ItemRightCtaFrame key={i}>
                <span>{k}</span>
              </ItemRightCtaFrame>
            ))}
          </div>
        </Frame>
      )}
    </>
  );
}
