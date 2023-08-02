import Pusher from "pusher-js";
import React from "react";

type ContextState = { pusher: Pusher };

const PusherContext = React.createContext<ContextState | undefined>(undefined);

const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const [pusher] = React.useState(
    new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    })
  );
  const value = { pusher };

  return (
    <PusherContext.Provider value={value}>{children}</PusherContext.Provider>
  );
};

function usePusher() {
  const context = React.useContext(PusherContext);
  if (context === undefined) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context.pusher;
}

export { PusherProvider, usePusher };
