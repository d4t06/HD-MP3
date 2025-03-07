import { myAddDoc, myDeleteDoc, myUpdateDoc } from "@/services/firebaseService";
import { useState } from "react";

export default function useSingerAction() {
  const [isFetching, setIsFetching] = useState(false);

  type Add = {
    type: "add";
    data: SingerSchema;
  };

  type Edit = {
    type: "edit";
    data: SingerSchema;
    id: string;
  };

  type Delete = {
    type: "delete";
    id: string;
  };

  const action = async (props: Add | Edit | Delete) => {
    setIsFetching(true);

    switch (props.type) {
      case "add": {
        const docRef = await myAddDoc({
          collectionName: "Singers",
          data: props.data,
        });

        const newSinger = { ...props.data, id: docRef.id } as Singer;

        setIsFetching(false);

        return newSinger;
      }

      case "edit": {
        await myUpdateDoc({
          collectionName: "Singers",
          data: props.data,
          id: props.id,
        });

        setIsFetching(false);

        break;
      }

      case "delete": {
        await myDeleteDoc({
          collectionName: "Singers",
          id: props.id,
        });

        setIsFetching(false);

        break;
      }
    }
  };
  return { isFetching, action };
}
