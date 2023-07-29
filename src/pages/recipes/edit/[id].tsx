"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Page } from "~/components/Page";
import { api } from "~/utils/api";

type FormState = {
  name: string;
  description?: string;
  servings: string;
};

export const EditRecipe = () => {
  const router = useRouter();
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
      { ...data, servings: parseInt(data.servings, 10), id: recipeId },
      {
        onSuccess: () => {
          void router.push("/recipes");
        },
      }
    );
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Page title="Edit Recipe" backLink={"/recipes/" + recipeId}>
      <div className="grid grid-cols-2">
        <div>
          <form
            className="flex flex-col space-y-4"
            onSubmit={(e) => void onSubmit(e)}
          >
            <Input label="Name" {...register("name")} />
            <Textarea label="Description" {...register("description")} />
            <Input
              label="Servings"
              type="number"
              {...register("servings", { valueAsNumber: true })}
            />

            <div className="mt-4 flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default EditRecipe;
