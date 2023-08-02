import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { useActingGroups } from "./ActingGroupProvider";

type ContextState = { pusher: Pusher };

const PusherContext = React.createContext<ContextState | undefined>(undefined);

const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const { actingGroupId } = useActingGroups();
  const { data: session } = useSession();
  const utils = api.useContext();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    const channelName = `${actingGroupId || (session?.user.id as string)}`;
    const pusherChannel = pusher.subscribe(channelName);
    pusherChannel.bind("updated-recipes", function (data: unknown) {
      console.log("I updated recipe selections", data);

      void utils.recipes.list.invalidate();
      void utils.shoppingList.getSelectedRecipeIds.invalidate();
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, []);

  return <>{children}</>;
};

function usePusher() {
  const context = React.useContext(PusherContext);
  if (context === undefined) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context.pusher;
}

export { PusherProvider, usePusher };
