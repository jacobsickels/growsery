"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";
import { ProduceSelect } from "~/components/ProduceSelect";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Unit } from "@prisma/client";
import { TextField } from "~/components/TextField";
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

const UNITS: Array<{ label: string; value: Unit }> = [
  { label: "None", value: "NONE" },
  { label: "oz", value: "OUNCE" },
  { label: "lb", value: "POUND" },
  { label: "tbsp.", value: "TABLE_SPOON" },
  { label: "tsp.", value: "TEA_SPOON" },
  { label: "cup", value: "CUP" },
  { label: "fl oz", value: "FLUID_OUNCE" },
  { label: "pint", value: "PINT" },
  { label: "quart", value: "QUART" },
  { label: "gallon", value: "GALLON" },
];

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
    <>
      <div className="flex">
        <Typography.H1>{recipe.name}</Typography.H1>
        <Typography.Span>Serves {recipe?.servings} people</Typography.Span>
        <Link href={"/recipes/edit/" + recipe.id} className="text-blue-600">
          Edit Recipe
        </Link>
      </div>
      <Typography.P>{recipe?.description}</Typography.P>

      <Typography.H2>Ingredients</Typography.H2>

      <form className="flex flex-col" onSubmit={(e) => void onSubmit(e)}>
        {fields.map((field, index) => (
          <div key={field.id} className="border-b">
            <Controller
              name={`ingredients.${index}.produce`}
              control={control}
              render={({ field }) => <ProduceSelect {...field} />}
            />
            <p>{errors.ingredients?.[index]?.produce?.message}</p>

            <TextField
              type="number"
              label="Amount"
              {...register(`ingredients.${index}.amount`, {
                valueAsNumber: true,
              })}
            />
            <p>{errors.ingredients?.[index]?.amount?.message}</p>

            <Controller
              name={`ingredients.${index}.unit`}
              control={control}
              render={({ field }) => <Select {...field} options={UNITS} />}
            />
            <p>{errors.ingredients?.[index]?.unit?.message}</p>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            append({ amount: "0", unit: { label: "None", value: "NONE" } })
          }
        >
          Add Ingredient
        </button>

        <button type="submit">Save</button>
      </form>
    </>
  );
};

export default ViewRecipe;
