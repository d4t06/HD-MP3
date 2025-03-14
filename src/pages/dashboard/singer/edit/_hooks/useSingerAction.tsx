import { useState } from "react";
import { useAuthContext, useToastContext } from "@/stores";
import { deleteFile, myDeleteDoc } from "@/services/firebaseService";
import { useNavigate } from "react-router-dom";
import { useSingerContext } from "@/stores/dashboard/SingerContext";

type Delete = {
  variant: "delete";
};

export type SingerActionProps = Delete;

export default function useDashboardSingerAction() {
  // stores
  const { user } = useAuthContext();

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const navigate = useNavigate();
  const { setErrorToast } = useToastContext();

  const { singer } = useSingerContext();

  const action = async (props: SingerActionProps) => {
    try {
      if (!user) return;

      switch (props.variant) {
        case "delete": {
          if (!singer) throw new Error("");
          setIsFetching(true);

          // >>> api
          await myDeleteDoc({
            collectionName: "Singers",
            id: singer.id,
          });

          if (singer.image_file_path)
            await deleteFile({ filePath: singer.image_file_path });

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
  };
}
