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
  servings: number;
};

export const CreateRecipe = () => {
  const router = useRouter();
  const { mutate } = api.recipes.upsert.useMutation();

  const { register, handleSubmit } = useForm<FormState>();

  const onSubmit = handleSubmit((data: FormState) => {
    mutate(data, {
      onSuccess: () => {
        void router.push("/recipes");
      },
    });
  });

  return (
    <Page title="Create Recipe" backLink={"/recipes"}>
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

export default CreateRecipe;
