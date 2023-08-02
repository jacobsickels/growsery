import { type Group } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/utils/api";

type ContextState = {
  groups: Group[] | undefined;
  actingGroupId: string | undefined;
  setActingGroupId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const ActingGroupContext = React.createContext<ContextState | undefined>(
  undefined
);

const ActingGroupProvider = ({ children }: { children: React.ReactNode }) => {
  const [actingGroupId, setActingGroupId] = useState<string | undefined>(
    undefined
  );
  const { data: groups } = api.groups.list.useQuery();
  const value = { groups, actingGroupId, setActingGroupId };

  return (
    <ActingGroupContext.Provider value={value}>
      {children}
    </ActingGroupContext.Provider>
  );
};

function useActingGroups() {
  const context = React.useContext(ActingGroupContext);
  if (context === undefined) {
    throw new Error(
      "useActingGroups must be used within a ActingGroupProvider"
    );
  }
  return context;
}

export { ActingGroupProvider, useActingGroups };
