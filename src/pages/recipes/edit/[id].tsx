"use client";

import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { TextField } from "~/components/TextField";
import { Typography } from "~/components/Typography";
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
    <form className="flex flex-col" onSubmit={(e) => void onSubmit(e)}>
      <Typography.H1>Edit Recipe</Typography.H1>

      <TextField label="Name" {...register("name")} />
      <TextField label="Description" {...register("description")} />
      <TextField label="Servings" type="number" {...register("servings")} />

      <button type="submit">Save</button>
    </form>
  );
};

export default EditRecipe;
