"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paper } from "@/components/ui/paper";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useActingGroups } from "~/components/ActingGroupProvider";
import { Page } from "~/components/Page";
import { api } from "~/utils/api";

type FormState = {
  name: string;
  description?: string;
  servings: string;
};

export const EditRecipe = () => {
  const router = useRouter();
  const { actingGroupId } = useActingGroups();
  const { mutate } = api.recipes.upsert.useMutation();
  const { register, handleSubmit, setValue } = useForm<FormState>();

  const recipeId = router.query.id as string;

  const { isLoading } = api.recipes.get.useQuery(
    {
      id: recipeId,
    },
    {
      onSuccess: (recipe) => {
        if (recipe) {
          setValue("name", recipe.name);
          setValue("description", recipe.description || undefined);
          setValue("servings", `${recipe.servings || 1}`);
        }
      },
    }
  );

  const onSubmit = handleSubmit((data: FormState) => {
    mutate(
      {
        ...data,
        servings: parseInt(data.servings, 10),
        id: recipeId,
        groupId: actingGroupId,
      },
      {
        onSuccess: () => {
          void router.push("/recipes/" + recipeId);
        },
      }
    );
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Page title="Edit Recipe" backLink={"/recipes/" + recipeId}>
      <form onSubmit={(e) => void onSubmit(e)}>
        <Paper className="flex flex-col space-y-4">
          <div className="grid grid-cols-2">
            <Input label="Name" {...register("name")} />
          </div>
          <div className="grid grid-cols-2">
            <Textarea label="Description" {...register("description")} />
          </div>
          <div className="grid grid-cols-2">
            <Input
              label="Servings"
              type="number"
              {...register("servings", { valueAsNumber: true })}
            />
            <div className="mt-6 flex justify-end space-x-4">
              <Link href="/recipes">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </Paper>
      </form>
    </Page>
  );
};

export default EditRecipe;
