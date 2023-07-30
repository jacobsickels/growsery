import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";
import { Typography } from "./Typography";

interface PageProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  backLink?: string;
}

export const Page = ({ title, children, actions, backLink }: PageProps) => {
  const utils = api.useContext();
  const { data: session } = useSession();
  const { data: groups } = api.groups.list.useQuery();
  const { mutate } = api.groups.setActingGroup.useMutation();

  const setActiveGroup = (groupId: string | null) => {
    if (!groupId) {
      mutate(
        { groupId: undefined },
        {
          onSettled: () => {
            void utils.recipes.list.invalidate();
            void utils.shoppingList.get.invalidate();
          },
        }
      );
    } else {
      mutate(
        { groupId },
        {
          onSettled: () => {
            void utils.recipes.list.invalidate();
            void utils.shoppingList.get.invalidate();
          },
        }
      );
    }
  };

  return (
    <div className="container mx-auto mt-8 content-center">
      <div className="mb-4 flex">
        <div className="flex-1">
          {backLink && (
            <Link href={backLink}>
              <Button variant="ghost">
                <ChevronLeft className="-ml-2 mr-2" /> Back
              </Button>
            </Link>
          )}
        </div>

        <div className="flex justify-end">
          {session && (
            <Combobox
              defaultValue={session.user.actingGroupId || session.user.id}
              onChange={setActiveGroup}
              options={(groups || [])?.map((group) => ({
                label: group.name,
                value: group.id,
              }))}
              self={{
                label: session.user.name || session.user.email || "My User",
                value: session.user.id,
              }}
            />
          )}
        </div>
      </div>

      <div className="mb-4 flex">
        <Typography.H1 className="flex-1">{title}</Typography.H1>
        <div>{actions}</div>
      </div>
      {children}
    </div>
  );
};
