"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";
import { ProduceSelect } from "~/components/ProduceSelect";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Servings } from "@/components/ui/servings";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Unit } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { UNITS } from "~/_shared/constants";
import { Page } from "~/components/Page";
import { Typography } from "~/components/Typography";
import { api } from "~/utils/api";

const schema = z.object({
  ingredients: z.array(
    z.object({
      id: z.string().optional(),
      amount: z.number().gt(0),
      unit: z.object({
        label: z.string(),
        value: z.string(), // Should be Unit Enum
      }),
      produce: z.object({
        label: z.string(),
        value: z.string(), // Should be Unit Enum
      }),
    })
  ),
});

type FormState = {
  ingredients: Array<{
    amount: string;
    produce?: { label: string; value: string; __isNew__?: boolean };
    unit: { label: string; value: Unit };
  }>;
};

export const ViewRecipe = () => {
  const router = useRouter();
  const recipeId = router.query.id as string;

  const { data: recipe, isLoading } = api.recipes.get.useQuery(
    {
      id: recipeId,
    },
    {
      onSuccess: (recipe) => {
        if (recipe) {
          setValue(
            "ingredients",
            recipe.ingredients.map((ingredient) => ({
              ...ingredient,
              amount: ingredient.amount.toString(),
              unit: UNITS.find((u) => u.value === ingredient.unit)!,
              produce: {
                label: ingredient.produce.name,
                value: ingredient.produceId,
              },
            }))
          );
        }
      },
    }
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormState>({
    resolver: zodResolver(schema),
  });
  const { fields, append } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { mutate } = api.recipes.updateIngredients.useMutation();
  const onSubmit = handleSubmit((data: FormState) => {
    mutate({
      ...data,
      id: recipeId,
      ingredients: data.ingredients.map(({ produce, ...ingredient }) => ({
        ...ingredient,
        amount: parseInt(ingredient.amount, 10),
        produceName: produce!.label,
        produceId: produce!.__isNew__ ? undefined : produce!.value,
      })),
    });
  });

  if (isLoading || !recipe) {
    return <p>Loading...</p>;
  }

  console.log({ errors });

  return (
    <Page
      title={recipe.name}
      backLink="/recipes"
      actions={
        <>
          <Servings servings={recipe?.servings} />
          <Link href={"/recipes/edit/" + recipe.id} className="ml-4">
            <Button variant="outline">Edit Recipe</Button>
          </Link>
        </>
      }
    >
      <div className="mb-8 flex">
        <Typography.P className="flex-1 text-slate-600">
          {recipe?.description}
        </Typography.P>
      </div>

      <Typography.H2>Ingredients</Typography.H2>

      <form onSubmit={(e) => void onSubmit(e)}>
        <Paper className="flex flex-col space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 space-x-4">
              <Controller
                name={`ingredients.${index}.produce`}
                control={control}
                render={({ field }) => (
                  <ProduceSelect
                    {...field}
                    label="Name"
                    id={`ingredients.${index}.produce`}
                    error={errors.ingredients?.[index]?.produce?.message}
                  />
                )}
              />

              <div className="grid grid-cols-3 space-x-4">
                <Input
                  type="number"
                  label="Amount"
                  id={`ingredients.${index}.amount`}
                  {...register(`ingredients.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                  error={errors.ingredients?.[index]?.amount?.message}
                />

                <Controller
                  name={`ingredients.${index}.unit`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor={`ingredients.${index}.unit`}>Unit</Label>
                      <Select
                        {...field}
                        options={UNITS}
                        id={`ingredients.${index}.unit`}
                      />

                      <p>{errors.ingredients?.[index]?.unit?.message}</p>
                    </div>
                  )}
                />

                <div className="mt-7 flex justify-end">
                  <button type="button">
                    <Trash2 className="hover:text-primary" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="my-4 flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ amount: "0", unit: { label: "None", value: "NONE" } })
              }
            >
              Add Ingredient
            </Button>
          </div>
        </Paper>

        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Page>
  );
};

export default ViewRecipe;
