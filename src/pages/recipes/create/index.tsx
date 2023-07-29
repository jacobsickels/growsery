"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paper } from "@/components/ui/paper";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
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

export default CreateRecipe;
