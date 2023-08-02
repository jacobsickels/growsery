import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { PusherProvider } from "../components/PusherProvider";

import { api } from "~/utils/api";

import { ActingGroupProvider } from "~/components/ActingGroupProvider";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ActingGroupProvider>
        <PusherProvider>
          <Component {...pageProps} />
        </PusherProvider>
      </ActingGroupProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
