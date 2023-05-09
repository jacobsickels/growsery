"use client";

import { useForm } from "react-hook-form";
import { TextField } from "~/components/TextField";
import { Typography } from "~/components/Typography";
import { api } from "~/utils/api";

type FormState = { name: string; description?: string; servings: string };

export const CreateRecipe = () => {
  const { mutate } = api.recipes.create.useMutation();

  const { register, handleSubmit } = useForm<FormState>();

  const onSubmit = handleSubmit((data: FormState) => {
    mutate({ ...data, servings: parseInt(data.servings, 10) });
  });

  return (
    <form className="flex flex-col" onSubmit={(e) => void onSubmit(e)}>
      <Typography.H1>Create Recipe</Typography.H1>

      <TextField label="Name" {...register("name")} />
      <TextField label="Description" {...register("description")} />
      <TextField label="Servings" type="number" {...register("servings")} />

      <button type="submit">Save</button>
    </form>
  );
};

export default CreateRecipe;
