import { useState } from "react";
import { useToastContext } from "@/stores";
import { deleteFile, myDeleteDoc } from "@/services/firebaseService";
import { useNavigate } from "react-router-dom";
import { useSingerContext } from "@/stores/dashboard/SingerContext";

type Delete = {
  variant: "delete";
};

export type SingerActionProps = Delete;

export default function useDashboardSingerAction() {
  // stores
  const { setErrorToast } = useToastContext();
  const { singer, setSinger } = useSingerContext();

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const navigate = useNavigate();

  const action = async (props: SingerActionProps) => {
    try {
      switch (props.variant) {
        case "delete": {
          if (!singer) throw new Error("");
          setIsFetching(true);

          // >>> api
          await myDeleteDoc({
            collectionName: "Singers",
            id: singer.id,
          });

          if (singer.image_file_id)
            deleteFile({ fileId: singer.image_file_id });

          setIsFetching(false);
          navigate("/dashboard/singer");

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
      setErrorToast("");
    } finally {
      setIsFetching(false);
    }
  };

  return {
    isFetching,
    action,
    singer,
    setSinger,
  };
}
