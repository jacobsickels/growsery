import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useActingGroups } from "./ActingGroupProvider";
import { Typography } from "./Typography";

interface PageProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  backLink?: string;
}

export const Page = ({ title, children, actions, backLink }: PageProps) => {
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const { register, handleSubmit } = useForm<{ name: string }>();

  const utils = api.useContext();
  const { groups, actingGroupId, setActingGroupId } = useActingGroups();

  const { data: session } = useSession();
  const { mutate: createGroup } = api.groups.create.useMutation();

  const setActiveGroup = (groupId: string | null) => {
    if (!groupId) {
      setActingGroupId(undefined);
    } else {
      setActingGroupId(groupId);
    }
  };

  const onSubmit = handleSubmit((data: { name: string }) => {
    createGroup(data, {
      onSuccess: () => {
        void utils.groups.list.invalidate();
        setCreateGroupModalOpen(false);
      },
    });
  });

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
              onCreateNewGroup={() => setCreateGroupModalOpen(true)}
              value={actingGroupId || session.user.id}
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

      <Dialog
        open={createGroupModalOpen}
        onOpenChange={setCreateGroupModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Would you like to create a new family group?
            </DialogTitle>
            <DialogDescription>
              This will create a family group and assign your user to the newly
              created group. You will be able to switch to the newly created
              group after creation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => void onSubmit(e)}>
            <Input label="Name" {...register("name")} />

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setCreateGroupModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
